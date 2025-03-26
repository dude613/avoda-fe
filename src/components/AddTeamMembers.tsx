import { useState, useEffect } from "react";
import { LuUserPlus } from "react-icons/lu";
import { Input } from "./ui/input";
import { Controller, set, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import Button from "../ui/Button";
import CircularLoading from "./CircularLoading";
import { SiMinutemailer } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { AddTeamMemberAPI, fetchOrganization, SkipOnboardingAPI } from "../service/api";
import FileUploader from "../ui/FileUploader";
import toast, { Toaster } from "react-hot-toast";
import {
  TEAM_ADD_ANOTHER_BTN, TEAM_ADD_MEMBERS,
  TEAM_BACK_BTN, TEAM_BULK_UPLOAD, TEAM_EMAIL_INVITE,
  TEAM_EMAIL_REQUIRED, TEAM_FAILED_ERROR, TEAM_FOOTER_TEXT, TEAM_INVALID_EMAIL,
  TEAM_INVALID_NAME, TEAM_INVITATION_BTN_LOADER, TEAM_NAME_PLACEHOLDER,
  TEAM_NAME_REGEX, TEAM_REQUIRED, TEAM_ROLE_REQUIRED, TEAM_SELECT_ADMIN,
  TEAM_SELECT_EMPLOYEE, TEAM_SELECT_MANAGER, TEAM_SELECT_ROLE, TEAM_SEND_INVITATION_BTN,
  TEAM_SKIP_BTN, TEAM_STEP, TEAM_SUCCESS_MSG, TEAM_TEXT, TEAM_TITLE
} from "@/constants/AddTeamMembers";
import Email from "./form/email";
import { Label } from "./ui/label";

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
        console.log(response)
        toast.success(response?.message || TEAM_SUCCESS_MSG, { duration: 2000 });
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 500);
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

  const handleSkipOnBoarding = async () => {
    if (!organizationId) {
      toast.error("Organization ID is missing.", { duration: 2000 });
      return;
    }
    try {
      const res = await SkipOnboardingAPI(organizationId);
      if (res?.success === true) {
        navigate("/dashboard", { replace: true })
      } else {
        toast.error(res?.error || res?.response?.data?.error || "Failed to skip onboarding", { duration: 2000 });
      }
    } catch (error) {
      console.log("error Skip On Boarding", error);
      toast.error(TEAM_FAILED_ERROR, { duration: 2000 });
    }
  }
  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen px-4 mt-10 bg-card">
        <div className="border border-gray-300 rounded-lg shadow-lg p-8 w-full max-w-xl">
          <div className="border border-border rounded-lg p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{TEAM_STEP}</span>
                <span className="text-sm text-gray-500 font-semibold">{TEAM_TITLE}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-black h-2 rounded-full w-full" />
              </div>
            </div>
            <div className="flex items-center justify-between mb-8">
              <Link to="/create-organization" className="flex items-center text-sm font-semibold hover:text-gray-700">
                <BsArrowLeft className="mr-1 h-4 w-4" />
                {TEAM_BACK_BTN}
              </Link>
              <button className="border-none text-sm font-semibold hover:text-gray-700 cursor-pointer" onClick={handleSkipOnBoarding}>
                {TEAM_SKIP_BTN}
              </button>
            </div>
            <div className="box-shadow">
              <div className="mb-6 h-full overflow-auto w-fit">
                <div className="flex items-center gap-2 mb-1">
                  <LuUserPlus className="text-xl" />
                  <h2 className="text-xl font-bold">{TEAM_ADD_MEMBERS}</h2>
                </div>
                <span className="text-sm font-semibold text-textPrimary opacity-70 mb-4 text-center">
                  {TEAM_TEXT}
                </span>
              </div>
              <div className="flex overflow-hidden bg-gray-100 mb-8">
                <button
                  type="button"
                  className={`py-2 px-4 flex-1 mx-1 my-1 ${tab === "email" ? "bg-white font-medium rounded-md shadow-md" : "bg-gray-100 text-gray-500"}`}
                  onClick={() => handleTabChange("email")}
                >
                  {TEAM_EMAIL_INVITE}
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 flex-1 mx-1 my-1 ${tab === "bulk" ? "bg-white font-medium shadow-md" : "bg-gray-100 text-gray-500"}`}
                  onClick={() => handleTabChange("bulk")}
                >
                  {TEAM_BULK_UPLOAD}
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                {tab === "email" ? (
                  <div className="mb-8 space-y-6 w-full">
                    {fields.map((field, index) => (
                      <div key={field.id} className="w-full">
                        <div className="relative mb-4 w-full">
                          <Label className="mb-1">Name</Label>
                          <Controller
                            name={`members.${index}.name`}
                            control={control}
                            defaultValue={field.name}
                            rules={{
                              required: TEAM_REQUIRED,
                              pattern: {
                                value: TEAM_NAME_REGEX,
                                message: TEAM_INVALID_NAME
                              }
                            }}
                            render={({ field: controllerField }) => (
                              <Input
                                {...controllerField}
                                placeholder={TEAM_NAME_PLACEHOLDER}
                                className={`py-4 text-sm w-full ${errors.members?.[index]?.name ? 'border-red-400' : ''}`}
                              />
                            )}
                          />
                          {errors.members?.[index]?.name && (
                            <p className="absolute text-xs text-destructive mb-2">
                              {errors.members[index].name.message}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-4">
                          <div className="w-1/2 mb-4">
                            <Controller
                              name={`members.${index}.email`}
                              control={control}
                              defaultValue=""
                              rules={{
                                required: TEAM_EMAIL_REQUIRED,
                                pattern: {
                                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                  message: TEAM_INVALID_EMAIL
                                }
                              }}
                              render={({ field }) => (
                                <Email
                                  {...field}
                                  error={errors?.members?.[index]?.email?.message?.toString()}
                                />
                              )}
                            />
                          </div>

                          <div className="w-1/2">
                            <Label>Role</Label>
                            <div className="mt-2">
                              <Controller
                                name={`members.${index}.role`}
                                control={control}
                                defaultValue={field.role}
                                rules={{ required: TEAM_ROLE_REQUIRED }}
                                render={({ field: controllerField }) => (
                                  <select {...controllerField} className={`border-input file:text-foreground placeholder:text-muted-foreground/70 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none mb-2 ${errors.members?.[index]?.role ? 'border-red-400' : ''}`}>
                                    <option value="">{TEAM_SELECT_ROLE}</option>
                                    <option value="Employee">{TEAM_SELECT_EMPLOYEE}</option>
                                    <option value="Admin">{TEAM_SELECT_ADMIN}</option>
                                    <option value="Manager">{TEAM_SELECT_MANAGER}</option>
                                  </select>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      icon={<LuUserPlus className="text-xl" />}
                      text={TEAM_ADD_ANOTHER_BTN}
                      disabled={!canAddAnother}
                      className={`flex rounded-lg w-fit md:px-4 py-4 mt-8 lg:px-8 bg-transparent text-primary border hover:bg-transparent cursor-pointer ${!canAddAnother ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
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
                  text={loading ? TEAM_INVITATION_BTN_LOADER : TEAM_SEND_INVITATION_BTN}
                  icon={loading ? <CircularLoading /> : undefined}
                  iconRight={!loading ? <SiMinutemailer /> : undefined}
                  disabled={loading}
                  className={`bg-primary text-sm text-white font-bold py-3 w-full rounded hover:bg-gray-900 transition cursor-pointer flex items-center justify-center ${loading ? "opacity-50" : ""} hover:scale-105`}
                />
              </form>

              <p className="text-sm text-gray-700 mt-5 text-center">
                {TEAM_FOOTER_TEXT}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddTeamMembers;