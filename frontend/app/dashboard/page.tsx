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
  List,
  Grid,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { MY_FILES } from "@/graphql/queries";
import { DELETE_FILE, SHARE_FILE_USERNAME } from "@/graphql/mutations";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import toast from "react-hot-toast";

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

  const { data, loading, error, refetch } = useQuery<{ myFiles: File[] }>(
    MY_FILES,
    {
      skip: !authorized,
      fetchPolicy: "network-only",
    }
  );

  const [shareForm, setShareForm] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [grid, setGrid] = useState(true);
  const [sortBy, setSortBy] = useState<"name" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [shareFile] = useMutation(SHARE_FILE_USERNAME, {
    onCompleted: () => {
      refetch();
      toast.success("File shared successfully!");
    },
    onError: (err) => {
      console.error("Share error:", err);
      toast.error("Failed to share file");
    },
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

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleShare = async (fileID: string) => {
    setSelectedFile(fileID);
    setShareForm(true);
  };

  // Add a new function to handle the actual sharing
  const handleShareSubmit = async () => {
    if (!selectedFile || !username) return;

    try {
      await shareFile({
        variables: {
          fileID: selectedFile,
          username,
        },
      });
      // Reset the form
      setShareForm(false);
      setUsername("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Share failed", err);
      toast.error("Failed to share file");
    }
  };

  const toggleGrid = () => {
    setGrid((prev) => !prev);
  };

  const toggleSortBy = (type: "name" | "date") => {
    if (sortBy === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortOrder("asc");
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

  const sortedFiles = [...(data?.myFiles || [])].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                <Image
                  src="/logo.png"
                  alt="Envelopr Logo"
                  width={24}
                  height={24}
                  className="text-blue-600"
                />
              </div>
              <span className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                Envelopr
              </span>
            </div>

            {/* User Controls */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-gray-100">
                <span className="text-sm font-medium text-gray-700">
                  Welcome,{" "}
                  <span className="text-blue-600">
                    {user?.username
                      ? user.username[0].toUpperCase() + user.username.slice(1)
                      : "Guest"}
                  </span>
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 rounded-md border border-red-200 hover:border-red-600 transition-all duration-150"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
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
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex items-center space-x-5">
              <button
                onClick={() => toggleSortBy("name")}
                className={`flex items-center text-sm ${
                  sortBy === "name" ? "text-blue-600" : "text-gray-700"
                }`}
              >
                Name
                {sortBy === "name" &&
                  (sortOrder === "asc" ? (
                    <ArrowUp className="h-3 w-3 ml-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 ml-1" />
                  ))}
              </button>
              <button
                onClick={() => toggleSortBy("date")}
                className={`flex items-center text-sm ${
                  sortBy === "date" ? "text-blue-600" : "text-gray-700"
                }`}
              >
                Date
                {sortBy === "date" &&
                  (sortOrder === "asc" ? (
                    <ArrowUp className="h-3 w-3 ml-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 ml-1" />
                  ))}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleGrid}
                className={`p-2 rounded ${
                  grid ? "bg-blue-200" : "hover:bg-gray-100"
                }`}
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={toggleGrid}
                className={`p-2 rounded ${
                  !grid ? "bg-blue-200" : "hover:bg-gray-100"
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Link href="/upload">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create File
              </button>
            </Link>
          </div>
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
        {grid ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFiles.map((file) => (
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
        ) : (
          <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {file.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(file.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-4">
                        <Link href={`/files/${file.id}`}>
                          <button className="text-blue-600 hover:text-blue-900">
                            Open
                          </button>
                        </Link>
                        <button
                          onClick={() => handleShare(file.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Share
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && sortedFiles.length === 0 && (
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

        {/* Share File Modal */}
        {shareForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="border backdrop-blur-lg border-gray-300 rounded-lg shadow-lg p-6 max-w-sm w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Share File</h2>
                <button
                  onClick={() => {
                    setShareForm(false);
                    setUsername("");
                    setSelectedFile(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full mb-4"
                onKeyDown={(e) => e.key === "Enter" && handleShareSubmit()}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShareForm(false);
                    setUsername("");
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShareSubmit}
                  disabled={!username}
                  className="px-4 py-2 border border-blue-600 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
