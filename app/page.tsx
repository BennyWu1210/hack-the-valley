"use client"

import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from 'tinymce'; // Import TinyMCE types

export default function Home() {
  // Define the editorRef with type `React.MutableRefObject`
  const editorRef = useRef<TinyMCEEditor | null>(null); // Use TinyMCE's Editor type
  
  // Function to log the content of the editor
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent()); // This should now work
    }
  };

  return (
    <div>
      {/* TinyMCE Editor */}
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(_evt, editor) => editorRef.current = editor}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      
      {/* Button to log editor content */}
      <button onClick={log}>Log editor content</button>
    </div>
  );
}
