import { useEffect, useState } from "react";
import { LuPlane } from "react-icons/lu";
import { Toaster, toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import {Card} from "@/components/ui";
import { titles, buttons} from "@/constants/Auth";
import {Button} from "@/components/ui/button";

export default function ResendForgotEmail() {
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
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
                    {titles.CHECK_EMAIL_TITLE}
                </h2>

                <p className="text-gray-600 text-sm mt-4">
                    {titles.CHECK_EMAIL_SUBTITLE}
                </p>
                <Button
                    type="submit"
                    onClick={handleSubmit}
                >{buttons.RESEND_EMAIL_BUTTON_TEXT}</Button>
            </Card>
        </>
    );
}
