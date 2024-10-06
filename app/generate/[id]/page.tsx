"use client";

import { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react"; // TinyMCE editor
import type { Editor as TinyMCEEditor } from "tinymce"; // Import TinyMCE types
import ResumeUpload from "../../../components/ResumeUpload";
import EditorSidebar from "../../../components/EditorSidebar";
import { generateResume } from "../../../functions/generateResume";

import { useGlobalContext } from "@/app/GlobalContext";

interface Params {
  id: string;
}

const GeneratePage = ({ params }: { params: Params }) => {
  const { id } = params;
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const { resumeList, setResumeList } = useGlobalContext();

  // Define section ordering state in the parent component
  const [items, setItems] = useState<string[]>(['Education', 'Experience', 'Projects', 'Skills']);

  // Function to handle updates to the items order
  const handleListUpdate = (newOrder: string[]) => {
    setItems(newOrder);
    console.log('Updated order in parent:', newOrder); // Log in the parent when the order changes
  };

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const setEditorContent = (newContent: string) => {
    if (editorRef.current) {
      editorRef.current.setContent(newContent); // Set new content in the editor
    }
  };

  const genResume = () => {
    console.log("Generating resume");
    const resumeString = generateResume(items);
    console.log("Generated resume string: ", resumeString);
    setEditorContent(resumeString);
  };

  const simulatePageBreaks = () => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const editorContent = editor.getBody();
    const pageHeightPx = 1123; // A4 height in pixels
    let accumulatedHeight = 0;

    // Clear previous page breaks
    const pageBreaks = editorContent.querySelectorAll(".page-break");
    pageBreaks.forEach((breakEl) => breakEl.remove());

    console.log("Simulating page breaks");

    Array.from(editorContent.childNodes).forEach((node) => {
      const nodeElement = node as HTMLElement;
      accumulatedHeight += nodeElement.offsetHeight;

      if (accumulatedHeight > pageHeightPx) {
        const pageBreak = editor.getDoc().createElement("div");
        pageBreak.className = "page-break";
        pageBreak.style.borderTop = "1px dashed black";
        pageBreak.style.margin = "40px 0";

        editorContent.insertBefore(pageBreak, nodeElement);

        accumulatedHeight = nodeElement.offsetHeight;
      }
    });
  };

  const handleEditorInit = (evt: any, editor: TinyMCEEditor) => {
    editorRef.current = editor;

    editor.on("keyup", () => {
      console.log("Keyup detected");
      simulatePageBreaks();
    });

    editor.on("change", () => {
      console.log("Change detected");
      simulatePageBreaks();
    });

    editor.on("NodeChange", () => {
      console.log("Node change detected");
      simulatePageBreaks();
    });

    simulatePageBreaks();
  };

  const exportToPDF = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      const tempElement = document.createElement("div");
      tempElement.innerHTML = content;
  
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
  
      const html2pdf = (await import("html2pdf.js")).default;
  
      const opt = {
        margin: 10,
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 3, logging: true, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
  
      html2pdf().from(tempElement).set(opt).save();
    }
  };
  
  const getGlobal = () => {
    console.log(resumeList[1].link);
  }

  useEffect(() => {
    // Call the scraper API here
  }, []);

  return (
    <div className="flex flex-row">
      <div className="basis-[70%] border border-green-500">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={handleEditorInit}
        initialValue="<p style='color: blue;'>This is the initial content of the editor.</p>"
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
          setup: (editor) => {
            editor.ui.registry.addButton("exportpdf", {
              text: "Export PDF",
              onAction: exportToPDF,
            });
          },
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

        <button onClick={log}>Log editor content</button>
        <button onClick={() => setEditorContent("<p>This is some new content!</p>")}>Set New Content</button>
        <button onClick={genResume}>Generate Resume</button>
        <button onClick={getGlobal}>Get Global</button>

        <ResumeUpload />
      </div>
      <div className="basis-[30%]">
        {/* Pass items and handleListUpdate to EditorSidebar */}
        <EditorSidebar items={items} setItems={handleListUpdate} />
      </div>
    </div>
  );
};

export default GeneratePage;
