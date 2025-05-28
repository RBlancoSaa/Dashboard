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