"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPLOAD_FILE } from "@/graphql/mutations";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [form, setForm] = useState({ name: "", url: "" });
  const [uploadFile, { loading, error }] = useMutation(UPLOAD_FILE);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await uploadFile({ variables: form });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Create File</h2>
        <input
          type="text"
          placeholder="File name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="File URL"
          className="w-full p-2 border rounded"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          {loading ? "Creating..." : "Create"}
        </button>
        {error && (
          <p className="text-red-600 text-sm text-center">Creation Failed</p>
        )}
      </form>
    </div>
  );
}
