import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  FaArrowRight,
} from "react-icons/fa";
import { FiUser, FiUsers } from "react-icons/fi";
import { LuBuilding } from "react-icons/lu";
import Input from "../Input";
import { useMemo, useState, useEffect } from "react";
import Button from "../Button";
import CircularLoading from "../../components/CircularLoading";
import { organizationNameAPI } from "../../service/api";

interface OrganizationFormData {
  organizationName: string;
  industry?: string;
  companySize: string;
}

interface Props {
  nextStep: () => void;
  formData: OrganizationFormData | null;
  setFormData: React.Dispatch<React.SetStateAction<OrganizationFormData | null>>;
}

const CreateYourOrganization = ({ nextStep, formData, setFormData }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string>('');
  const [inputBorderColor, setInputBorderColor] = useState<string>('border-gray-300');

  const companySize = useMemo(
    () => [
      {
        label: "Startup",
        value: "Startup",
        employees: "1-10",
        icon: (isSelected: boolean) => (
          <FiUser
            className={`text-4xl p-[3px] mb-1 rounded-full transition ${isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}
          />
        ),
        bgColor: "bg-blue-50",
      },
      {
        label: "Small",
        value: "Small",
        employees: "11-50",
        icon: (isSelected: boolean) => (
          <FiUsers
            className={`text-4xl p-1 mb-1 rounded-full transition ${isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}
          />
        ),
        bgColor: "bg-green-50",
      },
      {
        label: "Medium",
        value: "Medium",
        employees: "51-200",
        icon: (isSelected: boolean) => (
          <FiUsers
            className={`text-4xl p-[3px] mb-1 rounded-full transition ${isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}
          />
        ),
        bgColor: "bg-yellow-50",
      },
      {
        label: "Large",
        value: "Large",
        employees: "201-500",
        icon: (isSelected: boolean) => (
          <LuBuilding
            className={`text-4xl p-[3px] mb-1 rounded-full transition ${isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}
          />
        ),
        bgColor: "bg-orange-50",
      },
    ],
    []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    defaultValues: formData || {
      organizationName: "",
      industry: "",
      companySize: "Startup",
    },
  });

  const selectedCompanySize = watch("companySize");

  const onSubmit: SubmitHandler<OrganizationFormData> = (data) => {
    setFormData(data);
    nextStep();
  };

  useEffect(() => {
    if (formData) {
      setValue("organizationName", formData.organizationName);
      setValue("industry", formData.industry || "");
      setValue("companySize", formData.companySize || "Startup");
    }
  }, [formData, setValue]);

  const organizationName = watch("organizationName");

  useEffect(() => {
    if (organizationName && organizationName.length > 0) {
      const fetchOrganizationData = async () => {
        setLoading(true);
        try {
          const name = organizationName;
          const res = await organizationNameAPI(name);

          if (res.success === false) {
            setNameError(res?.error);
            setInputBorderColor('border-red-500');
          } else {
            setNameError('');
            setInputBorderColor('border-green-500');
          }
        } catch (error) {
          console.error("Error while fetching organization data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrganizationData();
    }
  }, [organizationName]);

  return (
    <div className="mx-auto bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            Organization Name
            <span className="text-textMandatory ml-1">*</span>
          </label>
          <div className="relative">
            <Controller
              name="organizationName"
              control={control}
              rules={{
                required: "Organization name must be at least 2 characters long!",
              }}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Enter your organization name"
                  {...field}
                  className={`min-w-8 border ${inputBorderColor}`}
                  error={errors.organizationName?.message || nameError}
                />
              )}
            />
          </div>
          <p className="text-xs text-textPrimary opacity-70 mb-4 mt-2">
            This will be the name of your organization in the system.
          </p>
        </div>

        <div className="mt-8">
          <label className="block text-sm font-medium mb-2">Industry</label>
          <select
            {...register("industry")}
            className="border text-xs p-3 w-full mb-2 rounded focus:outline-none bg-white focus:ring-2 focus:ring-black"
          >
            <option value="">Select industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Other">Other</option>
          </select>
          <p className="text-xs text-textPrimary opacity-70 mb-8">
            Select Your organization's Industry (optional).
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Company Size</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            {companySize.map((size) => (
              <label
                key={size.value}
                className={`box-border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${selectedCompanySize === size.value ? "bg-gray-100" : size.bgColor
                  } ${selectedCompanySize === size.value
                    ? "border-textPrimary border-[1px]"
                    : "border-[1px] border-transparent"
                  }`}
                onClick={() => setValue("companySize", size.value)}
              >
                <input
                  type="radio"
                  value={size.value}
                  {...register("companySize", {
                    required: "Company size is required",
                  })}
                  className="hidden"
                />
                {size?.icon(selectedCompanySize === size.value)}
                <span className="text-sm font-medium">{size.label}</span>
                <span className="text-xs text-gray-500">
                  {size.employees} employees
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-textPrimary opacity-70 mb-8">
            Select the Size of your organization (optional).
          </p>
        </div>

        <Button
          type="submit"
          text={`${loading ? "Creating ..." : "Continue to Add Employees"}`}
          icon={loading && <CircularLoading />}
          iconRight={!loading && <FaArrowRight />}
          disabled={loading}
          className={`${loading ? "opacity-50" : ""} hover:scale-105`}
        />
        <p className="text-xs text-textPrimary opacity-70 mb-4 text-center">
          By Creating an organization, you agree to our Terms and Service and Privacy Policy.
        </p>
      </form>
    </div>
  );
};

export default CreateYourOrganization;
