import { useState, useEffect } from "react";
import { LuUserPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  ProgressBar,
  FileUploader,
  NavigationLink,
  Tabs,
  Select,
  FormRow,
  Card
} from "@/components/ui";
import {
  FormDescription,
  FormItem,
  FormLabel,
  Form,
} from "@/components/ui/form";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { BsArrowLeft } from "react-icons/bs";
import {
  AddTeamMemberAPI,
  fetchOrganization,
  SkipOnboardingAPI,
} from "../../service/api";
import toast, { Toaster } from "react-hot-toast";
import { teamContent } from "@/constants/AddTeamMembers";
import Email from "../../components/form/email";
import { FaArrowRight } from "react-icons/fa";

interface FormData {
  members: { name: string; email: string; role: string }[];
}

const AddTeamMembers = () => {
  const {
    TEAM_ADD_ANOTHER_BTN,
    TEAM_ADD_MEMBERS,
    TEAM_BACK_BTN,
    TEAM_BULK_UPLOAD,
    TEAM_EMAIL_INVITE,
    TEAM_EMAIL_REQUIRED,
    TEAM_FAILED_ERROR,
    TEAM_FOOTER_TEXT,
    TEAM_INVALID_EMAIL,
    TEAM_INVALID_NAME,
    TEAM_INVITATION_BTN_LOADER,
    TEAM_NAME_PLACEHOLDER,
    TEAM_NAME_REGEX,
    TEAM_REQUIRED,
    TEAM_ROLE_REQUIRED,
    TEAM_SELECT_ADMIN,
    TEAM_SELECT_EMPLOYEE,
    TEAM_SELECT_MANAGER,
    TEAM_SELECT_ROLE,
    TEAM_SEND_INVITATION_BTN,
    TEAM_SKIP_BTN,
    TEAM_STEP,
    TEAM_SUCCESS_MSG,
    TEAM_TEXT,
    TEAM_TITLE,
  } = teamContent;

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState("email");
  const [organizationId, setOrganizationId] = useState("");
  const form = useForm<FormData>({
    mode: "onChange",
    defaultValues: { members: [{ name: "", email: "", role: "" }] },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = form;

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
        console.log("error for fetch Organization data", error);
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
        toast.success(response?.message || TEAM_SUCCESS_MSG, {
          duration: 2000,
        });
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
  const canAddAnother =
    lastMember &&
    lastMember.name &&
    lastMember.email &&
    lastMember.role &&
    !lastMemberErrors;

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
        navigate("/dashboard", { replace: true });
      } else {
        toast.error(
          res?.error ||
            res?.response?.data?.error ||
            TEAM_FAILED_ERROR,
          { duration: 2000 }
        );
      }
    } catch (error) {
      console.log("error Skip On Boarding", error);
      toast.error(TEAM_FAILED_ERROR, { duration: 2000 });
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen px-4 mt-10 bg-card">
        <Card className="w-full max-w-xl p-8 border border-border shadow-lg">
            <Form {...form}>
              <ProgressBar
                currentStep={2}
                totalSteps={2}
                label={TEAM_STEP}
                statusText={TEAM_TITLE}
                className="mb-8"
              />

              <div className="flex items-center justify-between mb-8">
                <NavigationLink
                  to="/create-organization"
                  variant="ghost"
                  className="text-sm font-semibold"
                >
                  <BsArrowLeft className="mr-1 h-4 w-4" />
                  {TEAM_BACK_BTN}
                </NavigationLink>
                <Button
                  variant="ghost"
                  className="text-sm font-semibold"
                  onClick={handleSkipOnBoarding}
                >
                  {TEAM_SKIP_BTN}
                </Button>
              </div>

              <div className="box-shadow">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <LuUserPlus className="text-xl" />
                    <h2 className="text-xl font-bold">{TEAM_ADD_MEMBERS}</h2>
                  </div>
                  <FormDescription className="text-textPrimary opacity-70">
                    {TEAM_TEXT}
                  </FormDescription>
                </div>

                <Tabs
                  tabs={[
                    { value: "email", label: TEAM_EMAIL_INVITE },
                    { value: "bulk", label: TEAM_BULK_UPLOAD },
                  ]}
                  activeTab={tab}
                  onTabChange={handleTabChange}
                  className="mb-8"
                />

                <form onSubmit={handleSubmit(onSubmit)}>
                  {tab === "email" ? (
                    <div className="mb-8 space-y-6 w-full">
                      {fields.map((field, index) => (
                        <div key={field.id} className="w-full">
                          <FormItem className="mb-4">
                            <FormLabel>Name</FormLabel>
                            <Controller
                              name={`members.${index}.name`}
                              control={control}
                              rules={{
                                required: TEAM_REQUIRED,
                                pattern: {
                                  value: TEAM_NAME_REGEX,
                                  message: TEAM_INVALID_NAME,
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder={TEAM_NAME_PLACEHOLDER}
                                  error={errors.members?.[index]?.name?.message}
                                />
                              )}
                            />
                          </FormItem>

                          <FormRow>
                            <FormItem className="w-1/2">
                              <FormLabel>Email</FormLabel>
                              <Controller
                                name={`members.${index}.email`}
                                control={control}
                                rules={{
                                  required: TEAM_EMAIL_REQUIRED,
                                  pattern: {
                                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                    message: TEAM_INVALID_EMAIL,
                                  },
                                }}
                                render={({ field }) => (
                                  <Email
                                    {...field}
                                    error={
                                      errors.members?.[index]?.email?.message
                                    }
                                  />
                                )}
                              />
                            </FormItem>

                            <FormItem className="w-1/2">
                              <FormLabel>Role</FormLabel>
                              <Controller
                                name={`members.${index}.role`}
                                control={control}
                                rules={{ required: TEAM_ROLE_REQUIRED }}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    error={!!errors.members?.[index]?.role}
                                  >
                                    <option value="">{TEAM_SELECT_ROLE}</option>
                                    <option value="Employee">
                                      {TEAM_SELECT_EMPLOYEE}
                                    </option>
                                    <option value="Admin">
                                      {TEAM_SELECT_ADMIN}
                                    </option>
                                    <option value="Manager">
                                      {TEAM_SELECT_MANAGER}
                                    </option>
                                  </Select>
                                )}
                              />
                            </FormItem>
                          </FormRow>
                        </div>
                      ))}

                      <Button
                        variant="ghostOutline"
                        className="gap-2 w-fit mt-8"
                        onClick={handleAddMember}
                        disabled={!canAddAnother}
                      >
                        <LuUserPlus />
                        {TEAM_ADD_ANOTHER_BTN}
                      </Button>
                    </div>
                  ) : (
                    <FileUploader
                      mode="csv"
                      allowedTypes={["text/csv"]}
                      onUpload={(data) => setValue("members", data)}
                    />
                  )}

                  <Button
                    type="submit"
                    variant="create"
                    isLoading={loading}
                    loadingText={TEAM_INVITATION_BTN_LOADER}
                    icon={<FaArrowRight />}
                    className="mt-6"
                  >
                    {TEAM_SEND_INVITATION_BTN}
                  </Button>

                  <FormDescription className="text-center mt-5">
                    {TEAM_FOOTER_TEXT}
                  </FormDescription>
                </form>
              </div>
            </Form>
          </Card>
      </div>
    </>
  );
};

export default AddTeamMembers;