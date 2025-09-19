import React, { useState, type ChangeEvent, type DragEvent } from "react";
import { File as FileIcon, Trash2, ViewIcon } from "lucide-react";
import type { DocumentType } from "../../mocks";

interface MultiDocumentUploadProps {
  value: DocumentType[];
  onChange: (docs: DocumentType[]) => void;
}

export const MultiDocumentUpload: React.FC<MultiDocumentUploadProps> = ({
  value,
  onChange,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [title, setTitle] = useState("");

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newDocs: DocumentType[] = Array.from(files).map((file) => ({
      name: file.name,
      file,
    }));
    onChange([...value, ...newDocs]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    const updatedDocs = [...value];
    updatedDocs.splice(index, 1);
    onChange(updatedDocs);
  };

  const viewFile = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  const handleSave = async () => {
    setIsPending(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const serializableDocs = value.map((doc) => ({
      name: doc.name,
    }));
    alert(
      "Document uploaded! " +
        "Title " +
        title +
        " " +
        JSON.stringify(serializableDocs)
    );
    setTitle("");
    onChange?.([]);
    setIsPending(false);
  };

  return (
    <div className="w-full max-w-[80%] mx-auto">
      <h2 className="text-sm font-semibold mb-2">Add Documents</h2>

      <label className="block text-sm font-medium mb-1">Document Title</label>
      <input
        type="text"
        placeholder="ENTER DOCUMENT TITLE"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-green-400 rounded-md p-2 text-zinc-500 focus:outline-none focus:ring-1 focus:ring-green-400 mb-4"
      />

      <div className="flex bg-emerald-50 rounded-lg p-2 items-center gap-3 mb-4">
        <div className="w-1/2 ">
          <p className="  text-white bg-teal-400  font-bold text-lg px-6 py-2 hover:bg-teal-500 rounded-full cursor-pointer flex-1 text-center">
            <label className="">
              Browse
              <input
                type="file"
                multiple
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleFiles(e.target.files)
                }
                className="hidden"
              />
            </label>
          </p>
        </div>
        <p className="font-bold text-zinc-700">OR</p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDrop={handleDrop}
          className={`flex-1 p-3 text-center border-2 border-dashed rounded-full cursor-pointer ${
            dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300"
          }`}
        >
          <p className="text-gray-500">Drag and Drop file here</p>
        </div>
      </div>

      <div className="space-y-2">
        {value.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <FileIcon size={16} className="text-gray-600" />
              <span className="text-sm">{doc.name}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => viewFile(doc.file)}
                className="text-red-500 cursor-pointer hover:text-red-700"
              >
                <ViewIcon className="text-zinc-600" size={16} />
              </button>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-500 cursor-pointer hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button className="bg-gray-200 text-gray-800 cursor-pointer px-4 py-2 rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="bg-black text-white w-40 cursor-pointer px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Add Document"}
        </button>
      </div>
    </div>
  );
};
