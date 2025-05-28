import { useState } from 'react';

function App() {
  const [fileName, setFileName] = useState(null);
  const [status, setStatus] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      setStatus("Bestand geaccepteerd!");
    } else {
      setStatus("Alleen PDF toegestaan.");
    }
  };

  return (
    <div className="min-h-screen bg-champagne p-10 font-sans">
      <h1 className="text-3xl font-bold text-oil mb-6">Automation Logistics Dashboard</h1>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-4 border-romancoffee border-dashed rounded-xl p-10 text-center bg-white"
      >
        <p className="text-romancoffee mb-2">Sleep hier je transportopdracht (.pdf)</p>
        {fileName && <p className="text-judgegray font-semibold">{fileName}</p>}
        <p className="text-paleoyster mt-2">{status}</p>
      </div>
    </div>
  );
}

export default App;