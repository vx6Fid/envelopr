"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { GET_FILE } from "@/graphql/queries";
import { UPDATE_FILE, MAKE_FILE_PUBLIC } from "@/graphql/mutations";
import { useState } from "react";

export default function FilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, loading } = useQuery(GET_FILE, {
    variables: { fileID: id },
  });

  const [updateFile] = useMutation(UPDATE_FILE, {
    refetchQueries: [{ query: GET_FILE, variables: { fileID: id } }],
  });

  const [makePublic] = useMutation(MAKE_FILE_PUBLIC, {
    refetchQueries: [{ query: GET_FILE, variables: { fileID: id } }],
  });

  const file = data?.file;
  const [form, setForm] = useState({ name: "", url: "" });

  if (loading) return <p>Loading...</p>;
  if (!file) return <p>File not found</p>;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFile({ variables: { id, ...form } });
  };

  const handleMakePublic = async () => {
    await makePublic({ variables: { fileID: id } });
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit File</h1>

      <form onSubmit={handleUpdate} className="space-y-2 max-w-md">
        <input
          placeholder="Name"
          value={form.name || file.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          placeholder="URL"
          value={form.url || file.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Update
        </button>
      </form>

      <div>
        <p className="text-gray-600">
          Status:{" "}
          <span className={file.isPublic ? "text-green-600" : "text-red-600"}>
            {file.isPublic ? "Public" : "Private"}
          </span>
        </p>
        {!file.isPublic && (
          <button
            onClick={handleMakePublic}
            className="text-sm text-blue-700 underline"
          >
            Make Public
          </button>
        )}
      </div>

      <div>
        <h2 className="font-semibold">Shared With:</h2>
        <ul className="list-disc pl-5">
          {file.sharedWith.length === 0 && <li>No users</li>}
          {file.sharedWith.map((u: any) => (
            <li key={u.id}>{u.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
