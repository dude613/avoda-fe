import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import Papa from "papaparse";  // CSV parser

type FileUploaderProps = {
    mode: "single" | "multiple" | "csv";
    allowedTypes: string[];
    onUpload: (data: any, file?: File) => void;  
};

export default function FileUploader({ mode, allowedTypes, onUpload }: FileUploaderProps) {
    const [filePreviews, setFilePreviews] = useState<{ file: File; preview: string }[]>([]);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null); 
    const [isFileUploaded, setIsFileUploaded] = useState(false); 

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

            if (mode === "csv" && validFiles.length > 0) {
                const file = validFiles[0];
                setUploadedFileName(file.name);  
                setIsFileUploaded(true); 
                parseCSV(file);  
            } else {
                onUpload(validFiles); 
            }
        },
        [mode, allowedTypes, onUpload]
    );

    const parseCSV = (file: File) => {
        Papa.parse(file, {
            complete: (result) => {
                console.log("Parsed CSV Result:", result);
                onUpload(result.data, file); 
            },
            header: true,
            skipEmptyLines: true,
        });
    };

    const removeFile = () => {
        setFilePreviews([]);
        setUploadedFileName(null);
        setIsFileUploaded(false);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleFiles,
        accept: allowedTypes.reduce((acc, type) => {
            acc[type] = [];
            return acc;
        }, {} as Record<string, string[]>),
        multiple: mode !== "single",
        disabled: isFileUploaded, 
    });

    return (
        <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center mb-8 cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center"
        >
            <input {...getInputProps()} />

            {isFileUploaded ? (
                <div className="flex flex-col items-center mt-2">
                    <p className="text-sm text-gray-700 font-medium">{uploadedFileName}</p>
                    <button
                        onClick={removeFile}
                        className="mt-2 text-red-500 text-sm font-semibold"
                    >
                        Remove File
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    {mode === "csv" ? (
                        <>
                            <FiUpload className="text-3xl text-gray-500" />
                            <p className="text-sm font-medium mt-2">Click to upload CSV</p>
                            <p className="text-xs text-gray-400">or drag and drop</p>
                        </>
                    ) : (
                        <>
                            <FiUpload className="text-3xl text-gray-500" />
                            <p className="text-sm font-medium mt-2">Click to upload an image</p>
                            <p className="text-xs text-gray-400">or drag and drop</p>
                        </>
                    )}
                </div>
            )}

            {mode !== "csv" && filePreviews.length > 0 && (
                <div className="mt-4 flex gap-2">
                    {filePreviews.map(({ file, preview }) => (
                        <div key={file.name} className="relative">
                            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                            <button
                                onClick={() => removeFile()}
                                className="absolute top-0 right-0 text-red-500"
                            >
                                <IoCloseCircle size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
