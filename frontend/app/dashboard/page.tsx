"use client";

import { useQuery } from "@apollo/client";
import { MY_FILES } from "@/graphql/queries";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { DELETE_FILE, SHARE_FILE } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";

export default function DashboardPage() {
  const { data, loading, error } = useQuery(MY_FILES);
  const [shareFile] = useMutation(SHARE_FILE);

  const handleShare = async (fileID: string) => {
    const userID = prompt("Enter user ID to share with:");
    if (!userID) return;
    try {
      await shareFile({ variables: { fileID, userID } });
      alert("File shared!");
    } catch (err) {
      alert("Share failed.");
      console.error(err);
    }
  };

  const [deleteFile] = useMutation(DELETE_FILE, {
    refetchQueries: [{ query: MY_FILES }],
  });

  const handleDelete = async (fileID: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await deleteFile({ variables: { fileID } });
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Your Files</h1>
        <div className="space-x-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={logout}
          >
            Logout
          </button>
          <Link href="/upload">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Create File
            </button>
          </Link>
        </div>
      </header>

      {loading && <p>Loading files...</p>}
      {error && <p className="text-red-500">Error loading files.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data?.myFiles?.map((file: any) => (
          <div
            key={file.id}
            className="bg-white p-4 rounded shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-medium">{file.name}</h2>
            <p className="text-sm text-gray-600">{file.createdAt}</p>

            {file.isPublic && (
              <span className="inline-block text-xs text-green-600 font-semibold mt-2">
                🌍 Public
              </span>
            )}

            <div className="mt-4 space-x-2">
              <Link href={`/files/${file.id}`}>
                <button className="text-blue-600 hover:underline">Open</button>
              </Link>
              <button
                onClick={() => handleDelete(file.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
              <button
                onClick={() => handleShare(file.id)}
                className="text-yellow-600 hover:underline"
              >
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
