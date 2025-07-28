
export type LoginTypes = {
    email: string;
    password: string
}

export type SendOtpTypes = {
    phoneNumber: string;
}

export type ResetPasswordTypes = {
    newPassword: string
    confirmPassword: string
}

export type VerifyOtpTypes = {
    otpCode: string
}
