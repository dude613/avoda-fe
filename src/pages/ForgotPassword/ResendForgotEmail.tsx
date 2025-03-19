import { useEffect, useState } from "react";
import { LuPlane } from "react-icons/lu";
import { Toaster, toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import * as Constants from "../../constants/ForgotPassword";

const baseUrl = import.meta.env.VITE_BACKEND_URL;


export default function ResendForgotEmail() {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState("");

    useEffect(() => {
        const emailParam = searchParams.get("email");
        if (emailParam) {
            const decodedEmail = decodeURIComponent(emailParam);
            setEmail(decodedEmail);
            const newUrl = `/forgot-resend?email=${encodeURIComponent(decodedEmail)}`;
            window.history.replaceState(null, "", newUrl);
        }
    }, [searchParams]);

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data?.message || Constants.PASSWORD_RESET_SUCCESS_TOAST);
            } else {
                toast.error(data.error || Constants.PASSWORD_RESET_FAILED_TOAST);
            }
        } catch (error) {
            toast.error(Constants.PASSWORD_RESET_FAILED_TOAST);
        }
    }
    return (
        <>
            <Toaster />
            <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
                <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-md text-center border border-gray-200">
                    <div className="flex items-center justify-center">
                        <div className="bg-gray-200 rounded-full w-16 h-14 flex items-center justify-center">
                            <LuPlane className="text-4xl" />
                        </div>
                    </div>

                    <h2 className="mt-8 text-2xl font-bold text-gray-800 ">
                        {Constants.CHECK_EMAIL_TITLE}
                    </h2>

                    <p className="text-gray-600 text-sm mt-4">
                        {Constants.CHECK_EMAIL_SUBTITLE}
                    </p>

                    <button className="mt-6 w-full border-2 border-gray-200 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition"
                        onClick={handleSubmit}>
                        {Constants.RESEND_EMAIL_BUTTON_TEXT}
                    </button>
                </div>
            </div>
        </>
    );
}
