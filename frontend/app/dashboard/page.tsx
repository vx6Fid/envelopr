"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  FileText,
  LogOut,
  PlusCircle,
  Share2,
  Trash2,
  Globe,
  Lock,
  Loader2,
} from "lucide-react";
import { MY_FILES } from "@/graphql/queries";
import { SHARE_FILE, DELETE_FILE } from "@/graphql/mutations";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { format } from "date-fns";

export default function DashboardPage() {
  interface File {
    id: string;
    name: string;
    createdAt: string;
    isPublic: boolean;
  }

  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean>(!!token);

  const { data, loading, error, refetch } = useQuery<{ myFiles: File[] }>(MY_FILES, {
    skip: !authorized,
    fetchPolicy: "network-only",
  });

  const [shareFile] = useMutation(SHARE_FILE, {
    onCompleted: () => refetch(),
  });
  const [deleteFile, { loading: isDeleting }] = useMutation(DELETE_FILE, {
    refetchQueries: [{ query: MY_FILES }],
  });

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }
  }, [token, router]);

  if (!authorized) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleShare = async (fileID: string) => {
    const userID = prompt("Enter user ID to share with:");
    if (!userID) return;
    try {
      await shareFile({ variables: { fileID, userID } });
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  const handleDelete = async (fileID: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await deleteFile({ variables: { fileID } });
      await refetch();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Envelopr
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Files</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage all your documents in one place
            </p>
          </div>
          <Link href="/upload">
            <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create File
            </button>
          </Link>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Lock className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading files
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Failed to fetch your files. Please try again.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Files Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.myFiles?.map((file) => (
            <div
              key={file.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {file.name}
                  </h3>
                  {file.isPublic ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Globe className="h-3 w-3 mr-1" />
                      Public
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Created: {format(new Date(file.createdAt), "MMM d, yyyy")}
                </p>
              </div>
              <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                <div className="flex space-x-3">
                  <Link href={`/files/${file.id}`}>
                    <button className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                      <FileText className="h-4 w-4 mr-1" />
                      Open
                    </button>
                  </Link>
                  <button
                    onClick={() => handleShare(file.id)}
                    className="inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-800"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(file.id)}
                  disabled={isDeleting}
                  className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-1" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && data?.myFiles?.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new file.
            </p>
            <div className="mt-6">
              <Link href="/upload">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New File
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
