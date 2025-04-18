"use client";
import type React from "react";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "@/components/ui/button";
import Email from "../form/email";
import { LogoutAPI, UpdateProfile, UploadUserPicture } from "@/service/api";
import { Toaster, toast } from "react-hot-toast";
import { getUserProfile } from "@/redux/slice/UserProfile";
import type { AppDispatch, RootState } from "@/redux/Store";
import { Upload, Save, User, Shield } from "lucide-react";
import { userProfileContent } from "@/constants/UserProfile";
import { useNavigate } from "react-router-dom";
import * as constants from "@/constants/Auth";

interface ProfileFormData {
  name: string;
  email: string;
  role: string;
}

interface ProfilePageProps {
  setShowProfile: Dispatch<SetStateAction<boolean>>;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ setShowProfile }) => {
  const {
    PROFILE_HEADING,
    PROFILE_HEADING_TEXT,
    UPLOAD_PHOTO_TEXT,
    FULL_NAME_LABEL,
    FULL_NAME_PLACEHOLDER,
    ROLE_LABEL,
    SELECT_ROLE,
    SELECT_USER_VALUE,
    SELECT_ADMIN_VALUE,
    SELECT_EMPLOYEE_VALUE,
    SELECT_MANAGER_VALUE,
    LOADING_BUTTON_TEXT,
    BUTTON_TEXT,
    CANCEL_BUTTON_TEXT,
    REQUIRED_NAME,
    INVALID_NAME,
    EMAIL_REQUIRED,
    VALID_EMAIL,
    INVALID_IMAGE,
    FAILED_UPLOAD_ERROR,
    SERVER_ERROR,
    SOMETHING_SERVER_ERROR,
    FAILED_UPLOAD_PROFILE,
    SUCCESS_IMAGE_UPLOAD,
    PROFILE_UPDATE_SUCCESS,
    LOGOUT,
  } = userProfileContent;

  const {
    toasts: { USER_LOGOUT_SUCCESS, SERVER_ERROR_TOAST },
  } = constants;
  const dispatch = useDispatch<AppDispatch>();
  const userId = localStorage.getItem("userId");
  const { userProfile } = useSelector((state: RootState) => state.userProfile);
  const [, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: { name: "", email: "", role: "" },
  });

  const [image, setImage] = useState<string | React.ReactNode>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [isLogout, setIsLogout] = useState(false);
  useEffect(() => {
    if (userId) {
      startTransition(() => {
        void dispatch(getUserProfile(userId));
      });
    }
  }, [userId, dispatch, startTransition]);

  const profileData = userProfile?.data;
  useEffect(() => {
    if (profileData) {
      setValue("name", profileData.userName);
      setValue("email", profileData.email);
      setValue("role", profileData.role);
      setImage(
        profileData.picture || (
          <div className="flex items-center justify-center w-full h-full text-xl text-white bg-gray-300 rounded-full">
            {profileData.userName?.[0]?.toUpperCase() || ""}
          </div>
        )
      );
    }
  }, [profileData, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setImageError(INVALID_IMAGE);
      return;
    }
    setImageError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    try {
      const formData = new FormData();
      formData.append("images", file);
      formData.append("userId", userId || "");
      const response = await UploadUserPicture(formData);
      if (response?.success) {
        toast.success(SUCCESS_IMAGE_UPLOAD, { duration: 2000 });
      } else {
        toast.error(response?.error || SERVER_ERROR, { duration: 2000 });
      }
      e.target.value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(SOMETHING_SERVER_ERROR, { duration: 2000 });
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const updateResponse = await UpdateProfile({
        ...data,
        userId: userId || "",
      });
      if (updateResponse?.success) {
        toast.success(updateResponse?.message || PROFILE_UPDATE_SUCCESS, {
          duration: 2000,
        });
        void dispatch(getUserProfile(userId || ""));
        await new Promise((resolve) => setTimeout(resolve, 2200));
        startTransition(() => setShowProfile(false));
      } else {
        toast.error(updateResponse?.error || FAILED_UPLOAD_ERROR, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error(FAILED_UPLOAD_PROFILE, { duration: 2000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center p-8 animate-pulse">
          <div className="w-24 h-24 mb-4 bg-gray-200 rounded-full"></div>
          <div className="w-3/4 h-4 mb-3 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    if (!userId) return;
    try {
      setIsLogout(true);
      const response = await LogoutAPI({ userId });
      if (response.success) {
        localStorage.removeItem("userId");
        localStorage.removeItem("accessToken");
        setShowProfile(false);
        toast.success(USER_LOGOUT_SUCCESS, { duration: 2000 });
        navigate("/login", { replace: true });
        setIsLogout(false);
      }
    } catch (error) {
      toast.error(SERVER_ERROR_TOAST);
      setIsLogout(false);
    } finally {
      setIsLogout(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="p:4 sm:p-6 w-full max-h-[90vh] overflow-y-auto">
        <div className="max-w-3xl p-6 mx-auto text-black bg-white">
          <div className="flex items-center justify-between pb-4 mb-6 border-b">
            <div className="text-black">
              <h2 className="text-2xl font-bold">{PROFILE_HEADING}</h2>
              <p className="mt-1 text-sm">{PROFILE_HEADING_TEXT}</p>
            </div>
            <Button
              className="w-20"
              variant="destructive"
              size="lg"
              onClick={handleLogout}
              disabled={isLogout}
            >
              {LOGOUT}
            </Button>
          </div>

          <div className="relative flex justify-center mb-8">
            <div className="relative w-32 h-32 overflow-hidden border rounded-full shadow-md border-border group">
              {typeof image === "string" ? (
                <img
                  src={image || ""}
                  alt="Profile"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xl rounded-full bg-primary-foreground text-primary">
                  {profileData.userName?.[0]?.toUpperCase() || "A"}
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center transition-all duration-200 bg-opacity-0 cursor-pointer group-hover:bg-opacity-50">
                <div className="flex flex-col items-center transition-opacity opacity-0 group-hover:opacity-100 text-primary">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">
                    {UPLOAD_PHOTO_TEXT}
                  </span>
                </div>
                <Input
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif"
                />
              </label>
            </div>
            {imageError && (
              <p className="absolute text-sm -bottom-6 text-destructive">
                {imageError}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-medium"
                >
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
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-0 mt-7">
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
                  render={({ field }) => (
                    <Email
                      {...field}
                      disabled
                      error={errors.email?.message?.toString()}
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="flex items-center gap-2 text-sm font-medium"
              >
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
                    disabled={profileData.role !== "admin"} // Disable for non-admin users
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{SELECT_ROLE}</option>
                    <option value="user">{SELECT_USER_VALUE}</option>
                    <option value="admin">{SELECT_ADMIN_VALUE}</option>
                    <option value="employee">{SELECT_EMPLOYEE_VALUE}</option>
                    <option value="manager">{SELECT_MANAGER_VALUE}</option>
                  </select>
                )}
              />
              {profileData.role !== "admin" && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Only administrators can change roles.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button disabled={isSubmitting || !isDirty}>
                <Save className="w-4 h-4" />
                {isSubmitting ? LOADING_BUTTON_TEXT : BUTTON_TEXT}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowProfile(false)}
              >
                {CANCEL_BUTTON_TEXT}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
