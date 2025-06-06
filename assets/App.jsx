const handleUpload = async (event) => {
  event.preventDefault();

  const fileInput = document.querySelector('input[type="file"]');
  const file = fileInput.files[0];
  if (!file) {
    alert("Geen bestand geselecteerd");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch('/api/parse', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Serverfout:', text);
      alert('Fout bij uploaden: ' + text);
      return;
    }

    const data = await response.json();
    console.log('Succesvol:', data);
    alert('Upload gelukt!');
  } catch (error) {
    console.error('Netwerkfout:', error);
    alert('Netwerkfout: ' + error.message);
  }
};
import React, { useState } from 'react';

export default function App() {
  const [fileName, setFileName] = useState("");

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6">Automation Logistics Dashboard</h1>
      <div className="border-4 border-dashed p-8 rounded-lg bg-white text-center"
           onDrop={e => {
             e.preventDefault();
             const file = e.dataTransfer.files[0];
             if (file && file.type === "application/pdf") {
               setFileName(file.name);
             }
           }}
           onDragOver={e => e.preventDefault()}>
        <p>Sleep hier je transportopdracht (.pdf)</p>
        {fileName && <p className="mt-4 text-sm text-green-700">Geselecteerd bestand: {fileName}</p>}
      </div>
    </div>
  );
}
<form onSubmit={handleUpload}>
  <input type="file" accept=".pdf" />
  <button type="submit">Upload en verstuur</button>
</form>
