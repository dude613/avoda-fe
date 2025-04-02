// Constants for src/pages/Login/index.tsx

export const titles = {
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


export const buttons = {
  GOOGLE_BUTTON_TEXT: "Google",
  EMAIL_BUTTON_TEXT: "Continue with Email",
  SIGNUP_BUTTON_TEXT: "Sign up",
  FORGOT_PASSWORD_BUTTON_TEXT: "Forgot password?",
  CREATE_ACCOUNT_BUTTON_TEXT: "Create Account",
  VERIFY_CODE_BUTTON_TEXT: "Verify Code",
  RESEND_CODE_BUTTON_TEXT: "Resend Code",
  RESET_PASSWORD_BUTTON_TEXT: "Reset Password",
  SIGN_IN_BUTTON_TEXT: "Sign in",
  RESEND_EMAIL_BUTTON_TEXT:"Resend email"
};


export const labels = {
  EMAIL_LABEL: "Email",
  PASSWORD_LABEL: "Password",
};

export const messages = {
  DIVIDER_TEXT: "OR CONTINUE WITH",
  EDIT_EMAIL_MESSAGE: "Go back to edit your email",
  NO_ACCOUNT_TEXT: "Don't have an account? ",
  LOADING_TEXT: "Logging in",
  CREATING_ACCOUNT_TEXT: "Creating Account",
  VERIFYING_CODE_TEXT: "Verifying",
  RESENDING_CODE_TEXT: "Resending",
  RESEND_CODE_TEXT:"Resend code",
  CODE_NOT_RECEIVED_TEXT: "Didn't receive the code? ",
  BACK_TO_LOGIN_TEXT: "Back to Login",
  EXISTING_ACCOUNT_TEXT: "Already have an account? ",
};

export const errors = {
  INVALID_EMAIL_ERROR: "Please enter a valid email address.",
  EMPTY_PASSWORD_ERROR: "Please enter your password.",
  PASSWORD_LENGTH_ERROR: "Password must be at least 8 characters.",
  PASSWORD_UPPERCASE_ERROR: "Must include an uppercase letter.",
  PASSWORD_NUMBER_ERROR: "Must include a number.",
  PASSWORD_SPECIAL_CHAR_ERROR: "Must include a special character.",
  PASSWORDS_MISMATCH_ERROR: "Passwords do not match.",
  EMPTY_CODE_ERROR: "Please fill in all the fields.",
  REQUIRED_EMAIL_ERROR: "Please enter your email",
  REQUIRED_PASSWORD_ERROR: "Please enter your password",
  INVALID_PASSWORD_ERROR: "Password must be at least 8 characters, with 1 uppercase letter and 1 special character.",
  NO_EMAIL_EXIST: "No email exists",
  PASSWORD_REQUIRED_ERROR: "Password is required"
};

export const toasts = {
  LOGIN_SUCCESS_TOAST: "User login successfully",
  USER_NOT_FOUND_TOAST: "User not found",
  SERVER_ERROR_TOAST: "Server error",
  USER_VERIFIED_TOAST: "User verified successfully",
  REGISTER_SUCCESS_TOAST: "User registered successfully",
  USER_EXISTS_TOAST: "User already exists",
  USER_ALREADY_VERIFIED_TOAST: "User already verified",
  CODE_SENT_TOAST: "Verification code sent successfully",
  PASSWORD_RESET_SUCCESS_TOAST: "Password reset successfully.",
  PASSWORD_RESET_FAILED_TOAST: "Failed to reset password.",
  RESET_LINK_SENT_TOAST: "Reset link sent to your email.",
  PASSWORD_RESET_SUCCESS: "Password reset successfully.",
  PASSWORD_RESET_FAILED: "Failed to reset password.",
  INVALID_EMAIL_TOAST: "Invalid email",
};

// Regular expression
export const regex = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*\W)(?=.*\d).{8,}$/,
};

export const placeholders = {
  EMAIL_PLACEHOLDER: "name@example.com",
  PASSWORD_PLACEHOLDER: "Password",
  CONFIRM_PASSWORD_PLACEHOLDER: "Confirm Password",
  NEW_PASSWORD_PLACEHOLDER: "New Password"
};