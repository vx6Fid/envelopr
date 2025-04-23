"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import {
  FileText,
  Lock,
  Globe,
  Save,
  Users,
  Share2,
  Loader2,
} from "lucide-react";

import { GET_FILE, SHARED_USERS } from "@/graphql/queries";
import {
  UPDATE_FILE,
  MAKE_FILE_PUBLIC,
  UPDATE_FILE_CONTENT,
} from "@/graphql/mutations";

export default function FilePage() {
  interface User {
    id: string;
    username: string;
    createdAt: string;
  }

  const { id } = useParams();
  const { data, loading } = useQuery(GET_FILE, {
    variables: { fileID: id },
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

  // Debounced mutation (runs 1s after user stops typing)
  const debouncedSave = useCallback(
    debounce(async (newContent: string) => {
      try {
        await updateContent({ variables: { id, content: newContent } });
      } catch (err) {
        console.error("Autosave failed:", err);
      }
    }, 1000),
    [id]
  );

  useEffect(() => {
    return () => debouncedSave.cancel();
  }, [debouncedSave]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setForm((f) => ({ ...f, content: newContent }));
    debouncedSave(newContent);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFile({ variables: { id, name: form.name } });
  };

  const handleMakePublic = async () => {
    await makePublic({ variables: { fileID: id } });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );

  if (!file)
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Lock className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {"File not found or you don't have permission to view it"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-800">File Editor</h1>
        </div>
        <div className="flex items-center space-x-2">
          {isSaving && (
            <span className="flex items-center text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              Saving...
            </span>
          )}
        </div>
      </div>

      {/* File Name Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <form onSubmit={handleUpdate} className="flex items-end space-x-3">
          <div className="flex-grow">
            <label
              htmlFor="filename"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              File Name
            </label>
            <input
              id="filename"
              placeholder="My Awesome File"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isRenaming}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isRenaming ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Rename
          </button>
        </form>
      </div>

      {/* File Status Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {file.isPublic ? (
              <Globe className="h-5 w-5 text-green-500" />
            ) : (
              <Lock className="h-5 w-5 text-gray-500" />
            )}
            <span className="text-sm font-medium">
              Status:{" "}
              <span
                className={file.isPublic ? "text-green-600" : "text-gray-600"}
              >
                {file.isPublic ? "Public" : "Private"}
              </span>
            </span>
          </div>
          {!file.isPublic && (
            <button
              onClick={handleMakePublic}
              disabled={isPublishing}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isPublishing ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Share2 className="h-3 w-3 mr-1" />
              )}
              Make Public
            </button>
          )}
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <h2 className="text-sm font-medium text-gray-700 flex items-center">
            <FileText className="h-4 w-4 mr-2 text-gray-500" />
            File Content
          </h2>
        </div>
        <textarea
          className="w-full h-96 p-4 font-mono text-sm text-gray-900 focus:outline-none resize-none"
          value={form.content}
          onChange={handleContentChange}
          placeholder="Start writing your content here..."
        />
        <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-xs text-gray-500">
          Changes are saved automatically as you type
        </div>
      </div>

      {/* Shared Users */}
      {sharedData.sharedUsers ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700 flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              Shared With
            </h2>
            <button
              className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded"
              // onClick={() => setShowShareModal(true)}
            >
              + Add People
            </button>
          </div>
          <div className="p-4">
            {sharedLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-500">
                  Loading shared users...
                </span>
              </div>
            ) : sharedData?.sharedUsers.length === 0 ? (
              <div className="text-center py-6">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <Users className="w-full h-full" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-700">
                  Not shared yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Share this file to collaborate with others
                </p>
                <div className="mt-4">
                  <button
                    // onClick={() => setShowShareModal(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Share2 className="mr-1.5 h-3.5 w-3.5" />
                    Share File
                  </button>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {sharedData.sharedUsers.map((u: User) => (
                  <li
                    key={u.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                        {u.username.charAt(0).toUpperCase()}
                      </span>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {u.username}
                      </span>
                    </div>
                    <button
                      className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded"
                      // onClick={() => handleRemoveUser(u.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <Lock className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-700">
            Private file
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {"This file isn't shared with anyone"}
          </p>
          <button
            // onClick={() => setShowShareModal(true)}
            className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Share2 className="mr-1.5 h-3.5 w-3.5" />
            Share File
          </button>
        </div>
      )}
    </div>
  );
}
