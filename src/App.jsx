import React, { useState, useRef } from 'react';

export default function App() {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleUpload = async (event) => {
    event.preventDefault();

    const file = fileInputRef.current.files[0];
    if (!file) {
      alert("Geen bestand geselecteerd");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('https://automatinglogistics-api.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        alert('Server gaf fout: ' + text);
        return;
      }

      const data = await response.json();
      alert('Upload gelukt! Je krijgt de mail binnenkort.');
    } catch (error) {
      alert('Netwerkfout: ' + error.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      setFileName(file.name);
    }
  };

  return (
    <div>
      <h1>Automation Logistics Dashboard</h1>
      <form onSubmit={handleUpload}>
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileInputRef.current.click()}
          style={{border: '2px dashed #ccc', padding: 20, textAlign: 'center', cursor: 'pointer'}}
        >
          Sleep hier je transportopdracht (.pdf)
          {fileName && <div>Geselecteerd: {fileName}</div>}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          style={{display: 'none'}}
          onChange={(e) => setFileName(e.target.files[0]?.name || "")}
        />

        <button type="submit">Uploaden</button>
      </form>
    </div>
  );
}
