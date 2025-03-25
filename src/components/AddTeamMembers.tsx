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
import FileUploader from "../ui/FileUploader";
import toast, { Toaster } from "react-hot-toast";

interface FormData {
  members: { name: string; email: string; role: string }[];
}

const AddTeamMembers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState("email");
  const [organizationId, setOrganizationId] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: { members: [{ name: "", email: "", role: "" }] },
  });
  const { fields, append } = useFieldArray({ control, name: "members" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOrganization();
        if (data && data.success && data.data.length > 0) {
          const orgId = data.data[0]._id;
          setOrganizationId(orgId);
        }
      } catch (error) {
        console.log("error for fetch Organization data", error)
      }
    };
    fetchData();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    const teamMembersData = data.members.map((member) => ({
      name: member.name,
      email: member.email,
      role: member.role,
      orgId: organizationId,
    }));
    try {
      const response = await AddTeamMemberAPI({ members: teamMembersData });
      if (response?.success === true) {
        toast.success(response?.message || "Team member added successfully");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error(response?.error || response?.response?.data?.error);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }
  };

  const membersData = watch("members");
  const lastIndex = membersData.length - 1;
  const lastMember = membersData[lastIndex];
  const lastMemberErrors = errors.members && errors.members[lastIndex];
  const canAddAnother = lastMember && lastMember.name && lastMember.email && lastMember.role && !lastMemberErrors;

  const handleAddMember = () => {
    if (canAddAnother) {
      append({ name: "", email: "", role: "" });
    }
  };

  const handleTabChange = (tabName: string) => {
    if (tabName !== tab) {
      reset({ members: [{ name: "", email: "", role: "" }] });
    }
    setTab(tabName);
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-col items-center justify-center mt-10 w-full bg-gray-100 p-4">
        <div className="flex flex-col items-center justify-center bg-gray-100 px-1">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 lg:w-[600px] lg:min-h-[550px]">
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
              <Link to="/create-organization" className="flex items-center text-sm font-semibold hover:text-gray-700">
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
                  <h2 className="text-xl font-bold text-black">Add team members</h2>
                </div>
                <span className="text-sm font-semibold text-textPrimary opacity-70 mb-4 text-center">
                  Invite your colleagues to join your organization
                </span>
              </div>
              <div className="flex overflow-hidden bg-gray-100 mb-8">
                <button
                  type="button"
                  className={`py-2 px-4 flex-1 mx-1 my-1 ${tab === "email" ? "bg-white font-medium rounded-md shadow-md" : "bg-gray-100 text-gray-500"}`}
                  onClick={() => handleTabChange("email")}
                >
                  Email Invites
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 flex-1 mx-1 my-1 ${tab === "bulk" ? "bg-white font-medium shadow-md" : "bg-gray-100 text-gray-500"}`}
                  onClick={() => handleTabChange("bulk")}
                >
                  Bulk Upload
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                {tab === "email" ? (
                  <div className="mb-8 space-y-6 w-full">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <div className="w-[33%] relative">
                          <Controller
                            name={`members.${index}.name`}
                            control={control}
                            defaultValue={field.name}
                            rules={{
                              required: "Name is required",
                              pattern: {
                                value: /^[A-Za-z ]+$/,
                                message: "Invalid name"
                              }
                            }}
                            render={({ field: controllerField }) => (
                              <Input
                                {...controllerField}
                                placeholder="Full Name"
                                className={`py-4 text-sm ${errors.members?.[index]?.name ? 'border-red-500' : ''}`}
                              />
                            )}
                          />
                          {errors.members?.[index]?.name && (
                            <p className="absolute text-xs text-red-500 bottom-[-16px]">
                              {errors.members[index].name.message}
                            </p>
                          )}
                        </div>
                        <div className="w-[33%] relative">
                          <Controller
                            name={`members.${index}.email`}
                            control={control}
                            defaultValue={field.email}
                            rules={{
                              required: "Email is required",
                              pattern: {
                                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                message: "Invalid email format"
                              }
                            }}
                            render={({ field: controllerField }) => (
                              <Input
                                {...controllerField}
                                placeholder="Email address"
                                className={`py-4 text-sm ${errors.members?.[index]?.email ? 'border-red-500' : ''}`}
                              />
                            )}
                          />
                          {errors.members?.[index]?.email && (
                            <p className="absolute text-xs text-red-500 bottom-[-16px]">
                              {errors.members[index].email.message}
                            </p>
                          )}
                        </div>
                        <div className="w-[33%] relative">
                          <Controller
                            name={`members.${index}.role`}
                            control={control}
                            defaultValue={field.role}
                            rules={{ required: "Role is required" }}
                            render={({ field: controllerField }) => (
                              <select {...controllerField} className={`border py-4 text-sm rounded w-full ${errors.members?.[index]?.role ? 'border-red-500' : ''}`}>
                                <option value="">Select Role</option>
                                <option value="Employee">Employee</option>
                                <option value="Admin">Admin</option>
                                <option value="Manager">Manager</option>
                              </select>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      icon={<LuUserPlus className="text-xl" />}
                      text={"Add another"}
                      disabled={!canAddAnother}
                      className={`flex rounded-lg w-fit md:px-4 py-4 mt-8 lg:px-8 bg-transparent text-textPrimary border hover:bg-transparent ${!canAddAnother ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                        }`}
                      onClick={handleAddMember}
                    />
                  </div>
                ) : (
                  <FileUploader
                    mode="csv"
                    allowedTypes={["text/csv"]}
                    onUpload={(data) => {
                      setValue("members", data);
                    }}
                  />
                )}
                <Button
                  type="submit"
                  text={loading ? "Invitations Sending..." : "Send Invitations"}
                  icon={loading ? <CircularLoading /> : undefined}
                  iconRight={!loading ? <SiMinutemailer /> : undefined}
                  disabled={loading}
                  className={`bg-background text-sm text-text font-bold py-3 w-full rounded hover:bg-gray-900 transition cursor-pointer flex items-center justify-center ${loading ? "opacity-50" : "hover:scale-105"
                    } mt-5 py-4 text-lg`}
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
  );
};
export default AddTeamMembers;