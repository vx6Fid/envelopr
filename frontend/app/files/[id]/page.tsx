"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  FileText,
  Lock,
  Globe,
  Save,
  Users,
  Share2,
  Loader2,
  Download,
  Upload,
  X,
  Plus,
} from "lucide-react";

import { GET_FILE, SHARED_USERS } from "@/graphql/queries";
import {
  UPDATE_FILE,
  MAKE_FILE_PUBLIC,
  UPDATE_FILE_CONTENT,
} from "@/graphql/mutations";
import Link from "next/link";

export default function FilePage() {
  interface User {
    id: string;
    username: string;
    createdAt: string;
  }

  const { id } = useParams() as { id: string };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, loading } = useQuery(GET_FILE, {
    variables: { fileID: id },
    onError: (err) => {
      console.error("GraphQL error:", err);
    },
  });

  const { data: sharedData, loading: sharedLoading } = useQuery(SHARED_USERS, {
    variables: { fileID: id },
  });

  const [updateFile, { loading: isRenaming }] = useMutation(UPDATE_FILE, {
    refetchQueries: [{ query: GET_FILE, variables: { fileID: id } }],
  });

  const [makePublic, { loading: isPublishing }] = useMutation(
    MAKE_FILE_PUBLIC,
    {
      refetchQueries: [{ query: GET_FILE, variables: { fileID: id } }],
    }
  );

  const [updateContent, { loading: isSaving }] =
    useMutation(UPDATE_FILE_CONTENT);

  const file = data?.file;
  const [form, setForm] = useState({ name: "", content: "" });

  // Sync loaded file data into form state
  useEffect(() => {
    if (file) {
      setForm({ name: file.name, content: file.content });
    }
  }, [file]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, content: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFile({ variables: { id, name: form.name } });
  };

  const handleSave = async () => {
    await updateContent({ variables: { id, content: form.content } });
  };

  const handleMakePublic = async () => {
    await makePublic({ variables: { fileID: id } });
  };

  const handleDownload = () => {
    const blob = new Blob([form.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = form.name || "file.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setForm((prev) => ({ ...prev, content }));
      };
      reader.readAsText(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );

  if (!file)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-red-100 text-red-500">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Access Restricted</h3>
              <p className="text-sm text-gray-500 mt-1">
                File not found or you don't have permission to view it
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area */}
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center space-x-3">
            {/* Back Button */}
            <Link
              href="/dashboard"
              className="ml-1 inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
            </Link>
            <div className="py-2 pr-2 rounded-lg bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">File Editor</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {isSaving && (
              <div className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>

            <button
              onClick={triggerFileInput}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.json,.js,.ts,.html,.css"
                className="hidden"
              />
            </button>
          </div>
        </div>

        {/* File info card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Name
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  placeholder="Enter file name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={isRenaming}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRenaming ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-2" />
                  ) : (
                    "Update Name"
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                {file.isPublic ? (
                  <Globe className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-500 mr-2" />
                )}
                <span className="text-sm font-medium">
                  {file.isPublic ? "Public Access" : "Private Access"}
                </span>
              </div>

              {!file.isPublic && (
                <button
                  onClick={handleMakePublic}
                  disabled={isPublishing}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Share2 className="h-4 w-4 mr-2" />
                  )}
                  Make Public
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Content editor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-3 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-gray-500" />
              File Content
            </h2>
            <span className="text-xs text-gray-500">
              {form.content.length} characters
            </span>
          </div>
          <textarea
            className="w-full h-[calc(100vh-450px)] min-h-[300px] p-6 font-mono text-sm text-gray-800 focus:outline-none resize-none"
            value={form.content}
            onChange={handleContentChange}
            placeholder="Start writing your content here..."
          />
        </div>

        {/* Shared users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-3 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700 flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              Shared With
            </h2>
            <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
              <Plus className="h-4 w-4 mr-1" />
              Add People
            </button>
          </div>

          {sharedLoading ? (
            <div className="p-6 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : sharedData?.sharedUsers.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-medium text-gray-700">
                Not shared yet
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Share this file to collaborate with others
              </p>
              <button className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Share2 className="h-4 w-4 mr-2" />
                Share File
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {sharedData?.sharedUsers.map((u: User) => (
                <li
                  key={u.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {u.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        Joined {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
