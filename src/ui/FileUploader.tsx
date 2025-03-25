import { useState, useCallback, useTransition, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import Papa from "papaparse";
import Button from "./Button";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import {
    TEAM_BULK_DRAG_TEXT, TEAM_BULK_DUPLICATE_EMAIL,
    TEAM_BULK_FILE_SUCCESS, TEAM_BULK_INVALID_FILE,
    TEAM_BULK_INVALID_NAME, TEAM_BULK_INVALID_ROLE,
    TEAM_BULK_MISSING_ERROR, TEAM_BULK_REPORT_TEXT,
    TEAM_BULK_REQUIRED, TEAM_BULK_UPLOAD_TEXT,
    TEAM_INVALID_EMAIL
} from "@/constants/AddTeamMembers";
import { Input } from '../components/ui/input';


type FileUploaderProps = {
    mode: "single" | "multiple" | "csv";
    allowedTypes: string[];
    onUpload: (data: any) => void;
};


export default function FileUploader({
    mode,
    allowedTypes,
    onUpload,
}: FileUploaderProps) {
    const [errorRows, setErrorRows] = useState<any[]>([]);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [validRowCount, setValidRowCount] = useState(0)
    const [, startTransition] = useTransition();

    const validateEmail = (email: string) =>
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

    const validateData = (data: any[]) => {
        const errors: Array<{ row: number; name: string; email: string; role: string; issue: string }> = [];
        const emailsSet = new Set<string>();
    
        data.forEach((row, index) => {
            const { Name, Email, Role } = row;
            const msgs: string[] = [];
    
            const missingFields = ["Name", "Email", "Role"].filter((field) => !row[field as keyof any]);
    
            if (missingFields.length > 0) {
                msgs.push(`${missingFields.join(", ")} required`);
            }
    
            if (Name && !/^[A-Za-z\s'-]+$/.test(Name)) {
                msgs.push("Invalid name (Only letters, spaces, hyphens, and apostrophes allowed)");
            }
    
            if (Email) {
                if (!validateEmail(Email)) {
                    msgs.push("Invalid email address");
                } else if (emailsSet.has(Email)) {
                    msgs.push("Duplicate email");
                } else {
                    emailsSet.add(Email);
                }
            }
    
            const validRoles = ["admin", "manager", "employee"];
            if (Role && !validRoles.includes(Role.toLowerCase())) {
                msgs.push(`Invalid role (Must be one of: ${validRoles.join(", ")})`);
            }
    
            if (msgs.length) {
                errors.push({
                    row: index + 1,
                    name: Name || "Missing",
                    email: Email || "Missing",
                    role: Role || "Missing",
                    issue: msgs.join("; "),
                });
            }
        });
    
        if (errors.length) {
            setErrorRows(errors);
            setValidRowCount(0);
            setIsFileUploaded(false);
        } else {
            onUpload(data);
            setValidRowCount(data?.length);
            setErrorRows([]);
        }
    };

    const parseCSV = (file: File) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => startTransition(() => validateData(result.data)),
        });
    };

    const handleFiles = useCallback(
        (acceptedFiles: File[]) => {
            const files = mode === "single" ? acceptedFiles.slice(0, 1) : acceptedFiles;
            const validFiles = files.filter((file) => allowedTypes.includes(file.type));
            if (!validFiles.length)
                return alert(TEAM_BULK_INVALID_FILE);
            if (mode === "csv") {
                setIsFileUploaded(true);
                parseCSV(validFiles[0]);
            }
        },
        [mode, allowedTypes]
    );

    const removeFile = () => {
        setErrorRows([]);
        setIsFileUploaded(false);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleFiles,
        accept: allowedTypes.reduce(
            (acc, type) => ({ ...acc, [type]: [] }),
            {} as Record<string, string[]>
        ),
        multiple: mode !== "single",
        disabled: isFileUploaded,
    });

    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: "row",
                header: "Row",
            },
            {
                accessorKey: "name",
                header: "Name",
                cell: (info) => (
                    <span className={info.getValue() === "Missing" ? "text-red-500 text-xs font-semibold px-2 py-1" : ""}>
                        {info.getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: "email",
                header: "Email",
                cell: (info) => (
                    <span className={info.getValue() === "Missing" ? "text-red-500 text-xs font-semibold px-2 py-1" : ""}>
                        {info.getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: "role",
                header: "Role",
                cell: (info) => (
                    <span className={info.getValue() === "Missing" ? "text-red-500 text-xs font-semibold px-2 py-1" : ""}>
                        {info.getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: "issue",
                header: "Issue",
                cell: (info) => (
                    <span className={info.getValue() ? "text-red-500 text-xs font-semibold p-1 bg-red-200 rounded-lg" : ""}>
                        {info.getValue() as string}
                    </span>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: errorRows,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex flex-col items-center">
            {validRowCount > 0 && isFileUploaded && (
                <div className="text-green-500 text-sm font-medium mb-4">
                    {`Total ${validRowCount} entries for upload`}
                </div>
            )}

            {errorRows.length ? (
                <div className="flex flex-col items-start mt-4">
                    <div className="flex justify-between items-center w-full">
                        <h3 className="text-lg font-semibold tracking-tight">
                            {TEAM_BULK_REPORT_TEXT}
                        </h3>
                        <Button
                            className="bg-background px-3 py-2 text-sm font-semibold rounded-lg text-white"
                            text="Cancel"
                            onClick={removeFile}
                        />
                    </div>
                    <table className="min-w-full border-collapse border border-gray-300 mt-2">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="border border-gray-300 text-xs px-4 py-2"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="border border-gray-300 px-4 py-2 text-xs"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`border-2 w-full border-dashed rounded-md p-6 text-center mb-8 cursor-pointer hover:bg-gray-50 ${errorRows.length === 0 && isFileUploaded ? 'border-green-500' : ''}`}
                >
                    <Input type="file" {...getInputProps()} />
                    {isFileUploaded ? (
                        <div className="flex flex-col items-center   mt-2 relative">
                            <p className="text-sm text-gray-700 font-medium">
                                {TEAM_BULK_FILE_SUCCESS}
                            </p>
                            <button
                                onClick={removeFile}
                                className="absolute bottom-3 right-36 text-xl"
                            >
                                <IoCloseCircle size={24} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <FiUpload className="text-3xl text-gray-500" />
                            <p className="text-sm font-medium mt-2">{TEAM_BULK_UPLOAD_TEXT}</p>
                            <p className="text-xs text-gray-400">{TEAM_BULK_DRAG_TEXT}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
