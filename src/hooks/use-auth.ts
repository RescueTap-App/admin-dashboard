import { useLoginMutation, useSendOtpMutation, useResetPasswordMutation, useVerifyOtpMutation } from "@/redux/features/auth-api";
import { setCredentials } from "@/redux/slices/auth-slice";
import { LoginTypes, SendOtpTypes, ResetPasswordTypes, VerifyOtpTypes } from "@/types/auth.types";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export function useAuth() {

    const dispatch = useDispatch()
    const [loginMutation, { isLoading: logingIn }] = useLoginMutation();
    const [sendOtpMutation, { isLoading: sendingOtp }] = useSendOtpMutation();
    const [resetMutation, { isLoading: resetting }] = useResetPasswordMutation();
    const [verifyMutation, { isLoading: verifying }] = useVerifyOtpMutation()

    const login = async (crdentails: LoginTypes) => {
        try {
            const res = await loginMutation(crdentails).unwrap()
            dispatch(
                setCredentials({
                    token: res.access_token,
                    user: res.user,
                })
            );
            sessionStorage.setItem("token", res.access_token);
            sessionStorage.setItem("userId", res.user._id);
            sessionStorage.setItem("role", res.user.role);
            toast.success(res.messages || "Login successful")
            return res
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to Login"
            toast.error(errorMessage)
            console.log(error)
        }
    }

    const sendOtp = async (crdentails: SendOtpTypes) => {
        try {
            const res = await sendOtpMutation(crdentails).unwrap()
            toast.success(res.messages || "Otp sent successfully");
            console.log(res)
            return res
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to send otp"
            toast.error(errorMessage)
            console.log(error)
        }
    }

    const resetPassword = async (crdentails: ResetPasswordTypes) => {
        try {
            const res = await resetMutation(crdentails).unwrap()
            toast.success(res.messages || "Your have successfully reset your password")
            console.log(res)
            return res
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to reset password"
            toast.error(errorMessage)
            console.log(error)
        }
    }
    const verifyOtp = async (crdentails: VerifyOtpTypes) => {
        try {
            const res = await verifyMutation(crdentails).unwrap()
            toast.success(res.messages || "Otp code verified successfully");
            return res
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to verify otp"
            toast.error(errorMessage)
            console.log(error)
        }
    }

    const resendOtp = async () => {

    }

    return {
        login,
        logingIn,
        sendOtp,
        sendingOtp,
        verifyOtp,
        verifying,
        resetPassword,
        resetting,
        resendOtp
    }
}
