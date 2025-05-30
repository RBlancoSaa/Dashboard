import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, FileCheck2 } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-[#F4EFEA] p-10">
      <h1 className="text-3xl font-bold text-[#2D1E17] mb-6">Automation Logistics Dashboard</h1>
      <Card
        className="border-dashed border-4 border-[#796254] p-8 rounded-2xl text-center bg-[#FFFDFB]"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <CardContent>
          <motion.div className="flex flex-col items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Inbox className="w-16 h-16 text-[#796254]" />
            <p className="text-[#796254]">Sleep hier je transportopdracht (.pdf)</p>
            {file && (
              <div className="text-[#2D1E17] font-medium">
                <FileCheck2 className="inline-block mr-2" />
                {file.name}
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
      <div className="mt-6 flex items-center justify-between">
        <Button disabled={!file || isSending} onClick={handleUpload} className="bg-[#523F31] hover:bg-[#2D1E17] text-white">
          Upload en verstuur
        </Button>
        <span className="text-sm text-[#796254]">{uploadStatus}</span>
      </div>
    </div>
  );
}
