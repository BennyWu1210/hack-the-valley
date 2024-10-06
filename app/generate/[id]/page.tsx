"use client";

import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react"; // TinyMCE editor
import type { Editor as TinyMCEEditor } from "tinymce"; // Import TinyMCE types
import ResumeUpload from "../../../components/ResumeUpload";
import EditorSidebar from "../../../components/EditorSidebar";
import { generateResume, fetchBlocks } from "../../../functions/generateResume";
import { useGlobalContext } from "@/app/GlobalContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Params {
  id: string;
}

const GeneratePage = ({ params }: { params: Params }) => {
  const { id } = params;
  const editorRef = useRef<TinyMCEEditor | null>(null); // Correctly type the editorRef
  const { resumeList, setResumeList } = useGlobalContext();
  const router = useRouter();

  // Section order state
  const [items, setItems] = useState<string[]>(['Education', 'Experience', 'Projects', 'Skills']);
  
  // Loading and info state for fetched API data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [info, setInfo] = useState<any>(null);

  const scores = {
    overallScore: 3,
    contentAccuracy: 5,
    creativity: 10,
    organizationClarity: 7,
    technicalSkills: 10,
  };

  const handleGoBack = () => {
    router.push('/'); // Navigates to the homepage
  };

  const handleListUpdate = (newOrder: string[]) => {
    setItems(newOrder);
    console.log("Updated order in parent:", newOrder);
  };

  const setEditorContent = (newContent: string) => {
    if (editorRef.current) {
      editorRef.current.setContent(newContent); // Set new content in the editor
    }
  };

  const genResume = () => {
    console.log("Generating resume");
    const resumeString = generateResume(items, info.toString());
    console.log("Generated resume string: ", resumeString);
    setEditorContent(resumeString);
  };

  useEffect(() => {
    const resumeLink = resumeList[1].link;
    console.log("Resume link:", resumeLink);
    
    const callScraperAPI = async () => {
      try {
        const response = await fetch("http://localhost:8080/scrape", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            link: resumeLink,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setInfo(data);
        setIsLoading(false); // Set loading to false after data is fetched

        // Now fetch the blocks after info has been set
        fetchBlocks(data.toString())
          .then((blocks) => {
            // Once blocks are fetched, generate the resume
            const resumeHtml = generateResume(items, blocks);
            console.log('Generated Resume HTML:', resumeHtml);
            if (editorRef.current) {
              editorRef.current.setContent(resumeHtml); // Ensure editor is initialized before setting content
            }
          })
          .catch((error) => {
            console.error('Error fetching blocks:', error);
          });

      } catch (error) {
        console.error("Error calling scraper API:", error);
        setIsLoading(false); // Stop the loading spinner if an error occurs
      }
    };

    callScraperAPI();
  }, [resumeList]);

  return (
    <div className="flex flex-row">
      <div className="basis-[70%] flex justify-center items-start">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(event) => {
          editorRef.current = event.target as TinyMCEEditor; // Correctly assign the editor
        }}
        initialValue=""
        init={{
          height: "100vh",
          width: 700,
          menubar: false,
          plugins: [
            "advlist", "autolink", "lists", "link", "image", "charmap",
            "preview", "anchor", "searchreplace", "visualblocks", "code",
            "fullscreen", "insertdatetime", "media", "table", "code", "help", "wordcount",
          ],
          toolbar: "undo redo | blocks fontfamily | bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | removeformat | help | exportpdf",
          font_family_formats: "Lato=lato,sans-serif; Helvetica=helvetica,sans-serif; Arial=arial,sans-serif;",
          content_style: `
            @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
            body { 
              font-family: Lato, Helvetica, Arial, sans-serif; 
              font-size: 14px; 
              color: black; 
              line-height: 1.5; 
              padding: 25px; 
              box-sizing: border-box; 
              margin: 0;
              height: auto;
              width: 100%; /* Ensure content area takes full width */
              max-width: 700px; /* Optional: restrict maximum width */
              overflow-x: hidden; /* Disable horizontal scrolling */
              word-wrap: break-word; /* Wrap long content */
            }
            p, h1 {
              margin: 0;
              padding-bottom: 5px;
            }
            .page-break {
              display: block;
              page-break-before: always;
              border-top: 1px dashed black;
              margin: 40px 0;
            }
          `,
        }}
      />

        <Button variant="outline" size="icon" className="absolute bottom-5 left-5" onClick={handleGoBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="basis-[30%]">
        <EditorSidebar items={items} setItems={handleListUpdate} info={info} isLoading={isLoading} scores={scores} />
      </div>
    </div>
  );
};

export default GeneratePage;
