//src/pages/Onboarding/CreateOrganization.tsx
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { GoOrganization } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa";
import { FiUser, FiUsers } from "react-icons/fi";
import { LuBuilding } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  Button,
  Input,
  Card,
  ProgressBar,
  Select,
} from "@/components/ui";
import { CardSelect } from "@/components/card-select";
import {
  FormItem,
  FormLabel,
  FormDescription,
  Form,
} from "@/components/form";
import { CreateOrganizationAPI } from "../../service/api";
import { organizationContent } from "@/constants/CreateOrganization";

interface OrganizationFormData {
  organizationName: string;
  industry?: string;
  companySize: string;
}

const companySizeOptions = [
  {
    value: "startup (1-10 employees)",
    label: "Startup",
    icon: (isSelected: boolean) => (
      <FiUser
        className={`text-4xl p-[3px] rounded-full transition ${isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-500"
          }`}
      />
    ),
    description: "1-10 employees",
    bgColor: "bg-grey-50",
  },
  {
    value: "small (11-50 employees)",
    label: "Small",
    icon: (isSelected: boolean) => (
      <FiUsers
        className={`text-4xl p-[3px] rounded-full transition ${isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-500"
          }`}
      />
    ),
    description: "11-50 employees",
    bgColor: "bg-grey-50",
  },
  {
    value: "medium (51-200 employees)",
    label: "Medium",
    icon: (isSelected: boolean) => (
      <FiUsers
        className={`text-4xl p-[3px] rounded-full transition ${isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-500"
          }`}
      />
    ),
    description: "51-200 employees",
    bgColor: "bg-grey-50",
  },
  {
    value: "large (201-500 employees)",
    label: "Large",
    icon: (isSelected: boolean) => (
      <LuBuilding
        className={`text-4xl p-[3px] rounded-full transition ${isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-500"
          }`}
      />
    ),
    description: "201-500 employees",
    bgColor: "bg-grey-50",
  },
];

