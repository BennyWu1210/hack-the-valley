"use client";

import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react'; // TinyMCE editor
import type { Editor as TinyMCEEditor } from 'tinymce'; // Import TinyMCE types

export default function Home() {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const exportToPDF = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      const tempElement = document.createElement('div');
      tempElement.innerHTML = content;
      tempElement.style.padding = '20px';
      tempElement.style.color = 'black';
      tempElement.style.fontSize = '14px';

      // Conditionally import html2pdf.js on the client side
      const html2pdf = (await import('html2pdf.js')).default;

      const opt = {
        margin: 10,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().from(tempElement).set(opt).save();
    }
  };

  return (
    <div>
      {/* TinyMCE Editor */}
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue="<p style='color: blue;'>This is the initial content of the editor.</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | removeformat | help | exportpdf',
          setup: (editor) => {
            editor.ui.registry.addButton('exportpdf', {
              text: 'Export PDF',
              onAction: exportToPDF
            });
          },
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color: black; }'
        }}
      />

      {/* Button to log editor content */}
      <button onClick={log}>Log editor content</button>
    </div>
  );
}
