"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { PUBLIC_FILE } from "@/graphql/queries";
import { FileText, AlertCircle, Copy, Download, Check } from "lucide-react";
import { useState } from "react";

export default function PublicFilePage() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(PUBLIC_FILE, {
    variables: { fileID: id },
    context: {
      operationName: "PublicFile",
    },
  });
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.publicFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([data.publicFile.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = data.publicFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading)
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded w-full animate-pulse"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">File not found or not publicly accessible</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold truncate">
            {data.publicFile.name}
          </h1>
        </div>
        <div className="flex gap-2">
          {/* Copy Button with Animation */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md transition-all duration-300 ${
              copied
                ? "bg-green-100 border-green-500 text-green-700"
                : "hover:bg-gray-50 border-gray-300"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 shadow-sm overflow-hidden">
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="whitespace-pre-wrap font-mono">
            {data.publicFile.content}
          </code>
        </pre>
      </div>

      <div className="text-sm text-gray-500 text-center">
        This is a publicly shared file. Anyone with the link can view it.
      </div>
    </div>
  );
}
