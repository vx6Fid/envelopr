"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { FileText, PlusCircle, Loader2, ArrowLeft } from "lucide-react";
import { UPLOAD_FILE } from "@/graphql/mutations";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UploadPage() {
  const [form, setForm] = useState({ name: "", content: "" });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>

        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 border-b border-blue-100">
            <div className="flex items-center justify-center space-x-2">
              <PlusCircle className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Create New File
              </h2>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            <div>
              <label
                htmlFor="filename"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                File Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="filename"
                  type="text"
                  required
                  placeholder="document.txt"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Content (Optional)
              </label>
              <textarea
                id="content"
                rows={5}
                placeholder="Enter your file content here..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                Failed to create file. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create File
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>You can add content now or edit it later</p>
        </div>
      </div>
    </div>
  );
}
