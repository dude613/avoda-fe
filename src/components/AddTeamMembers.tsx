import { useState, useEffect } from "react";
import { LuUserPlus } from "react-icons/lu";
import Input from "../ui/Input";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import Button from "../ui/Button";
import CircularLoading from "./CircularLoading";
import { SiMinutemailer } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { AddTeamMemberAPI, fetchOrganization } from "../service/api";
import toast, { Toaster } from "react-hot-toast";
import FileUploader from "../ui/FileUploader";


interface FormData {
  members: { email: string; role: string }[];
  file?: FileList;
}

const AddTeamMembers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState("email");
  const [organizaitonId, setOrganizationId] = useState("");
  const [, setCsvData] = useState<any[]>([]);
  const [csvError, setCsvError] = useState<string>('')
  const { control, handleSubmit, formState: { errors }, trigger, setValue } = useForm<FormData>({
    defaultValues: { members: [{ email: "", role: "" }] },
  });

  const { fields, append } = useFieldArray<any>({ control, name: "members" });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchOrganization();
      if (data && data.success && data.data.length > 0) {
        const orgId = data.data[0]._id;
        setOrganizationId(orgId);
      }
    }
    fetchData();
  }, [])
  
  
  const handleCsvUpload = (data: any) => {
    setCsvData(data);
    setCsvError('');
    const seenEmails = new Set<string>();
    const invalidEntries = data.filter((item: any, index: number) => {
      const email = item.Email ? item.Email.toLowerCase() : '';
      const role = item.Role ? item.Role.toLowerCase() : '';
      if (!email) {
        setCsvError(`Email is empty at row ${index + 1}`);
        return true;
      }
  
      if (!validateEmail(email)) {
        setCsvError(`Invalid email format at row ${index + 1}: ${email}`);
        return true;
      }
  
      if (seenEmails.has(email)) {
        setCsvError(`Duplicate email exists at row ${index + 1}: ${email}`);
        return true;
      }
  
      seenEmails.add(email);
  
      if (!role || !validateRole(role)) {
        setCsvError(`Invalid role at row ${index + 1}: ${role}`);
        return true;
      }
  
      return false;
    });
  
    if (invalidEntries.length > 0) {
      return;
    }
  
    setValue("members", data.map((item: any) => ({
      email: item.Email ? item.Email.toLowerCase() : '',
      role: item.Role ? item.Role.toLowerCase() : ''
    })));
  };
  
  const validateEmail = (email: string) => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  };
  
  const validateRole = (role: string) => {
    const validRoles = ["employee", "admin", "manager"];
    return validRoles.includes(role);
  };
  

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Form Submitted:", data);
    setLoading(true);
    const teamMembersData = data.members.map((member) => ({
      email: member.email,
      role: member.role,
      orgId: organizaitonId
    }));
    try {
      const response = await AddTeamMemberAPI({ members: teamMembersData });
      if (response?.success === true) {
        toast.success(response?.message || "Team member added successfully")
        setTimeout(() => {
          navigate("/dashboard")
        }, 1000)
      } else {
        toast.error(response?.error || response?.response?.data?.error)
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    const isValid = await trigger("members");
    if (!isValid) {
      console.log("Validation failed!");
    } else {
      append({ email: "", role: "Employee" });
    }
  };

  const handleEmailChange = async (index: number) => {
    trigger(`members.${index}.email`);
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-col items-center justify-center mt-10 w-full  bg-gray-100 p-4">
        <div className={`flex flex-col items-center justify-center bg-gray-100 px-1`}>
          <div className={`bg-white p-6 rounded-lg shadow-lg border border-gray-300 lg:w-[600px] lg:min-h-[550px]`}>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Step 2 of 2</span>
                <span className="text-sm text-gray-500 font-semibold">Add Employees</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-black h-2 rounded-full w-full" />
              </div>
            </div>
            <div className="flex items-center justify-between mb-8">
              <Link
                to="/create-organization"
                className="flex items-center text-sm font-semibold hover:text-gray-700"
              >
                <BsArrowLeft className="mr-1 h-4 w-4" />
                Back to Organization
              </Link>
              <button className="text-black border-none text-sm font-semibold hover:text-gray-700" onClick={() => navigate("/dashboard")}>
                Skip for now
              </button>
            </div>
            <div className="box-shadow">
              <div className="mb-6 h-full overflow-auto w-fit">
                <div className="flex items-center gap-2 mb-1">
                  <LuUserPlus className="text-xl" />
                  <h2 className="text-xl font-bold text-black">
                    Add team members
                  </h2>
                </div>
                <span className="text-sm font-semibold text-textPrimary opacity-70 mb-4 text-center">
                  Invite your colleagues to join your organization
                </span>
              </div>
              <div className="flex overflow-hidden bg-gray-100 mb-8">
                <button
                  className={`py-2 px-4 flex-1 mx-1 my-1 ${tab === "email" ? "bg-white font-medium rounded-md shadow-md" : "bg-gray-100 text-gray-500"}`}
                  onClick={() => setTab("email")}
                >
                  Email Invites
                </button>
                <button
                  className={`py-2 px-4 flex-1 mx-1 my-1 ${tab === "bulk" ? "bg-white font-medium shadow-md" : "bg-gray-100 text-gray-500"}`}
                  onClick={() => setTab("bulk")}
                >
                  Bulk Upload
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                {tab === "email" ? (
                <div className="mb-8 space-y-4 w-full">
                {fields.map((field: any, index: number) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <div className="w-[50%] relative">
                      <Controller
                        name={`members.${index}.email`}
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                            message: "Invalid email format"
                          }
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Email address"
                            onChange={(e) => {
                              field.onChange(e);
                              handleEmailChange(index);
                            }}
                            className={`py-4 text-sm ${errors.members?.[index]?.email ? 'border-red-500' : ''} ${field.value && !errors.members?.[index]?.email && field.value !== "" && !errors.members?.[index]?.email ? 'border-green-500' : ''}`}
                          />
                        )}
                      />
                      {errors.members?.[index]?.email && (
                        <p className="absolute text-xs text-red-500 bottom-[-16px]">{errors.members[index].email.message}</p>
                      )}
                    </div>
                    <div className="w-[50%] relative">
                      <Controller
                        name={`members.${index}.role`}
                        control={control}
                        defaultValue={field.role}
                        rules={{
                          required: "Role is required",
                        }}
                        render={({ field }) => (
                          <select
                            {...field}
                            className={`border py-4 text-sm p-3 rounded focus:outline-none focus:ring-1 bg-white focus:ring-gray-400 w-full ${errors.members?.[index]?.role ? 'border-red-500' : ''}`}
                            onChange={(e) => {
                              field.onChange(e);
                              trigger(`members.${index}.role`);
                            }}
                          >
                            <option value="">Select Role</option>
                            <option value="Employee">Employee</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                          </select>
                        )}
                      />
                      {errors.members?.[index]?.role && (
                        <p className="absolute text-xs text-red-500 bottom-[-16px]">{errors.members[index].role.message}</p>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  icon={<LuUserPlus className="text-xl" />}
                  text={"Add another"}
                  className={`w-fit md:px-4 py-4 lg:px-8 bg-transparent text-textPrimary border hover:bg-transparent hover:scale-105`}
                  onClick={handleAddMember}
                />
              </div>
              
                ) : (
                  <div className="mt-5 text-center border border-dashed p-4 rounded-lg border-gray-300">
                    <div className="flex items-center justify-center">
                      <div className="bg-gray-400 rounded-full p-2 flex items-center justify-center">
                        <LuUserPlus className="mx-auto" size={28} />
                      </div>
                    </div>
                    <p className="font-medium mt-4">Bulk upload employees</p>
                    <p className="text-sm text-gray-500 mt-2 mb-6">Upload a CSV file with employee details</p>
                    <FileUploader
                      mode="csv"
                      allowedTypes={["text/csv"]}
                      onUpload={handleCsvUpload}
                    />
                    {csvError && (
                      <p className="text-red-500">{csvError}</p>
                    )}
                  </div>
                )}
                <Button
                  type="submit"
                  text={`${loading ? "Invitations Sending..." : "Send Invitations"}`}
                  icon={loading && <CircularLoading />}
                  iconRight={!loading && <SiMinutemailer className="" />}
                  disabled={loading}
                  className={`${loading ? "opacity-50" : ""} hover:scale-105 mt-5 py-4 text-lg`}
                />
              </form>
              <p className="text-sm text-gray-700 mt-5 text-center">
                Invitations will be sent via email with instructions to join your organization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddTeamMembers;
