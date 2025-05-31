import { useState } from "react";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setUploadStatus("Bestand geaccepteerd: " + droppedFile.name);
    } else {
      setUploadStatus("Alleen PDF-bestanden zijn toegestaan.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus("Bezig met verwerken...");
    setIsSending(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/process-upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus("Easytrip bestand aangemaakt en verzonden: " + result.filename);
      } else {
        setUploadStatus("Fout bij verwerken: " + result.error);
      }
    } catch (error) {
      setUploadStatus("Netwerkfout: " + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Automation Logistics Dashboard</h1>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "2px dashed #aaa",
          padding: "2rem",
          background: "#f4f4f4",
          borderRadius: "1rem",
          marginBottom: "1rem",
        }}
      >
        <p>Sleep hier je transportopdracht (.pdf)</p>
        {file && <strong>{file.name}</strong>}
      </div>

      <button
        disabled={!file || isSending}
        onClick={handleUpload}
        style={{
          padding: "0.5rem 1rem",
          background: "#523F31",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          cursor: isSending ? "wait" : "pointer",
        }}
      >
        Upload en verstuur
      </button>

      <p style={{ marginTop: "1rem", color: "#333" }}>{uploadStatus}</p>
    </div>
  );
}
