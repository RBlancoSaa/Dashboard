import React, { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase initialisatie
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [fileName, setFileName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleUpload = async (event) => {
    event.preventDefault();
    const file = fileInputRef.current?.files[0];

    if (!file) {
      setStatusMessage('❌ Geen bestand geselecteerd.');
      return;
    }

    const filePath = `pdf/${Date.now()}_${file.name}`;
    setStatusMessage('⏳ Uploaden naar Supabase...');

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/pdf',
      });

    if (uploadError) {
      console.error('Uploadfout:', uploadError.message);
      setStatusMessage(`❌ Uploadfout: ${uploadError.message}`);
      return;
    }

    setStatusMessage('📨 Bestand geüpload. Verwerken via backend...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://api.automatinglogistics.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Onbekende fout');
      }

      setStatusMessage(`✅ Verwerkt: ${result.referentie}`);
    } catch (backendError) {
      console.error('Backendfout:', backendError.message);
      setStatusMessage(`❌ Backendfout: ${backendError.message}`);
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
          Upload naar Supabase
        </button>
      </form>

      {statusMessage && <p className="mt-4">{statusMessage}</p>}
    </div>
  );
}
