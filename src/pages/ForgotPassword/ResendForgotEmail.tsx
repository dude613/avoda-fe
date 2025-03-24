import { useEffect, useState } from "react";
import { LuPlane } from "react-icons/lu";
import { Toaster, toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import Card from "@/ui/Card";
import { CHECK_EMAIL_TITLE, CHECK_EMAIL_SUBTITLE, RESEND_EMAIL_BUTTON_TEXT } from "@/constants/ForgotPassword";
import Button from "@/ui/Button";


const baseUrl = import.meta.env.VITE_BACKEND_URL;

export default function ResendForgotEmail() {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState("");

    useEffect(() => {
        const emailParam = searchParams.get("email");
        if (emailParam) {
            const decodedEmail = decodeURIComponent(emailParam);
            setEmail(decodedEmail);
            const newUrl = `/forgot-resend?email=${decodedEmail}`;
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
                toast.success(data?.message || "Password reset successfully.");
            } else {
                toast.error(data.error || "Failed to reset password.");
            }
        } catch (error) {
            toast.error("Failed to reset password.");
        }
    }
    return (
        <>
            <Toaster />
            <Card>
                <div className="flex items-center justify-center">
                    <div className="bg-gray-200 rounded-full w-16 h-14 flex items-center justify-center">
                        <LuPlane className="text-4xl" />
                    </div>
                </div>

                <h2 className="mt-8 text-2xl font-bold text-gray-800 ">
                    {CHECK_EMAIL_TITLE}
                </h2>

                <p className="text-gray-600 text-sm mt-4">
                    {CHECK_EMAIL_SUBTITLE}
                </p>
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-primary text-sm text-white font-bold py-3 mt-2 w-full rounded hover:bg-gray-900 transition cursor-pointer flex items-center justify-center"
                    text={RESEND_EMAIL_BUTTON_TEXT}
                />
            </Card>
        </>
    );
}
