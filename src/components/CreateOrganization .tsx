import { useState } from "react";
import { GoOrganization } from "react-icons/go";
import CreateYourOrganization from "../ui/CreateOrganization/CreateYourOrganization";
import AddTeamMembers from "../ui/CreateOrganization/AddTeamMembers";
import { LuUserPlus } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";

type OrgData = {
    name: string;
    logo: File | null;
    logoPreview: string | null;
    industry: string;
    size: string;
};

interface OrganizationFormData {
    organizationName: string;
    industry?: string;
    companySize: string;
}

export default function CreateOrganization() {
    const totalSetps = 2;
    const [formData, setFormData] = useState<OrganizationFormData | null>(null)
    const [steps, setSteps] = useState<number>(1);
    const [orgData, setOrgData] = useState<OrgData>({
        name: "",
        logo: null,
        logoPreview: null,
        industry: "",
        size: "",
    });

    const nextStep = () => setSteps((prev) => prev + 1);
    const previouseStep = () => setSteps((next) => next - 1);
    console.log("form data", formData)

    const handleFileUpload = (files: File[]) => {
        if (files.length === 0) return;

        const file = files[0];
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

        if (!allowedTypes.includes(file.type)) {
            alert("Only PNG, JPG, and JPEG files are allowed.");
            return;
        }

        if (orgData.logoPreview) {
            URL.revokeObjectURL(orgData.logoPreview);
        }

        setOrgData((prev) => ({
            ...prev,
            logo: file,
            logoPreview: URL.createObjectURL(file),
        }));
    };


    return (
        <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-100`}>
            <div className={`flex flex-col items-center justify-center h-full bg-gray-100 px-1 ${steps === 2 ? "w-[90%] md:w-[70%] lg:w-[60%]" : ""}`}>
                <div className="w-full px-2 my-8">
                    <div className="flex justify-between">
                        <span className="text-sm font-bold opacity-70 mb-4 text-center">
                            Step {steps} of {totalSetps}
                        </span>
                        <span className="text-sm text-textPrimary opacity-70 mb-4 text-center">
                            Organization Setup
                        </span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 rounded-full`}
                            style={{
                                width: `${(steps / totalSetps) * 100}%`,
                                backgroundColor: "#000",
                                boxShadow: steps === 1 ? "0px 0px 10px rgba(79, 70, 229, 0.5)" : "0px 0px 20px rgba(79, 70, 229, 1)"
                            }}
                        />
                    </div>
                    {
                        steps === 2 && (<div className="mt-8 flex justify-between p-1">
                            <div>
                                <div className="flex items-center gap-1 text-gray-600 text-sm cursor-pointer" onClick={() => previouseStep()}>
                                    <span><FaArrowRight className="rotate-180" /></span>Back to Organization
                                </div>
                            </div>
                            <div className="text-textPrimary text-sm cursor-pointer">
                                Skip for now
                            </div>
                        </div>)
                    }
                </div>
                <div className={`bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full`}>

                    {steps === 1 && (
                        <>
                            <div className="mb-4 w-full h-full overflow-y-auto">
                                <div className="flex items-center gap-2 mb-1 ">
                                    <GoOrganization className="text-xl" />
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Create Your organization
                                    </h2>
                                </div>
                                <span className="text-xs text-textPrimary opacity-70 mb-4 text-center">
                                    Enter your organization details to get started with Time Tracker
                                </span>
                            </div>
                            <CreateYourOrganization formData={formData} setFormData={setFormData} nextStep={nextStep} />
                        </>
                    )}

                    {steps === 2 && (
                        <div>
                            <div className="mb-4 h-full overflow-auto w-full">
                                <div className="flex items-center gap-2 mb-1 ">
                                    <LuUserPlus className="text-xl" />
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Add team members
                                    </h2>
                                </div>
                                <span className="text-xs text-textPrimary opacity-70 mb-4 text-center">
                                    Invite your colleagues to join your organization
                                </span>
                            </div>
                            <AddTeamMembers />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
