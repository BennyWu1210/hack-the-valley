package main

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"example/backend/resume"
	"example/backend/scrape"
	"github.com/gin-contrib/cors"
	
	//openai
	"context"
	openai "github.com/sashabaranov/go-openai"
)

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
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Replace with your frontend's origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.GET("/test", getOutput)
	router.POST("/blocks", resume.GenerateResumeHandler)
	router.POST("/scrape", scrape.ScrapeJobDescription)
	router.Run("localhost:8080")
}
