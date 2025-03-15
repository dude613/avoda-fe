import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import FileUploader from "../ui/FileUploader";

type OrgData = {
    name: string;
    logo: File | null;
    logoPreview: string | null;
    industry: string;
    size: string;
};

export default function CreateOrganization() {
    const [step, setStep] = useState(1);
    const [orgData, setOrgData] = useState<OrgData>({
        name: "",
        logo: null,
        logoPreview: null,
        industry: "",
        size: "",
    });

    const handleInputChange = (field: keyof OrgData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrgData((prev) => ({ ...prev, [field]: e.target.value }));
    };

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

    const nextStep = () => {
        if ((step === 1 && !orgData.name) || (step === 2 && !orgData.logo) || (step === 3 && !orgData.industry)) {
            alert("All fields are required.");
            return;
        }
        setStep((prev) => prev + 1);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Create an Organization</h2>
                
                {step === 1 && (
                    <Input type="text" placeholder="Enter organization name" value={orgData.name} onChange={handleInputChange("name")} />
                )}
                
                {step === 2 && (
                    <div>
                        <FileUploader mode="multiple" allowedTypes={["image/png", "image/jpeg", "image/jpg"]} onUpload={handleFileUpload} />
                    </div>
                )}
                
                {step === 3 && (
                    <Input type="text" placeholder="Enter industry name" value={orgData.industry} onChange={handleInputChange("industry")} />
                )}
                
                {step === 4 && (
                    <Input type="text" placeholder="Enter company size" value={orgData.size} onChange={handleInputChange("size")} />
                )}

                <Button text={step === 4 ? "Submit" : "Next"} onClick={step === 4 ? () => console.log("Submitted", orgData) : nextStep} />
            </div>
        </div>
    );
}
