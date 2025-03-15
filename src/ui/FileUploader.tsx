import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";

type FileUploaderProps = {
    mode: "single" | "multiple" | "csv";
    allowedTypes: string[];
    onUpload: (files: File[]) => void;
};

export default function FileUploader({ mode, allowedTypes, onUpload }: FileUploaderProps) {
    const [filePreviews, setFilePreviews] = useState<{ file: File; preview: string }[]>([]);

    const handleFiles = useCallback(
        (acceptedFiles: File[]) => {
            let selectedFiles = acceptedFiles;

            if (mode === "single") {
                selectedFiles = acceptedFiles.slice(0, 1);
            }

            const validFiles = selectedFiles.filter(file => allowedTypes.includes(file.type));

            if (validFiles.length === 0) {
                alert("Invalid file type. Please upload a valid file.");
                return;
            }

            const previews = validFiles.map(file => ({
                file,
                preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
            }));

            setFilePreviews(prev => (mode === "single" ? previews : [...prev, ...previews]));
            onUpload(validFiles);
        },
        [mode, allowedTypes, onUpload]
    );

    const removeImage = (index: number) => {
        setFilePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleFiles,
        accept: allowedTypes.reduce((acc, type) => {
            acc[type] = [];
            return acc;
        }, {} as Record<string, string[]>),
        multiple: mode !== "single",
    });

    return (
        <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center
            mb-8 cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center"
        >
            <input {...getInputProps()} />

            {filePreviews.length > 0 && mode !== "csv" ? (
                <div className="flex gap-2 flex-wrap mt-2">
                    {filePreviews.map((item, index) => (
                        <div key={index} className="relative w-16 h-16">
                            {item.preview && (
                                <>
                                    <img
                                        src={item.preview}
                                        alt="Preview"
                                        className="w-full h-full rounded-md"
                                    />
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            removeImage(index);
                                        }}
                                        className="absolute -top-2 -right-2 bg-white rounded-full shadow-md"
                                    >
                                        <IoCloseCircle className="text-2xl font-bold" />
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <FiUpload className="text-3xl text-gray-500" />
                    <p className="text-sm font-medium mt-2">Click to upload</p>
                    <p className="text-xs text-gray-400">or drag and drop</p>
                </div>
            )}
        </div>
    );
}
