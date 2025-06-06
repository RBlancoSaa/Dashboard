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
      console.log('Succesvol:', data);
      alert('Upload gelukt!');
    } catch (error) {
      alert('⚠️ Netwerkfout: ' + error.message);
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
    <div className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Automation Logistics Dashboard</h1>

      <form onSubmit={handleUpload} className="space-y-4">
        <div
          className="border-4 border-dashed p-8 rounded-lg bg-white text-center cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current.click()}
        >
          <p className="text-gray-700">Sleep hier je transportopdracht (.pdf)</p>
          {fileName && (
            <p className="mt-4 text-sm text-green-700">
              Geselecteerd bestand: {fileName}
            </p>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => setFileName(e.target.files[0]?.name || "")}
        />

        <button
          type="submit"
          className="bg-[#4c372d] text-white px-4 py-2 rounded shadow"
        >
          Uploaden
        </button>
      </form>
    </div>
  );
}
