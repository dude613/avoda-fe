import { useEffect, useState } from "react";
import { GoOrganization } from "react-icons/go";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FaArrowRight } from "react-icons/fa";
import { FiUser, FiUsers } from "react-icons/fi";
import { LuBuilding } from "react-icons/lu";
import Input from "../ui/Input";
import Button from "../ui/Button";
import CircularLoading from "./CircularLoading";
import { CreateOrganizationAPI } from "../service/api";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface OrganizationFormData {
    organizationName: string;
    industry?: string;
    companySize: string;
}

export default function CreateOrganization() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<OrganizationFormData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const companySize = [
        {
            label: "Startup",
            value: "startup (1-10 employees)",
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
            value: "small (11-50 employees)",
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
            value: "medium (51-200 employees)",
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
            value: "large (201-500 employees)",
            employees: "201-500",
            icon: (isSelected: boolean) => (
                <LuBuilding
                    className={`text-4xl p-[3px] mb-1 rounded-full transition ${isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}
                />
            ),
            bgColor: "bg-orange-50",
        },
    ];

    const { register, handleSubmit, setValue, watch, control, formState: { errors }, trigger } = useForm<OrganizationFormData>({
        defaultValues: formData || {
            organizationName: "",
            industry: "",
            companySize: "Startup",
        },
    });

    const selectedCompanySize = watch("companySize");

    const onSubmit: SubmitHandler<OrganizationFormData> = async (data) => {
        setLoading(true);
        try {
            const res = await CreateOrganizationAPI(data);
            if (res.success === true) {
                toast.success(res?.message || "Organization created successfully!", { duration: 2000 });
                setFormData(null);
                // setTimeout(() => {
                navigate("/add-employee")
                // }, 500)
            } else {
                toast.error(res?.error || "Server error please try again!" , { duration: 2000 });
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

    const handleCompanySizeChange = (size: string) => {
        setValue("companySize", size);
        trigger("companySize");
    };

    return (
        <>
            <Toaster />
            <div className={`flex flex-col items-center justify-center min-h-screen min-w-fit bg-gray-100 p-4`}>
                <div className={`flex flex-col items-center justify-center bg-gray-100 px-1`}>
                    <div className={`bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full`}>
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Step 1 of 2</span>
                                <span className="text-sm text-gray-500 font-semibold">Add Employees</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-black h-2 rounded-full w-1/2" />
                            </div>
                        </div>
                        <div className="mb-4 w-full h-full overflow-y-auto">
                            <div className="flex items-center gap-2 mb-1 ">
                                <GoOrganization className="text-xl" />
                                <h2 className="text-xl font-bold text-gray-800">
                                    Create Your Organization
                                </h2>
                            </div>
                            <span className="text-xs text-textPrimary opacity-70 mb-4 text-center">
                                Enter your organization details to get started with Time Tracker
                            </span>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="mb-8">
                                <label className="block text-sm font-medium mb-2">
                                    Organization Name
                                    <span className="text-red-500">*</span>
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
                                                className={` text-sm min-w-8 border ${errors.organizationName ? 'border-red-500' : 'border-gray-300'}`}
                                                error={errors.organizationName?.message}
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
                                    {...register("industry", { required: "Industry is required!" })}
                                    className={`border text-sm p-3 w-full mb-2 rounded focus:outline-none bg-white ${errors.industry ? "border-red-500" : "border-gray-300"}`}
                                >
                                    <option value="">Select industry</option>
                                    <option value="technology">Technology</option>
                                    <option value="healthCare">Healthcare</option>
                                    <option value="finance">Finance</option>
                                    <option value="education">Education</option>
                                    <option value="retail">Retail</option>
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.industry && <p className="text-red-500 text-xs">{errors.industry.message}</p>}
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
                                            onClick={() => handleCompanySizeChange(size.value)}
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
                                {errors.companySize && <p className="text-red-500 text-xs">{errors.companySize.message}</p>}
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
                                className={`bg-background text-sm text-text font-bold py-3 w-full rounded hover:bg-gray-900 transition cursor-pointer flex items-center justify-center ${loading ? "opacity-50" : ""} hover:scale-105`}
                            />

                            <p className="text-xs text-textPrimary opacity-70 mb-4 text-center">
                                By Creating an organization, you agree to our Terms and Service and Privacy Policy.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
