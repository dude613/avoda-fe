import { useEffect, useState } from "react";
import { GoOrganization } from "react-icons/go";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FaArrowRight } from "react-icons/fa";
import { FiUser, FiUsers } from "react-icons/fi";
import { LuBuilding } from "react-icons/lu";
import Button from "../ui/Button";
import CircularLoading from "./CircularLoading";
import { CreateOrganizationAPI } from "../service/api";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { organizationContent } from "@/constants/CreateOrganization";

interface OrganizationFormData {
    organizationName: string;
    industry?: string;
    companySize: string;
}

export default function CreateOrganization() {

    const {
        ORGANIZATION_TITLE, ORGANIZATION_ADD_EMPLOYEE_TEXT, ORGANIZATION_CREATE_ORGANIZATION,
        ORGANIZATION_TEXT, ORGANIZATION_NAME, ORGANIZATION_PLACEHOLDER, ORGANIZATION_BODY_TEXT,
        ORGANIZATION_INDUSTRY, ORGANIZATION_SELECT_INDUSTRY, ORGANIZATION_SELECT_TECHNOLOGY, ORGANIZATION_SELECT_HEALTHCARE,
        ORGANIZATION_SELECT_FINANCE, ORGANIZATION_SELECT_EDUCATION, ORGANIZATION_SELECT_RETAIL, ORGANIZATION_SELECT_MANUFACTURING,
        ORGANIZATION_SELECT_OTHER, ORGANIZATION_COMPANY_SIZE_TEXT, ORGANIZATION_FOOTER_TEXT,
        ORGANIZATION_REQUIRED, ORGANIZATION_SELECT_ERROR, ORGANIZATION_COMPANY_REQUIRED, ORGANIZATION_COMPANY_SIZE_EMPLOYEE_TEXT
        , ORGANIZATION_BUTTON_TEXT, ORGANIZATION_BUTTON_LOADING_TEXT
    } = organizationContent;

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
                setFormData(null);
                toast.success(res?.message || "Organization created successfully!", { duration: 2000 });
                setTimeout(() => {
                    navigate("/add-employee");
                }, 2100);
            } else {
                toast.error(res?.response?.data?.error || "Server error please try again!", { duration: 2000 });
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
            <div className="flex items-center justify-center min-h-screen px-4 mt-10 bg-card">
                <div className="border border-gray-300 rounded-lg shadow-lg p-8 w-full max-w-xl">
                    <div className={`border border-border rounded-lg p-8`}>
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">{ORGANIZATION_TITLE}</span>
                                <span className="text-sm text-gray-500 font-semibold">{ORGANIZATION_ADD_EMPLOYEE_TEXT}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full w-1/2" />
                            </div>
                        </div>
                        <div className="mb-4 w-full h-full overflow-y-auto">
                            <div className="flex items-center gap-2 mb-1 ">
                                <GoOrganization className="text-xl" />
                                <h2 className="text-xl font-bold">
                                    {ORGANIZATION_CREATE_ORGANIZATION}
                                </h2>
                            </div>
                            <span className="text-xs text-textPrimary opacity-70 mb-4 text-center">
                                {ORGANIZATION_TEXT}
                            </span>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="mb-8">
                                <label className="block text-sm font-medium mb-2">
                                    {ORGANIZATION_NAME}
                                    <span className="text-destructive">*</span>
                                </label>
                                <div className="relative">
                                    <Controller
                                        name="organizationName"
                                        control={control}
                                        rules={{
                                            required: ORGANIZATION_REQUIRED,
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                placeholder={ORGANIZATION_PLACEHOLDER}
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.organizationName && <span className="text-destructive text-xs">{errors.organizationName?.message}</span>}
                                </div>
                                <p className="text-xs text-textPrimary opacity-70 mb-4 mt-2">
                                    {ORGANIZATION_BODY_TEXT}
                                </p>
                            </div>

                            <div className="mt-8">
                                <label className="block text-sm font-medium mb-2">{ORGANIZATION_INDUSTRY}</label>
                                <select
                                    {...register("industry", { required: "Industry is required!" })}
                                    className={`border-input file:text-foreground placeholder:text-muted-foreground/70 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none mb-2 ${errors.industry ? "border-red-500" : "border-gray-300"}`}
                                >
                                    <option value="">{ORGANIZATION_SELECT_INDUSTRY}</option>
                                    <option value="technology">{ORGANIZATION_SELECT_TECHNOLOGY}</option>
                                    <option value="healthCare">{ORGANIZATION_SELECT_HEALTHCARE}</option>
                                    <option value="finance">{ORGANIZATION_SELECT_FINANCE}</option>
                                    <option value="education">{ORGANIZATION_SELECT_EDUCATION}</option>
                                    <option value="retail">{ORGANIZATION_SELECT_RETAIL}</option>
                                    <option value="manufacturing">{ORGANIZATION_SELECT_MANUFACTURING}</option>
                                    <option value="other">{ORGANIZATION_SELECT_OTHER}</option>
                                </select>
                                {errors.industry && <p className="text-destructive text-xs">{errors.industry.message}</p>}
                                <p className="text-xs text-textPrimary opacity-70 mb-8">
                                    {ORGANIZATION_SELECT_ERROR}
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">{ORGANIZATION_COMPANY_SIZE_TEXT}</label>
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
                                                    required: ORGANIZATION_COMPANY_REQUIRED,
                                                })}
                                                className="hidden"
                                            />
                                            {size?.icon(selectedCompanySize === size.value)}
                                            <span className="text-sm font-medium">{size.label}</span>
                                            <span className="text-xs text-gray-500 text-center">
                                                {size.employees} {ORGANIZATION_COMPANY_SIZE_EMPLOYEE_TEXT}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.companySize && <p className="text-destructive text-xs">{errors.companySize.message}</p>}
                                <p className="text-xs text-textPrimary opacity-70 mb-8">
                                    {ORGANIZATION_SELECT_ERROR}
                                </p>
                            </div>

                            <Button
                                type="submit"
                                text={`${loading ? ORGANIZATION_BUTTON_LOADING_TEXT : ORGANIZATION_BUTTON_TEXT}`}
                                icon={loading && <CircularLoading />}
                                iconRight={!loading && <FaArrowRight />}
                                disabled={loading}
                                className={`bg-primary text-sm text-white font-bold py-3 w-full rounded hover:bg-gray-900 transition cursor-pointer flex items-center justify-center ${loading ? "opacity-50" : ""} hover:scale-105`}
                            />
                            <p className="text-xs text-textPrimary opacity-70 mb-4 text-center">
                                {ORGANIZATION_FOOTER_TEXT}
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
