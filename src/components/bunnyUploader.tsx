"use client";
import { useState } from "react";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/bunnyUpload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        console.log("✅ File uploaded:", data.fileUrl);
        alert(`File uploaded successfully: ${data.fileUrl}`);
      } else {
        console.error("❌ Upload error:", data.error);
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("Upload failed due to network error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
