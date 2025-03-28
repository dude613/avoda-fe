import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {Button} from "@/components/ui/button";
import { UserProfile } from "@/type";
import Email from "../form/email";
import { UpdateProfile } from "@/service/api";
import { Toaster, toast } from "react-hot-toast";

interface ProfileFormData {
    name: string;
    email: string;
    role: string;
}

interface ProfilePageProps {
    userProfile: UserProfile | null;
    setShowProfile: Dispatch<SetStateAction<boolean>>;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, setShowProfile }) => {
    const profileData = userProfile?.data;
    const userId = localStorage.getItem("userId")
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>({
        defaultValues: {
            name: profileData?.userName || '',
            email: profileData?.email || '',
            role: profileData?.verified === "true" ? "admin" : "user",
        }
    });

    const [image, setImage] = useState(profileData?.picture || "/path/to/default-profile.png");

    useEffect(() => {
        if (profileData) {
            console.log('UserProfile:', profileData);

            setValue("name", profileData.userName);
            setValue("email", profileData.email);
            setValue("role", profileData.verified === "true" ? "admin" : "user");
        }
    }, [profileData, setValue]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setImage(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("role", data.role);
            formData.append("userId", userId || "");
            const updateResponse = await UpdateProfile(formData);
            console.log(updateResponse)
            if (updateResponse?.success === true) {
                toast.success(updateResponse?.message || "User profile updated successfully", { duration: 2000 });
                await new Promise((resolve) => setTimeout(resolve, 2200));
                setShowProfile(false)
            } else {
                toast.error(updateResponse?.error || "Something went wrong", { duration: 2000 });
            }
        } catch (error) {
            console.error("Error updating profile", error);
        }
    };

    if (!profileData) {
        return <div>Loading...</div>;
    }


    return (
        <>
            <Toaster />
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-start">User Information</h2>
                        <p className="text-gray-600 text-sm">View and edit user details. Click save when you're done.</p>
                    </div>
                    <Button
                        className="text-gray-600 text-lg cursor-pointer"
                        onClick={() => setShowProfile(false)}
                    >
                        X
                    </Button>
                </div>

                <div className="flex justify-center items-center mb-6">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden">
                        <img
                            src={image}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                        <label className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm py-1 text-center cursor-pointer">
                            Upload
                            <Input
                                type="file"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="mb-4">
                        <Label htmlFor="name">Name</Label>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Name is required" }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="text"
                                    id="name"
                                />
                            )}
                        />
                        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                    </div>

                    <div className="mb-4">
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Please enter a valid email address"
                                }
                            }}
                            render={({ field }) => (
                                <Email
                                    {...field}
                                    error={errors.email?.message?.toString()}
                                />
                            )}
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="role">Role</Label>
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <select {...field} id="role" className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs">
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            )}
                        />
                    </div>

                    <div className="flex justify-center">
                        <Button
                            type="submit"
                        >{"Save Profile"}</Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProfilePage;
