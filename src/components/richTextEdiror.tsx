import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import ReactQuill from 'react-quill'; // Import the editor

const RichTextEditor = () => {
  const [editorHtml, setEditorHtml] = useState('');

  const handleChange = (html:any) => {
    setEditorHtml(html);
  };

  return (
    <ReactQuill
      theme="snow"
      value={editorHtml}
      onChange={handleChange}
    />
  );
};

export default RichTextEditor;
