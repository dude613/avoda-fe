"use client"
import type React from "react"
import { type Dispatch, type SetStateAction, useEffect, useState, useTransition } from "react"
import { useForm, Controller } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "@/components/ui/button"
import Email from "../form/email"
import { UpdateProfile, UploadUserPicture } from "@/service/api"
import { Toaster, toast } from "react-hot-toast"
import { getUserProfile } from "@/redux/slice/UserProfile"
import type { AppDispatch, RootState } from "@/redux/Store"
import { X, Upload, Save, User, Shield } from "lucide-react"
import { userProfileContent } from "@/constants/UserProfile";

interface ProfileFormData {
    name: string
    email: string
    role: string
}

interface ProfilePageProps {
    setShowProfile: Dispatch<SetStateAction<boolean>>
}

const ProfilePage: React.FC<ProfilePageProps> = ({ setShowProfile }) => {
    const {
        PROFILE_HEADING, PROFILE_HEADING_TEXT, UPLOAD_PHOTO_TEXT, FULL_NAME_LABEL,
        FULL_NAME_PLACEHOLDER, ROLE_LABEL, SELECT_ROLE, SELECT_USER_VALUE, SELECT_ADMIN_VALUE,
        SELECT_EMPLOYEE_VALUE, SELECT_MANAGER_VALUE, LOADING_BUTTON_TEXT, BUTTON_TEXT, CANCEL_BUTTON_TEXT,
        REQUIRED_NAME, INVALID_NAME, EMAIL_REQUIRED, VALID_EMAIL, INVALID_IMAGE, FAILED_UPLOAD_ERROR,
        SERVER_ERROR, SOMETHING_SERVER_ERROR, FAILED_UPLOAD_PROFILE, SUCCESS_IMAGE_UPLOAD, PROFILE_UPDATE_SUCCESS
    } = userProfileContent;
    const dispatch = useDispatch<AppDispatch>()
    const userId = localStorage.getItem("userId")
    const { userProfile } = useSelector((state: RootState) => state.userProfile)
    const [, startTransition] = useTransition()
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isDirty },
    } = useForm<ProfileFormData>({
        defaultValues: { name: "", email: "", role: "" },
    });

    
    const [image, setImage] = useState<string | React.ReactNode>(null)
    const [imageError, setImageError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (userId) {
            startTransition(() => {
                void dispatch(getUserProfile(userId))
            })
        }
    }, [userId, dispatch, startTransition])

    const profileData = userProfile?.data

    useEffect(() => {
        if (profileData) {
            setValue("name", profileData.userName)
            setValue("email", profileData.email)
            setValue("role", profileData.role)
            setImage(
                profileData.picture || (
                    <div className="flex items-center justify-center w-full h-full bg-gray-300 text-white text-xl rounded-full">
                        {profileData.userName?.[0]?.toUpperCase() || ""}
                    </div>
                ),
            )
        }
    }, [profileData, setValue])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const validTypes = ["image/jpeg", "image/png", "image/gif"]
        if (!validTypes.includes(file.type)) {
            setImageError(INVALID_IMAGE)
            return
        }
        setImageError(null)
        const reader = new FileReader()
        reader.onloadend = () => {
            if (reader.result) setImage(reader.result as string)
        }
        reader.readAsDataURL(file)
        try {
            const formData = new FormData()
            formData.append("images", file)
            formData.append("userId", userId || "")
            const response = await UploadUserPicture(formData)
            if (response?.success) {
                toast.success(SUCCESS_IMAGE_UPLOAD, { duration: 2000 })
            } else {
                toast.error(response?.error || SERVER_ERROR, { duration: 2000 })
            }
            e.target.value = ""
        } catch (error) {
            console.error("Error uploading image:", error)
            toast.error(SOMETHING_SERVER_ERROR, { duration: 2000 })
        }
    }

    const onSubmit = async (data: ProfileFormData) => {
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            Object.entries({ ...data, userId: userId || "" }).forEach(([key, value]) => {
                formData.append(key, value)
            })

            const updateResponse = await UpdateProfile(formData)
            if (updateResponse?.success) {
                toast.success(updateResponse?.message || PROFILE_UPDATE_SUCCESS, { duration: 2000 })
                void dispatch(getUserProfile(userId || ""))
                await new Promise((resolve) => setTimeout(resolve, 2200))
                startTransition(() => setShowProfile(false))
            } else {
                toast.error(updateResponse?.error || FAILED_UPLOAD_ERROR, { duration: 2000 })
            }
        } catch (error) {
            console.error("Error updating profile", error)
            toast.error(FAILED_UPLOAD_PROFILE, { duration: 2000 })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!profileData) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-pulse flex flex-col items-center p-8">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        )
    }

    return (
        <>
            <Toaster position="top-center" />
            <div className="max-h-full overflow-y-auto">
                <div className="max-w-3xl mx-auto p-6 bg-white">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b">
                        <div>
                            <h2 className="text-2xl font-bold">{PROFILE_HEADING}</h2>
                            <p className="text-sm mt-1">{PROFILE_HEADING_TEXT}</p>
                        </div>
                        <button
                            className="hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() => setShowProfile(false)}
                            aria-label="Close profile"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex justify-center mb-8 relative">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border border-border shadow-md group">
                            {/* {typeof image === "string" ? (
                                <img
                                    src={image || "/placeholder.svg"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null
                                        e.currentTarget.src = "/placeholder.svg"
                                    }}
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-primary-foreground text-primary text-xl rounded-full">
                                    {profileData.userName?.[0]?.toUpperCase() || "A"}
                                </div>
                            )} */}
                            <label className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 cursor-pointer">
                                <div className="opacity-0 group-hover:opacity-100 text-primary flex flex-col items-center transition-opacity">
                                    <Upload className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-medium">{UPLOAD_PHOTO_TEXT}</span>
                                </div>
                                <Input
                                    type="file"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/gif"
                                />
                            </label>
                        </div>
                        {imageError && <p className="absolute -bottom-6 text-destructive text-sm">{imageError}</p>}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {FULL_NAME_LABEL}
                                </Label>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{
                                        required: REQUIRED_NAME,
                                        pattern: {
                                            value: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
                                            message: INVALID_NAME,
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder={FULL_NAME_PLACEHOLDER}
                                        />
                                    )}
                                />
                                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-0">
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: EMAIL_REQUIRED,
                                        pattern: {
                                            value: /^[^@]+@[^@]+\.[A-Za-z]{2,}$/,
                                            message: VALID_EMAIL,
                                        },
                                    }}
                                    render={({ field }) => <Email {...field} disabled error={errors.email?.message?.toString()} />}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
                                <Shield className="w-4 h-4 text-gray-500" />
                                {ROLE_LABEL}
                            </Label>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        id="role"
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="">{SELECT_ROLE}</option>
                                        <option value="user">{SELECT_USER_VALUE}</option>
                                        <option value="admin">{SELECT_ADMIN_VALUE}</option>
                                        <option value="employee">{SELECT_EMPLOYEE_VALUE}</option>
                                        <option value="manager">{SELECT_MANAGER_VALUE}</option>
                                    </select>
                                )}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                disabled={isSubmitting || !isDirty}
                            ><Save className="w-4 h-4" />{isSubmitting ? LOADING_BUTTON_TEXT : BUTTON_TEXT}</Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowProfile(false)}
                            >{CANCEL_BUTTON_TEXT}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ProfilePage

