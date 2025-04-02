// Constants for auth pages

export const titles: Record<string, string> = {
  LOGIN_PAGE_TITLE: "Login",
  LOGIN_PAGE_SUBTITLE: "Enter your credentials to access your account",
  REGISTER_PAGE_TITLE: "Create an Account",
  REGISTER_PAGE_SUBTITLE: "Choose how you'd like to",
  REGISTER_PAGE_SUBTITLE_SIGN_UP: "sign up",
  SET_PASSWORD_TITLE: "Set your password",
  SET_PASSWORD_SUBTITLE: "Choose a secure password for your account",
  VERIFY_CODE_TITLE: "Enter Verification Code",
  VERIFY_CODE_SUBTITLE: "We've sent a 6-digit code to ",
  FORGOT_PASSWORD_TITLE: "Forgot your password?",
  FORGOT_PASSWORD_SUBTITLE: "No worries, we'll send you reset instructions",
  CHECK_EMAIL_TITLE: "Please check your email",
  CHECK_EMAIL_SUBTITLE: "We sent you a verification link. Please check your email to verify your account.",
  RESET_PASSWORD_TITLE: "Reset New Password",
  RESET_PASSWORD_SUBTITLE: "Enter your new password below.",
};


export const buttons: Record<string, string> = {
  GOOGLE: "Google",
  CONTINUE_EMAIL: "Continue with Email",
  SIGNUP_LINK_TEXT: "Sign up",
  FORGOT_PASSWORD_LINK_TEXT: "Forgot password?",
  CREATE_ACCOUNT: "Create Account",
  VERIFY_CODE: "Verify Code",
  RESEND_CODE: "Resend Code",
  RESET_PASSWORD: "Reset Password",
  LOGIN_TEXT: "Login",

};


export const labels: Record<string, string> = {
  EMAIL: "Email",
  PASSWORD: "Password",
};

export const messages: Record<string, string> = {
  DIVIDER_TEXT: "OR CONTINUE WITH",
  EDIT_EMAIL_MESSAGE: "Go back to edit your email",
  NO_ACCOUNT_TEXT: "Didn't have an account? ",
  LOADING_TEXT: "Logging in",
  CREATING_ACCOUNT_TEXT: "Creating Account",
  VERIFYING_CODE_TEXT: "Verifying",
  RESENDING_CODE_TEXT: "Resending",
  NOT_RECEIVE_CODE_TEXT: "Didn't receive the code? ",
  BACK_TO_LOGIN_TEXT: "Back to Login",
  RESEND_EMAIL_BUTTON_TEXT: "Resend Email",
  RETURN_TO_SIGNIN_TEXT: "Return to Sign in",
};

export const errors: Record<string, string> = {
  INVALID_EMAIL: "Please enter a valid email address.",
  EMPTY_PASSWORD: "Please enter your password.",
  PASSWORD_LENGTH: "Password must be at least 8 characters.",
  PASSWORD_UPPERCASE: "Must include an uppercase letter.",
  PASSWORD_NUMBER: "Must include a number.",
  PASSWORD_SPECIAL_CHAR: "Must include a special character.",
  PASSWORDS_MISMATCH: "Passwords do not match.",
  EMPTY_CODE: "Please fill in all the fields.",
  REQUIRED_EMAIL: "Please enter your email",
  REQUIRED_PASSWORD: "Please enter your password",
  INVALID_PASSWORD: "Password is incorrect.",
};

export const toasts: Record<string, string> = {
  LOGIN_SUCCESS: "User login successfully",
  USER_NOT_FOUND: "User not found",
  SERVER_ERROR: "Server error",
  USER_VERIFIED: "User verified successfully",
  REGISTER_SUCCESS: "User registered successfully",
  USER_EXISTS: "User already exists",
  USER_ALREADY_VERIFIED: "User already verified",
  CODE_SENT: "Verification code sent successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successfully.",
  PASSWORD_RESET_FAILED: "Failed to reset password.",
  RESET_LINK_SENT: "Reset link sent to your email.",
};

// Regular expression
export const regex = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*\W)(?=.*\d).{8,}$/,
};

export const placeholders: Record<string, string> = {
  EMAIL: "name@example.com",
  PASSWORD: "Password",
  CONFIRM_PASSWORD: "Confirm Password",
  NEW_PASSWORD: "New Password",
};