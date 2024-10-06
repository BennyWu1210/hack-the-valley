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

const openaiURL = "https://api.openai.com/v1/chat/completions"

// GPT Request/Response Structures
type GPT4Request struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type GPT4Response struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

// JobLinkRequest captures the input link
type JobLinkRequest struct {
	Link string `json:"link" binding:"required"`
}

// StructuredResponse is the expected response schema
type StructuredResponse struct {
	ApplicationLink string `json:"application_link"`
	JobTitle        string `json:"job_title"`
	Company         string `json:"company"`
	JobDescription  string `json:"job_description"`
	Requirements    string `json:"requirements"`
	Salary          string `json:"salary"`
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
	gptResponse, err := getGPTResponse(content)
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

	// Remove all newline characters from the page content
	cleanedContent := strings.ReplaceAll(pageContent, "\n", "")

	// Trim leading and trailing spaces
	cleanedContent = strings.TrimSpace(cleanedContent)

	// Replace consecutive spaces longer than 2 with a single space
	re := regexp.MustCompile(`\s{2,}`)
	cleanedContent = re.ReplaceAllString(cleanedContent, " ")

	// Return the cleaned content
	return cleanedContent, nil
}

// Function to call GPT-4 to generate structured job data
func getGPTResponse(jobContent string) (StructuredResponse, error) {
	apiKey := "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" // Replace with your actual OpenAI API key
	if apiKey == "" {
		return StructuredResponse{}, fmt.Errorf("API key is missing")
	}

	// Prepare the GPT-4 messages
	messages := []Message{
		{Role: "system", Content: "You are an assistant that extracts job posting details in structured format."},
		{Role: "user", Content: fmt.Sprintf("Please extract the following information from this job description and structure it in this format: {application_link, job_title, company, job_description, requirements, salary}. Job content: %s", jobContent)},
	}

	// Create the GPT-4 request body
	reqBody := GPT4Request{
		Model:    "gpt-4",
		Messages: messages,
	}

	// Convert the request body to JSON
	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return StructuredResponse{}, fmt.Errorf("error encoding request body: %w", err)
	}

	// Create the HTTP request
	req, err := http.NewRequest("POST", openaiURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		return StructuredResponse{}, fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	// Send the request to GPT-4
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return StructuredResponse{}, fmt.Errorf("error sending request to OpenAI: %w", err)
	}
	defer resp.Body.Close()

	// Read the response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return StructuredResponse{}, fmt.Errorf("error reading response body: %w", err)
	}

	// Parse the response
	var gptResponse GPT4Response
	err = json.Unmarshal(body, &gptResponse)
	if err != nil {
		return StructuredResponse{}, fmt.Errorf("error parsing response: %w", err)
	}

	// Extract the content from the GPT response
	content := gptResponse.Choices[0].Message.Content
    fmt.Println(content)

	// Parse the content into the desired schema
	var parsedResponse StructuredResponse
	err = json.Unmarshal([]byte(content), &parsedResponse)
	if err != nil {
		return StructuredResponse{}, fmt.Errorf("error parsing GPT content into schema: %w", err)
	}

	// Return the structured response
	return parsedResponse, nil
}
