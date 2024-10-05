import React from "react";
import pdfToText from "react-pdftotext"; // Ensure this is installed

// Define a function to handle the file upload and text extraction
const extractText = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]; // Optional chaining to handle cases when no file is selected
  if (file) {
    pdfToText(file)
      .then((text) => {
        console.log("Original Extracted Text:", text);
        
        // Clean the extracted text to make it JSON-safe
        const cleanedText = cleanTextForJSON(text);
        
        // Log the cleaned text
        console.log("Cleaned Text:", cleanedText);
        
        // Here, you could also further process or pass the cleaned text as needed
      })
      .catch((error) => console.error("Failed to extract text from PDF", error));
  } else {
    console.error("No file selected");
  }
};

// Define the function to clean the extracted text
const cleanTextForJSON = (text: string): string => {
  // Replace problematic characters such as newlines, tabs, and non-printable characters
  return text
    .replace(/[\r\n\t]+/g, " ") // Replace newlines and tabs with spaces
    .replace(/[^\x20-\x7E]/g, "") // Remove non-ASCII characters
    .trim(); // Trim leading and trailing whitespace
};

// Define the ResumeUpload component
export const ResumeUpload: React.FC = () => {
  return (
    <div>
      <input type="file" accept="application/pdf" onChange={extractText} />
    </div>
  );
};

// Export the ResumeUpload component as default
export default ResumeUpload;
