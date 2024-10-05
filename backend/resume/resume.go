package resume

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"github.com/gin-gonic/gin"
)

const openaiURL = "https://api.openai.com/v1/chat/completions"

// Structures for the GPT request/response handling

type GPT4Request struct {
	Model          string            `json:"model"`
	Messages       []Message         `json:"messages"`
	ResponseFormat ResponseFormat    `json:"response_format"`
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
	Type       string          `json:"type"`
	Properties ResumeStructure `json:"properties"`
	Required   []string        `json:"required"`
}

type ResumeStructure struct {
	Sections SectionSchema `json:"sections"`
}

type SectionSchema struct {
	Type  string `json:"type"`
	Items Item   `json:"items"`
}

type Item struct {
	Type       string   `json:"type"`
	Properties Section  `json:"properties"`
	Required   []string `json:"required"`
}

type Section struct {
	Section     Property `json:"section"`
	Company     Property `json:"company"`
	Location    Property `json:"location"`
	Date        Property `json:"date"`
	Description Property `json:"description"`
}

type Property struct {
	Type string `json:"type"`
}

type GPT4Response struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

type Resume struct {
	Sections []ResumeSection `json:"sections"`
}

type ResumeSection struct {
	Section     string `json:"section"`
	Company     string `json:"company"`
	Location    string `json:"location"`
	Date        string `json:"date"`
	Description string `json:"description"`
}

// Request struct to capture the resume string passed in the POST request
type TextInput struct {
	Resume string `json:"resume"`
}

// Exported function: GenerateResumeHandler
func GenerateResumeHandler(c *gin.Context) {
	apiKey := "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"
	if apiKey == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "API key is missing"})
		return
	}

	// Parse the incoming POST request body to get the resume string
	var input TextInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON request"})
		return
	}

	// Create the GPT-4 message with the provided resume content
	messages := []Message{
		{Role: "system", Content: "You are a helpful assistant who generates structured resumes."},
		{Role: "user", Content: "Here is a resume: \"" + input.Resume + "\". Please generate a structured resume with 4-5 sections. Each section should have the following fields: section, company, location, date, and description."},
	}

	// Define the schema for the expected response
	reqBody := GPT4Request{
		Model:    "gpt-4o-2024-08-06",
		Messages: messages,
		ResponseFormat: ResponseFormat{
			Type: "json_schema",
			JSONSchema: JSONSchema{
				Name: "resume_response",
				Schema: Schema{
					Type: "object",
					Properties: ResumeStructure{
						Sections: SectionSchema{
							Type: "array",
							Items: Item{
								Type: "object",
								Properties: Section{
									Section:     Property{Type: "string"},
									Company:     Property{Type: "string"},
									Location:    Property{Type: "string"},
									Date:        Property{Type: "string"},
									Description: Property{Type: "string"},
								},
								Required: []string{"section", "company", "location", "date", "description"},
							},
						},
					},
					Required: []string{"sections"},
				},
			},
		},
	}

	// Send the request to GPT-4
	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error encoding request body"})
		return
	}

	req, err := http.NewRequest("POST", openaiURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating request"})
		return
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error sending request to OpenAI"})
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading response body"})
		return
	}

	var gptResponse GPT4Response
	err = json.Unmarshal(body, &gptResponse)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing response from OpenAI"})
		return
	}

	// Extract the content of the response
	content := gptResponse.Choices[0].Message.Content

	// Parse the JSON string inside the content field into a Resume struct
	var parsedResume Resume
	err = json.Unmarshal([]byte(content), &parsedResume)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing inner JSON from content"})
		return
	}

	// Return the parsed resume in the required format
	c.JSON(http.StatusOK, parsedResume)
}
