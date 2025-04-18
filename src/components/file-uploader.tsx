import { useState, useCallback, useTransition, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import Papa from "papaparse";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { teamContent } from "@/constants/AddTeamMembers";
import { Input } from "@/components/ui/input";

type NormalizedRow = {
  name: string;
  email: string;
  role: string;
};

type FileUploaderProps = {
  mode: "single" | "multiple" | "csv";
  allowedTypes: string[];
  onUpload: (data: NormalizedRow[]) => void;
};
type ErrorRow = {
  row: number;
  name: string;
  email: string;
  role: string;
  issue: string;
};

type RawRow = {
  Name?: string;
  Email?: string;
  Role?: string;
};

export function FileUploader({
  mode,
  allowedTypes,
  onUpload,
}: FileUploaderProps) {
  const {
    TEAM_BULK_DRAG_TEXT,
    TEAM_BULK_DUPLICATE_EMAIL,
    TEAM_BULK_FILE_SUCCESS,
    TEAM_BULK_INVALID_FILE,
    TEAM_BULK_INVALID_NAME,
    TEAM_BULK_INVALID_ROLE,
    TEAM_BULK_MISSING_ERROR,
    TEAM_BULK_REPORT_TEXT,
    TEAM_BULK_REQUIRED,
    TEAM_BULK_UPLOAD_TEXT,
    EMAIL_REGEX,
    TEAM_INVALID_EMAIL,
  } = teamContent;

  const [errorRows, setErrorRows] = useState<ErrorRow[]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [validRowCount, setValidRowCount] = useState(0);
  const [, startTransition] = useTransition();
  const validateEmail = (email: string) => EMAIL_REGEX.test(email);

  const validateData = (data: RawRow[]) => {
    if (!data || !Array.isArray(data)) {
      console.error("Invalid data provided for validation");
      setErrorRows([]);
      setValidRowCount(0);
      setIsFileUploaded(false);
      return;
    }
    const errors: ErrorRow[] = [];
    const emailsSet = new Set<string>();

    const normalizedData = data.map((row) => ({
      name: row.Name ? row.Name.trim().toLowerCase() : "",
      email: row.Email ? row.Email.trim().toLowerCase() : "",
      role: row.Role ? row.Role.trim().toLowerCase() : "",
    }));

    normalizedData.forEach((row, index) => {
      const { name, email, role } = row;
      const msgs: string[] = [];

      const missingFields: string[] = [];
      if (!name) missingFields.push("Name");
      if (!email) missingFields.push("Email");
      if (!role) missingFields.push("Role");

      if (missingFields.length === 3) {
        msgs.push(TEAM_BULK_REQUIRED);
      } else if (missingFields.length === 2) {
        msgs.push(`${missingFields.join(" and ")} required fields`);
      } else if (missingFields.length === 1) {
        msgs.push(`${missingFields[0]} required fields`);
      }
      if (name && !/^[a-zA-Z\s]+$/.test(name)) {
        msgs.push(TEAM_BULK_INVALID_NAME);
      }

      if (email) {
        if (!validateEmail(email)) {
          msgs.push(TEAM_INVALID_EMAIL);
        } else if (emailsSet.has(email)) {
          msgs.push(TEAM_BULK_DUPLICATE_EMAIL);
        } else {
          emailsSet.add(email);
        }
      }

      if (role && !["admin", "manager", "employee"].includes(role)) {
        msgs.push(TEAM_BULK_INVALID_ROLE);
      }

      if (msgs.length) {
        errors.push({
          row: index + 1,
          name: name || TEAM_BULK_MISSING_ERROR,
          email: email || TEAM_BULK_MISSING_ERROR,
          role: role || TEAM_BULK_MISSING_ERROR,
          issue: msgs.join(", "),
        });
      }
    });

    if (errors.length) {
      setErrorRows(errors);
      setValidRowCount(0);
      setIsFileUploaded(false);
    } else {
      onUpload(normalizedData);
      setValidRowCount(normalizedData.length);
      setErrorRows([]);
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) =>
        startTransition(() => validateData(result.data as RawRow[])),
    });
  };

  const handleFiles = useCallback(
    (acceptedFiles: File[]) => {
      const files =
        mode === "single" ? acceptedFiles.slice(0, 1) : acceptedFiles;
      const validFiles = files.filter((file) =>
        allowedTypes.includes(file.type)
      );
      //TODO switch to a different alert
      if (!validFiles.length) return alert(TEAM_BULK_INVALID_FILE);
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

  const columns = useMemo<ColumnDef<ErrorRow>[]>(
    () => [
      {
        accessorKey: "row",
        header: "Row",
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => (
          <span
            className={
              info.getValue() === "Missing"
                ? "text-destructive text-xs font-semibold px-2 py-1"
                : ""
            }
          >
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => (
          <span
            className={
              info.getValue() === "Missing"
                ? "text-destructive text-xs font-semibold px-2 py-1"
                : ""
            }
          >
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => (
          <span
            className={
              info.getValue() === "Missing"
                ? "text-destructive text-xs font-semibold px-2 py-1"
                : ""
            }
          >
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "issue",
        header: "Issue",
        cell: (info) => (
          <span
            className={
              info.getValue()
                ? "flex text-center justify-center text-destructive text-xs font-semibold p-1 rounded-lg"
                : ""
            }
          >
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
        <div className="flex flex-col items-start mt-4 mb-8">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold tracking-tight">
              {TEAM_BULK_REPORT_TEXT}
            </h3>
            <button
              onClick={removeFile}
              className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
            >
              <IoCloseCircle size={20} />
            </button>
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
          className={`border-2 w-full border-dashed rounded-md p-6 text-center mb-8 cursor-pointer hover:bg-gray-50 ${
            errorRows.length === 0 && isFileUploaded ? "border-green-500" : ""
          }`}
        >
          <Input type="file" {...getInputProps()} />
          {isFileUploaded ? (
            <div className="flex items-center justify-center mt-2 relative">
              <p className="text-sm text-gray-700 font-medium">
                {TEAM_BULK_FILE_SUCCESS}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="absolute -right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors flex items-center"
              >
                <IoCloseCircle size={20} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FiUpload className="text-3xl text-gray-500" />
              <p className="text-sm font-medium mt-2">
                {TEAM_BULK_UPLOAD_TEXT}
              </p>
              <p className="text-xs text-gray-400">{TEAM_BULK_DRAG_TEXT}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
