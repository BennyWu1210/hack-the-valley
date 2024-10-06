package resume

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
)

const openaiURL = "https://api.openai.com/v1/chat/completions"

// Structures for the GPT request/response handling

type GPT4Request struct {
	Model          string         `json:"model"`
	Messages       []Message      `json:"messages"`
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
	Type       string          `json:"type"`
	Properties ResumeStructure `json:"properties"`
	Required   []string        `json:"required"`
}

type ResumeStructure struct {
	ContactInformation  ContactInfoSchema  `json:"contact_information"`
	ProfessionalSummary Property           `json:"professional_summary"`
	Experience          ExperienceSchema   `json:"experience"`
	Education           EducationSchema    `json:"education"`
	Projects            ProjectsSchema     `json:"projects"`
	ProgramingLanguages LanguagesSchema    `json:"programinglanguages"`
	Technologies        TechnologiesSchema `json:"technologies"`
}

type ContactInfoSchema struct {
	Type       string      `json:"type"`
	Properties ContactInfo `json:"properties"`
	Required   []string    `json:"required"`
}

type ContactInfo struct {
	Name     Property `json:"name"`
	Email    Property `json:"email"`
	Website  Property `json:"website"`
	GitHub   Property `json:"github"`
	LinkedIn Property `json:"linkedin"`
}

type ExperienceSchema struct {
	Type  string     `json:"type"`
	Items Experience `json:"items"`
}

type Experience struct {
	Type       string    `json:"type"`
	Properties JobDetail `json:"properties"`
	Required   []string  `json:"required"`
}

type JobDetail struct {
	JobTitle    Property `json:"job_title"`
	Company     Property `json:"company"`
	Location    Property `json:"location"` // Added location field
	StartDate   Property `json:"start_date"`
	EndDate     Property `json:"end_date"`
	Description Property `json:"description"`
}

type EducationSchema struct {
	Type  string    `json:"type"`
	Items Education `json:"items"`
}

type Education struct {
	Type       string     `json:"type"`
	Properties DegreeInfo `json:"properties"`
	Required   []string   `json:"required"`
}

type DegreeInfo struct {
	Degree         Property `json:"degree"`
	Institution    Property `json:"institution"`
	StartingYear   Property `json:"starting_year"` // Added starting year field
	GraduationYear Property `json:"graduation_year"`
	Description    Property `json:"description"`
}

type ProjectsSchema struct {
	Type  string  `json:"type"`
	Items Project `json:"items"`
}

type Project struct {
	Type       string       `json:"type"`
	Properties ProjectProps `json:"properties"`
	Required   []string     `json:"required"`
}

type ProjectProps struct {
	ProjectName      Property           `json:"project_name"`
	Description      Property           `json:"description"`
	TechnologiesUsed TechnologiesSchema `json:"technologies_used"`
	StartDate        Property           `json:"start_date"`
	EndDate          Property           `json:"end_date"`
}

type LanguagesSchema struct {
	Type  string   `json:"type"`
	Items Property `json:"items"`
}

type TechnologiesSchema struct {
	Type  string   `json:"type"`
	Items Property `json:"items"`
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

// Request struct to capture the resume string passed in the POST request
type TextInput struct {
	JobDescription string `json:"job_description"`
	Resume         string `json:"resume"`
}

// Exported function: GenerateResumeHandler
func GenerateResumeHandler(c *gin.Context) {
	apiKey := ""
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
		{Role: "system", Content: "You are a helpful assistant who generates structured resumes. Wrap the text that is most relevant to the job description with <strong></strong> tag. Description should all be in bullet point formate"},
		{Role: "user", Content: "Please generate a structured resume from the following input that is most relevant to the job description\n\nResume:" + input.Resume + "\n\njob description:" + input.JobDescription},
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
						ContactInformation: ContactInfoSchema{
							Type: "object",
							Properties: ContactInfo{
								Name:     Property{Type: "string"},
								Email:    Property{Type: "string"},
								Website:  Property{Type: "string"}, // Added website field
								GitHub:   Property{Type: "string"}, // Added GitHub field
								LinkedIn: Property{Type: "string"}, // Added LinkedIn field
							},
							Required: []string{"name", "email", "website", "github", "linkedin"},
						},
						ProfessionalSummary: Property{Type: "string"},
						Experience: ExperienceSchema{
							Type: "array",
							Items: Experience{
								Type: "object",
								Properties: JobDetail{
									JobTitle:    Property{Type: "string"},
									Company:     Property{Type: "string"},
									Location:    Property{Type: "string"}, // Added location field
									StartDate:   Property{Type: "string"},
									EndDate:     Property{Type: "string"},
									Description: Property{Type: "string"},
								},
								Required: []string{"job_title", "company", "location", "start_date", "description"},
							},
						},
						Education: EducationSchema{
							Type: "array",
							Items: Education{
								Type: "object",
								Properties: DegreeInfo{
									Degree:         Property{Type: "string"},
									Institution:    Property{Type: "string"},
									StartingYear:   Property{Type: "string"}, // Added starting year field
									GraduationYear: Property{Type: "string"},
									Description:    Property{Type: "string"},
								},
								Required: []string{"degree", "institution", "starting_year", "graduation_year"},
							},
						},
						Projects: ProjectsSchema{
							Type: "array",
							Items: Project{
								Type: "object",
								Properties: ProjectProps{
									ProjectName: Property{Type: "string"},
									Description: Property{Type: "string"},
									TechnologiesUsed: TechnologiesSchema{
										Type: "array",
										Items: Property{
											Type: "string",
										},
									},
									StartDate: Property{Type: "string"},
									EndDate:   Property{Type: "string"},
								},
								Required: []string{"project_name", "description", "technologies_used"},
							},
						},
						ProgramingLanguages: LanguagesSchema{
							Type: "array",
							Items: Property{
								Type: "string",
							},
						},
						Technologies: TechnologiesSchema{
							Type: "array",
							Items: Property{
								Type: "string",
							},
						},
					},
					Required: []string{"contact_information", "professional_summary", "experience", "education", "projects", "programinglanguages", "technologies"},
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
	fmt.Println("====", resp)
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
	var parsedResume map[string]interface{}
	err = json.Unmarshal([]byte(content), &parsedResume)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing inner JSON from content"})
		return
	}

	// Return the parsed resume in the required format
	c.JSON(http.StatusOK, parsedResume)
}
