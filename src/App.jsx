import React, { useState, useRef } from 'react';

export default function App() {
  const [fileName, setFileName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleUpload = async (event) => {
    event.preventDefault();

    const file = fileInputRef.current.files[0];
    if (!file) {
      setStatusMessage('❌ Geen bestand geselecteerd.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file); // let op: veldnaam moet "pdf" zijn, niet "file"

    try {
      const response = await fetch('/api/transportopdracht', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Upload mislukt');
      }

      const data = await response.json();
      setStatusMessage(`✅ Upload gelukt! Bestand: ${data.bestandsnaam}`);
    } catch (error) {
      setStatusMessage(`❌ Fout bij upload: ${error.message}`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      setFileName(file.name);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Automation Logistics Dashboard</h1>

      <form onSubmit={handleUpload}>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current.click()}
          style={{
            border: '2px dashed #ccc',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        >
          Sleep hier je transportopdracht (.pdf)
          {fileName && <div style={{ marginTop: '1rem' }}>📄 {fileName}</div>}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={(e) => setFileName(e.target.files[0]?.name || '')}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload en verstuur
        </button>
      </form>

      {statusMessage && (
        <p className="mt-4">{statusMessage}</p>
      )}
    </div>
  );
}
