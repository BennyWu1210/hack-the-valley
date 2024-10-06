package scrape

import (
    "fmt"
    "net/http"
    "regexp"
    "strings"

    "github.com/PuerkitoBio/goquery"
    "github.com/gin-gonic/gin"
)

type JobLinkRequest struct {
    Link string `json:"link" binding:"required"`
}

func ScrapeJobDescription(c *gin.Context) {
    var request JobLinkRequest

    // Bind the incoming JSON to JobLinkRequest struct
    if err := c.ShouldBindJSON(&request); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request, 'link' is required"})
        return
    }

    // Call the function to scrape the entire page content
    content, err := getFullPageContent(request.Link)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scrape the page content"})
        return
    }

    // Return the entire page content as a string
    c.JSON(http.StatusOK, gin.H{"page_content": content})
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
