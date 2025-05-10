"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { FileText, PlusCircle, Loader2, ArrowLeft, Upload, File } from "lucide-react";
import { UPLOAD_FILE } from "@/graphql/mutations";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UploadPage() {
  const [form, setForm] = useState({ name: "", content: "" });
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFile, { loading, error }] = useMutation(UPLOAD_FILE);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await uploadFile({ variables: form });
      router.push("/dashboard");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = () => {
        setForm({
          name: file.name,
          content: reader.result as string,
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <PlusCircle className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Create New File
              </h2>
            </div>
            <p className="mt-2 text-center text-sm text-gray-500">
              Start fresh or upload an existing text file
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-1">
              <label
                htmlFor="filename"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                File Name
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="filename"
                  type="text"
                  required
                  placeholder="document.txt"
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Content
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </label>
              <textarea
                id="content"
                rows={6}
                placeholder="Enter your file content here..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm transition-all duration-200"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or Upload a Text File
              </label>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 rounded-full bg-blue-50 text-blue-500">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Drag & drop a .txt file here
                  </p>
                  <p className="text-xs text-gray-400">or</p>
                  <input
                    id="file"
                    type="file"
                    accept=".txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setForm({
                            name: file.name,
                            content: reader.result as string,
                          });
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                  <label 
                    htmlFor="file"
                    className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 border border-gray-300 cursor-pointer transition-colors duration-200"
                  >
                    <File className="h-4 w-4 mr-2" />
                    Browse Files
                  </label>
                </div>
              </div>
              {form.name && (
                <p className="mt-2 text-sm text-gray-500 flex items-center">
                  <FileText className="h-4 w-4 mr-1.5 text-gray-400" />
                  Selected: <span className="font-medium ml-1">{form.name}</span>
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 flex items-start">
                <div className="mt-0.5 mr-2">⚠️</div>
                <div>Failed to create file. Please try again.</div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Creating File...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                    Create File
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Supported formats: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">.txt</span>
          </p>
        </div>
      </div>
    </div>
  );
}