"use client";

import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react"; // TinyMCE editor
import type { Editor as TinyMCEEditor } from "tinymce"; // Import TinyMCE types
import ResumeUpload from "../../../components/ResumeUpload";
import DraggableList from "../../../components/DraggableList";
import EditorSidebar from "../../../components/EditorSidebar";

interface Params {
  id: string;
}

const GeneratePage = ({ params }: { params: Params }) => {
  const { id } = params;
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [items, setItems] = useState<string[]>(['Education', 'Experience', 'Projects', 'Skills']);

  const handleListUpdate = (newOrder: string[]) => {
    setItems(newOrder);
    console.log('Updated order in parent:', newOrder); // Log in the parent when the order changes
  };

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  // Function to set content programmatically
  const setEditorContent = (newContent: string) => {
    if (editorRef.current) {
      editorRef.current.setContent(newContent); // Set new content in the editor
    }
  };

  // Function to dynamically check and insert page breaks (unchanged)
  const simulatePageBreaks = () => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const editorContent = editor.getBody();
    const pageHeightPx = 1123; // A4 height in pixels
    let accumulatedHeight = 0;

    // Clear previous page breaks
    const pageBreaks = editorContent.querySelectorAll(".page-break");
    pageBreaks.forEach((breakEl) => breakEl.remove());

    console.log("Simulating page breaks"); // This should now be triggered

    // Iterate through each element in the editor and calculate height
    Array.from(editorContent.childNodes).forEach((node) => {
      const nodeElement = node as HTMLElement;
      accumulatedHeight += nodeElement.offsetHeight;

      // Insert a page break if the content exceeds the page height
      if (accumulatedHeight > pageHeightPx) {
        const pageBreak = editor.getDoc().createElement("div");
        pageBreak.className = "page-break";
        pageBreak.style.borderTop = "1px dashed black";
        pageBreak.style.margin = "40px 0";

        editorContent.insertBefore(pageBreak, nodeElement);

        // Reset accumulated height after inserting page break
        accumulatedHeight = nodeElement.offsetHeight;
      }
    });
  };

  // Register the listeners when TinyMCE is initialized
  const handleEditorInit = (evt: any, editor: TinyMCEEditor) => {
    editorRef.current = editor;

    // Attach TinyMCE event listeners to trigger the simulatePageBreaks function
    editor.on("keyup", () => {
      console.log("Keyup detected"); // This should now be triggered
      simulatePageBreaks();
    });

    editor.on("change", () => {
      console.log("Change detected"); // This should now be triggered
      simulatePageBreaks();
    });

    editor.on("NodeChange", () => {
      console.log("Node change detected"); // This should now be triggered
      simulatePageBreaks();
    });

    // Initial run to handle any pre-loaded content
    simulatePageBreaks();
  };

  const exportToPDF = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();

      // Create a temporary div to hold content for export
      const tempElement = document.createElement("div");
      tempElement.innerHTML = content;

      // Apply the same styles used in the editor
      const style = document.createElement("style");
      style.textContent = `
        body {
          font-family: Helvetica,Arial,sans-serif;
          font-size: 14px;
          color: black;
          line-height: 1.5;
          padding: 25px;
          margin: 0;
          width: 794px; /* A4 width */
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
      <div className="basis-[70%] border border-green-500">
        {/* TinyMCE Editor */}
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          onInit={handleEditorInit} // Attach the event listeners during init
          initialValue="<p style='color: blue;'>This is the initial content of the editor.</p>"
          init={{
            height: "100vh", // Limit the editor to 100vh for scrollability
            width: 794, // A4 width in pixels (~210mm)
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | removeformat | help | exportpdf",
            setup: (editor) => {
              // Add custom button for exporting to PDF
              editor.ui.registry.addButton("exportpdf", {
                text: "Export PDF",
                onAction: exportToPDF,
              });
            },
            content_style: `
              body { 
                font-family: Helvetica,Arial,sans-serif; 
                font-size: 14px; 
                color: black; 
                line-height: 1.5; 
                padding: 25px; 
                box-sizing: border-box; 
                margin: 0;
                height: auto; /* Allow content to grow */
                width: 794px; /* A4 width */
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

        {/* Button to log editor content */}
        <button onClick={log}>Log editor content</button>

        {/* Button to set content programmatically */}
        <button onClick={() => setEditorContent("<p>This is some new content!</p>")}>
          Set New Content
        </button>

        {/* <DraggableList items={items} setItems={handleListUpdate} /> */}
        <ResumeUpload />
      </div>
      <div className="basis-[30%]">
        <EditorSidebar />
      </div>
    </div>
  );
};

export default GeneratePage;
