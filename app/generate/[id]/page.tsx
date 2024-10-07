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
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Params {
  id: string;
}

const GeneratePage = ({ params }: { params: Params }) => {
  const { id } = params;
  const editorRef = useRef<TinyMCEEditor | null>(null); // Correctly type the editorRef
  const { resumeList, setResumeList } = useGlobalContext();
  const { masterResumeText, setMasterResumeText } = useGlobalContext();

  const router = useRouter();

  // Section order state
  const [items, setItems] = useState<string[]>(['Education', 'Experience', 'Projects', 'Skills']);
  
  // Loading and info state for fetched API data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [info, setInfo] = useState<any>(null);

  // Loading state for the process
  const [loadingState, setLoadingState] = useState<string>("");  // "" means done loading, non-empty string shows a message

  const scores = {
    overallScore: 7.4,
    contentAccuracy: 8.3,
    creativity: 7.1,
    organizationClarity: 6.2,
    technicalSkills: 8.2,
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

  const handleRegenerate = async () => {
    console.log("Regenerating resume...");
    setLoadingState("Regenerating resume...");
  
    try {
      // Convert info to a JSON string
      const infoString = info ? JSON.stringify(info) : '';
  
      // Fetch blocks and regenerate the resume content
      const blocks = await fetchBlocks(masterResumeText, infoString); // Pass infoString instead of info
      await generateResume(items, blocks, setLoadingState, editorRef); // Await the resume generation and pass editorRef
  
      setLoadingState("");  // Done regenerating
    } catch (error) {
      console.error('Error fetching blocks or generating resume:', error);
      setLoadingState("");  // Error, stop loading
    }
  };

  useEffect(() => {
    console.log("Master text:", masterResumeText);
    const resumeLink = resumeList[resumeList.length - 1].link;
    console.log("Resume link:", resumeLink);
  
    const callScraperAPI = async () => {
      try {
        setLoadingState("Fetching job data...");
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
      } catch (error) {
        console.error("Error calling scraper API:", error);
        setIsLoading(false); // Stop the loading spinner if an error occurs
        setLoadingState("");  // Stop loading if an error occurs
      }
    };
  
    callScraperAPI();
  }, [resumeList]);
  
  useEffect(() => {
    if (info !== null) {
      const infoString = info ? JSON.stringify(info) : ''; // Convert info to JSON string
  
      setLoadingState("Fetching resume blocks...");
      fetchBlocks(masterResumeText, infoString)
        .then(async (blocks) => {
          console.log("Job desc: ", infoString);
          await generateResume(items, blocks, setLoadingState, editorRef); // Await the resume generation and pass editorRef
  
          setLoadingState("");  // Done
        })
        .catch((error) => {
          console.error('Error fetching blocks:', error);
          setLoadingState("");  // Stop loading if an error occurs
        });
    }
  }, [info]); // Trigger this effect only when info changes
  

  const exportToPDF = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();

      // Create a temporary div to hold content for export
      const tempElement = document.createElement("div");
      tempElement.innerHTML = content;

      // Apply the same styles used in the editor
      const style = document.createElement("style");
      style.textContent = `
      @font-face {
        font-family: 'Lato';
        src: url('/fonts/Lato-Regular.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      body {
        font-family: 'Lato', Helvetica, Arial, sans-serif;
        font-size: 14px;
        color: black;
        line-height: 1.5;
        padding: 25px;
        margin: 0;
      }
      h1 {
        font-size: 32px;
        font-weight: 800;
        text-align: center;
        margin-bottom: 10px;
      }
      strong {
        letter-spacing: -0.4x;
      }
      p {
        font-size: 14px;
        margin: 0;
        padding-bottom: 5px;
        letter-spacing: -0.5px;
      }
      .page-break {
        display: block;
        page-break-before: always;
        border-top: 1px dashed black;
        margin: 40px 0;
      }
      `;

      tempElement.appendChild(style);

      // Conditionally import html2pdf.js on the client side
      const html2pdf = (await import("html2pdf.js")).default;

      const opt = {
        margin: 10,
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2, // Higher scale for better resolution
          logging: true, // Log issues
          useCORS: true, // Ensure all content is loaded with proper CORS
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(tempElement).set(opt).save();
    }
  };

  return (
    <div className="flex flex-row">
      <div className="basis-[70%] flex justify-center items-start relative">
        {/* Show spinner if loadingState is not empty */}
        {loadingState && (
          <div className="absolute z-10 align-center items-center flex flex-col py-64 bg-slate-400 opacity-70 h-full w-full">
            <LoadingSpinner className="w-40 h-40" />
            <h1 className="text-4xl mt-12">{loadingState}</h1> {/* Display the loading state */}
          </div>
        )}
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
            setup: (editor) => {
              editor.ui.registry.addButton('exportpdf', {
                text: 'Export PDF',
                onAction: exportToPDF
              });
            },
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
              width: 700px;
              overflow-y: scroll;
              position: relative;
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
        <EditorSidebar items={items} setItems={handleListUpdate} info={info} isLoading={isLoading} scores={scores} handleRegenerate={handleRegenerate} />
      </div>
    </div>
  );
};

export default GeneratePage;