export default function CreateOrganization() {
  const {
    ORGANIZATION_TITLE,
    ORGANIZATION_ADD_EMPLOYEE_TEXT,
    ORGANIZATION_CREATE_ORGANIZATION,
    ORGANIZATION_TEXT,
    ORGANIZATION_NAME,
    ORGANIZATION_PLACEHOLDER,
    ORGANIZATION_BODY_TEXT,
    ORGANIZATION_INDUSTRY,
    ORGANIZATION_SELECT_INDUSTRY,
    ORGANIZATION_SELECT_TECHNOLOGY,
    ORGANIZATION_SELECT_HEALTHCARE,
    ORGANIZATION_SELECT_FINANCE,
    ORGANIZATION_SELECT_EDUCATION,
    ORGANIZATION_SELECT_RETAIL,
    ORGANIZATION_SELECT_MANUFACTURING,
    ORGANIZATION_SELECT_OTHER,
    ORGANIZATION_COMPANY_SIZE_TEXT,
    ORGANIZATION_FOOTER_TEXT,
    ORGANIZATION_REQUIRED,
    ORGANIZATION_SELECT_ERROR,
    ORGANIZATION_COMPANY_REQUIRED,
    ORGANIZATION_BUTTON_TEXT,
    ORGANIZATION_BUTTON_LOADING_TEXT,
  } = organizationContent;

  const navigate = useNavigate();
  const [formData, setFormData] = useState<OrganizationFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<OrganizationFormData>({
    defaultValues: formData || {
      organizationName: "",
      industry: "",
      companySize: "Startup",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<OrganizationFormData> = async (data) => {
    setLoading(true);
    try {
      const res = await CreateOrganizationAPI(data);
      if (res.success === true) {
        setFormData(null);
        await new Promise((resolve) => setTimeout(resolve, 2200));
        navigate("/add-employee");
      } else {
        toast.error(
          res?.response?.data?.error || "Server error please try again!",
          { duration: 2000 }
        );
      }
    } catch (error) {
      console.error("Error creating organization:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData) {
      setValue("organizationName", formData.organizationName);
      setValue("industry", formData.industry || "");
      setValue("companySize", formData.companySize || "Startup");
    }
  }, [formData, setValue]);

  return (
    <>
      <Toaster />
      <Card variant="elevated" size="lg">
        <Form {...form}>
          <div className="space-y-2 mb-8">
            <ProgressBar
              currentStep={1}
              totalSteps={2}
              label={ORGANIZATION_TITLE}
              statusText={ORGANIZATION_ADD_EMPLOYEE_TEXT}
            />
            <div className="flex items-center gap-2 mb-1">
              <GoOrganization className="text-xl" />
              <h2 className="text-xl font-bold">
                {ORGANIZATION_CREATE_ORGANIZATION}
              </h2>
            </div>
            <FormDescription className="text-xs text-muted-foreground opacity-70">
              {ORGANIZATION_TEXT}
            </FormDescription>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Items */}
            <FormItem className="mb-8">
              <FormLabel required className="text-sm font-medium mb-2">
                {ORGANIZATION_NAME}
              </FormLabel>
              <div className="relative">
                <Controller
                  name="organizationName"
                  control={control}
                  rules={{ required: ORGANIZATION_REQUIRED }}
                  render={({ field }) => (
                    <Input
                      placeholder={ORGANIZATION_PLACEHOLDER}
                      {...field}
                      className="text-sm"
                      error={!!errors.organizationName}
                    />
                  )}
                />
                {errors.organizationName && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.organizationName?.message}
                  </p>
                )}
              </div>
              <FormDescription className="text-xs text-textPrimary opacity-70">
                {ORGANIZATION_BODY_TEXT}
              </FormDescription>
            </FormItem>
            <FormItem className="mt-8">
              <FormLabel className="text-sm font-medium mb-2">
                {ORGANIZATION_INDUSTRY}
              </FormLabel>
              <Select
                {...register("industry", {
                  required: "Industry is required!",
                })}
                error={!!errors.industry}
                className={
                  errors.industry ? "border-destructive" : "border-gray-300"
                }
              >
                <option value="" disabled hidden>
                  {ORGANIZATION_SELECT_INDUSTRY}
                </option>

                <option value="technology">
                  {ORGANIZATION_SELECT_TECHNOLOGY}
                </option>

                <option value="healthCare">
                  {ORGANIZATION_SELECT_HEALTHCARE}
                </option>

                <option value="finance">{ORGANIZATION_SELECT_FINANCE}</option>

                <option value="education">
                  {ORGANIZATION_SELECT_EDUCATION}
                </option>

                <option value="retail">{ORGANIZATION_SELECT_RETAIL}</option>

                <option value="manufacturing">
                  {ORGANIZATION_SELECT_MANUFACTURING}
                </option>

                <option value="other">{ORGANIZATION_SELECT_OTHER}</option>
              </Select>
              {errors.industry && (
                <p className="text-destructive text-xs">
                  {errors.industry.message}
                </p>
              )}
              <FormDescription className="text-xs text-textPrimary opacity-70">
                {ORGANIZATION_SELECT_ERROR}
              </FormDescription>
            </FormItem>

            <FormItem className="mb-4">
              <FormLabel className="text-sm font-medium mb-2">
                {ORGANIZATION_COMPANY_SIZE_TEXT}
              </FormLabel>
              <CardSelect
                name="companySize"
                control={control}
                options={companySizeOptions}
                rules={{ required: ORGANIZATION_COMPANY_REQUIRED }}
              />
              {errors.companySize && (
                <p className="text-destructive text-xs">
                  {errors.companySize.message}
                </p>
              )}
              <FormDescription className="text-xs text-textPrimary opacity-70 mb-8">
                {ORGANIZATION_SELECT_ERROR}
              </FormDescription>
            </FormItem>

            <Button
              type="submit"
              variant="create"
              isLoading={loading}
              loadingText={ORGANIZATION_BUTTON_LOADING_TEXT}
              className={`text-sm text-white font-bold py-3 w-full rounded hover:bg-gray-900 transition cursor-pointer flex items-center justify-center ${loading ? "opacity-50" : ""
                } hover:scale-105`}
              icon={<FaArrowRight />}
            >
              {ORGANIZATION_BUTTON_TEXT}
            </Button>
            <FormDescription className="text-xs text-textPrimary opacity-70 mb-4 text-center">
              {ORGANIZATION_FOOTER_TEXT}
            </FormDescription>
          </form>
        </Form>
      </Card>
    </>
  );
}
