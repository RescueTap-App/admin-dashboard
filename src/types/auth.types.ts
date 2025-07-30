
export type LoginTypes = {
    email: string;
    password: string
}

export type SendOtpTypes = {
    phoneNumber: string;
}

export type ResetPasswordTypes = {
    newPassword: string;
    userId: string;
    otp: string;
}

export type VerifyOtpTypes = {
    otp: string
}
