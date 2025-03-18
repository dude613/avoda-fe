import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { LuUserPlus } from "react-icons/lu";
import Input from "../Input";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import Button from "../Button";
import CircularLoading from "../../components/CircularLoading";
import { SiMinutemailer } from "react-icons/si";
import { FiUpload } from "react-icons/fi";

interface FormData {
  members: { email: string; role: string }[];
  file?: FileList;
}

const AddTeamMembers = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState("email");
  const { control, handleSubmit, register, reset } = useForm<FormData>({
    defaultValues: { members: [{ email: "", role: "Employee" }] },
  });

  const { fields, append } = useFieldArray<any>({ control, name: "members" });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Form Submitted:", data);
    reset();
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.type === "text/csv") {
      console.log("CSV File Selected:", file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'text/csv': ['.csv'] } });

  return (
    <div className="mx-auto bg-white">
      <div className="flex border rounded-lg overflow-hidden bg-gray-100">
        <button
          className={`py-2 px-4 flex-1 mx-1 my-1 ${tab === "email" ? "bg-white font-medium rounded-md" : "bg-gray-100 text-gray-500"}`}
          onClick={() => setTab("email")}
        >
          Email Invites
        </button>
        <button
          className={`py-2 px-4 flex-1 mx-1 my-1 ${tab === "bulk" ? "bg-white font-medium" : "bg-gray-100 text-gray-500"}`}
          onClick={() => setTab("bulk")}
        >
          Bulk Upload
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {tab === "email" ? (
          <div className="mt-4 space-y-3 w-full">
            {fields.map((field: any, index: number) => (
              <div key={field.id} className="flex items-center gap-2">
                <div className="w-[44%]">
                  <Controller
                    name={`members.${index}.email`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Email address"
                      />
                    )}
                  />
                </div>
                <select 
                  {...register(`members.${index}.role`)} 
                  className="border text-xs p-3 rounded focus:outline-none focus:ring-1 bg-white focus:ring-gray-400 w-[37%]"
                >
                  <option value={"Employee"}>Employee</option>
                  <option value={"Admin"}>Admin</option>
                  <option value={"Manager"}>Manager</option>
                </select>
                <div className="w-[19%]">
                  <Button
                    type="button"
                    text={`${false ? "Adding ..." : "Add"}`}
                    icon={false && <CircularLoading />}
                    disabled={false}
                    className={`${false ? "opacity-50" : ""} w-fit px-8 py-[10px] bg-transparent text-textPrimary border hover:bg-transparent hover:scale-105`}
                    onClick={() =>{console.log('click add');
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
                type="button"
                icon={<LuUserPlus className="text-xl"/>}
                text={"Add another"}
                className={`w-fit md:px-4 lg:px-8 bg-transparent text-textPrimary border hover:bg-transparent hover:scale-105`}
                onClick={() => append({ email: "", role: "Employee" })}
              />
          </div>
        ): (
          <div className="mt-5 text-center border border-dashed p-4 rounded-lg border-gray-300">
            <div {...getRootProps()} className="p-6 border-none rounded-lg cursor-pointer hover:bg-gray-100">
              <input {...getInputProps()} />
              <div className="flex items-center justify-center"> 
                <div className="bg-gray-400 rounded-full p-2 flex items-center justify-center">
                <LuUserPlus className="mx-auto" size={28} />
                </div>
              </div>
              <p className="font-medium mt-4">Bulk upload employees</p>
              <p className="text-sm text-gray-500 mt-2 mb-6">Upload a CSV file with employee details</p>
              <input type="file" accept=".csv" className="hidden" id="csvUpload"/>
              <label htmlFor="csvUpload" className="bg-black text-white px-4 py-2 rounded cursor-pointer">
                Upload CSV
              </label>
              <p className="text-sm mt-4 text-gray-500 cursor-pointer">
                {`Download our `}
                <span
                  className="underline text-textPrimary"
                >{`CSV template`}</span>
              </p>
            </div>
          </div>
        )}
        <Button
          type="submit"
          text={`${loading ? "Invitations Sending..." : "Send Invitations"}`}
          icon={loading && <CircularLoading />}
          iconRight={!loading && <SiMinutemailer className="" />}
          disabled={loading}
          className={`${loading ? "opacity-50" : ""} hover:scale-105 mt-5`}
        />
      </form>
      <p className="text-xs text-gray-500 mt-4 text-center">
        Invitations will be sent via email with instructions to join your organization.
      </p>
    </div>
  )
}

export default AddTeamMembers