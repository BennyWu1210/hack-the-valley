package scrape

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/gin-gonic/gin"
)

// GPT Request/Response Structures
type GPT4Request struct {
	Model          string        `json:"model"`
	Messages       []Message     `json:"messages"`
	ResponseFormat ResponseFormat `json:"response_format"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ResponseFormat struct {
	Type       string     `json:"type"`
	JSONSchema JSONSchema `json:"json_schema"`
}

type JSONSchema struct {
	Name   string `json:"name"`
	Schema Schema `json:"schema"`
}

type Schema struct {
	Type       string   `json:"type"`
	Properties JobSchema `json:"properties"`
	Required   []string `json:"required"`
}

type JobSchema struct {
	ApplicationLink Property         `json:"application_link"`
	JobTitle        Property         `json:"job_title"`
	Company         Property         `json:"company"`
	JobDescription  Property         `json:"job_description"`
	Requirements    ArrayProperty    `json:"requirements"`
	Salary          Property         `json:"salary"`
}

// Property defines the type for string fields
type Property struct {
	Type string `json:"type"`
}

// ArrayProperty defines the type for array fields with string items
type ArrayProperty struct {
	Type  string `json:"type"`
	Items Property `json:"items"`
}

// JobLinkRequest captures the input link
type JobLinkRequest struct {
	Link string `json:"link" binding:"required"`
}

// Function to scrape and send data to GPT-4 for job parsing
func ScrapeJobDescription(c *gin.Context) {
	var request JobLinkRequest

	// Bind the incoming JSON to JobLinkRequest struct
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request, 'link' is required"})
		return
	}

	// Scrape the job posting content from the link
	content, err := getFullPageContent(request.Link)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scrape the page content"})
		return
	}

	// Call GPT-4 to process and return structured job description
	gptResponse, err := getGPTResponse(content, request.Link)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process GPT response"})
		return
	}

	// Return the structured response from GPT
	c.JSON(http.StatusOK, gptResponse)
}

// Function to scrape the entire content from the webpage using goquery
func getFullPageContent(url string) (string, error) {
	// Make HTTP request to get the page content
	res, err := http.Get(url)
	if err != nil {
		return "", fmt.Errorf("failed to fetch page: %w", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return "", fmt.Errorf("error: status code %d", res.StatusCode)
	}

	// Parse the HTML using goquery
	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return "", fmt.Errorf("failed to parse HTML: %w", err)
	}

	// Extract relevant data from the HTML using goquery (e.g., scraping all text from the body tag)
	var pageContent string
	doc.Find("body").Each(func(i int, s *goquery.Selection) {
		pageContent += s.Text()
	})

	// Clean up the page content
	cleanedContent := strings.ReplaceAll(pageContent, "\n", "")
	cleanedContent = strings.TrimSpace(cleanedContent)
	re := regexp.MustCompile(`\s{2,}`)
	cleanedContent = re.ReplaceAllString(cleanedContent, " ")

	return cleanedContent, nil
}

// Function to call GPT-4 to generate structured job data with fixed schema
func getGPTResponse(jobContent string, link string) (map[string]interface{}, error) {
	apiKey := "" // Replace with your actual OpenAI API key

	if apiKey == "" {
		return nil, fmt.Errorf("API key is missing")
	}

	// Prepare the GPT-4 messages
	messages := []Message{
		{Role: "system", Content: "You are an assistant that extracts job posting details in structured format."},
		{Role: "user", Content: fmt.Sprintf("Please extract the following information from this job description (under 75 word) and structure it in the following JSON schema: application_link, job_title, company, job_description, requirements as an array, salary. Job content: %s" + link, jobContent)},
	}

	// Define the schema for the expected response, with `requirements` as an array of strings
	reqBody := GPT4Request{
		Model:    "gpt-4o-2024-08-06",
		Messages: messages,
		ResponseFormat: ResponseFormat{
			Type: "json_schema",
			JSONSchema: JSONSchema{
				Name: "job_posting_response",
				Schema: Schema{
					Type: "object",
					Properties: JobSchema{
						ApplicationLink: Property{Type: "string"},
						JobTitle:        Property{Type: "string"},
						Company:         Property{Type: "string"},
						JobDescription:  Property{Type: "string"},
						Requirements:    ArrayProperty{Type: "array", Items: Property{Type: "string"}}, // Array of strings
						Salary:          Property{Type: "string"},
					},
					Required: []string{"application_link", "job_title", "company", "job_description", "requirements", "salary"},
				},
			},
		},
	}

	// Convert the request body to JSON
	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("error encoding request body: %w", err)
	}

	// Create the HTTP request
	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	// Send the request to GPT-4
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error sending request to OpenAI: %w", err)
	}
	defer resp.Body.Close()

	// Read the response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %w", err)
	}

	// Unmarshal the response into a generic map
	var gptResponse map[string]interface{}
	err = json.Unmarshal(body, &gptResponse)
    fmt.Println("1====", gptResponse)
	if err != nil {
		return nil, fmt.Errorf("error parsing response: %w", err)
	}

	// Extract the content from the GPT response
	content, ok := gptResponse["choices"].([]interface{})
    fmt.Println("2====", content)
	if !ok || len(content) == 0 {
		return nil, fmt.Errorf("no content found in GPT response")
	}

	// Get the message content
	message, ok := content[0].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("unexpected response format")
	}

	messageContent, ok := message["message"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("unexpected message format")
	}

	contentText, ok := messageContent["content"].(string)
    fmt.Println("3====", contentText)
	if !ok {
		return nil, fmt.Errorf("unexpected content format")
	}

	// Parse the content text into a map
	var parsedResponse map[string]interface{}
	err = json.Unmarshal([]byte(contentText), &parsedResponse)
	if err != nil {
		return nil, fmt.Errorf("error parsing GPT content into map: %w", err)
	}

	// Return the structured response
	return parsedResponse, nil
}
