package main

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"example/backend/resume"
	//openai
	"context"
	"encoding/json"
	openai "github.com/sashabaranov/go-openai"
)



// resume block=---------------------------------------
type TextInput struct {
	Resume string `json:"Resume"`
}
// generates 5 blocks from master resume that is most relavent to the job description
// post request to recieve resume in text formate
// send the resume to GPT with the full prompte
// recieve the 5 blocks as a JSON response
func gnerateBlock(c *gin.Context) {
	var input TextInput

	// Bind the JSON request body to the struct
	if err := c.ShouldBindJSON(&input); err != nil {
		// If there is an error in binding, return a bad request response
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	prePrompt := "Response ONLY in valid JSON format with the structure"
	question := "You are an expert at breaking down complex resume experiences provided below into individual sections. Please respond with 5 section. "
	//content := input.Resume


	responseText := GPTResponse(prePrompt, question, "I worked at google as a software engineer doing backend dev with java spring boot from 2023-2027 at toronto canada")

	// Return the new text
	var jsonResponse []map[string]interface{}
	if err := json.Unmarshal([]byte(responseText), &jsonResponse); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":    "Invalid JSON format returned by GPT",
			"response": responseText,
		})
		return
	}

	// Return the parsed JSON response
	c.JSON(http.StatusOK, responseText)

}

// get request to /test
func GPTResponse(prePrompt string, question string, content string) string {
	fullPrompt := prePrompt + "\n\n" + question + "\n\n" + content

	client := openai.NewClient("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")
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4o, // Correct model name is: GPT4, GPT3Dot5Turbo
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: fullPrompt,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return "" // Fix return type
	}

	return resp.Choices[0].Message.Content
}

func getOutput(c *gin.Context) {
	fmt.Println("Hello World")
	c.IndentedJSON(http.StatusOK, GPTResponse("", "What is the capital of France?", ""))
}

func main() {
	router := gin.Default()

	router.GET("/test", getOutput)
	router.POST("/blocks", gnerateBlock)
	router.POST("/blocks1", resume.GenerateResumeHandler)
	router.Run("localhost:8080")
}
