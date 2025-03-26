// Constants for src/pages/Login/index.tsx

export const titles = {
  LOGIN_PAGE_TITLE: "Login",
  LOGIN_PAGE_SUBTITLE: "Enter your credentials to access your account",
  REGISTER_PAGE_TITLE: "Create an account",
  REGISTER_PAGE_SUBTITLE: "Choose how you'd like to",
  REGISTER_PAGE_SUBTITLE_SIGN_UP: "sign up",
  SET_PASSWORD_TITLE: "Set your password",
  SET_PASSWORD_SUBTITLE: "Choose a secure password for your account",
  VERIFY_CODE_TITLE: "Enter Verification Code",
  VERIFY_CODE_SUBTITLE: "We've sent a 6-digit code to ",
};


export const buttons = {
  GOOGLE_BUTTON_TEXT: "Google",
  EMAIL_BUTTON_TEXT: "Continue with Email",
  SIGNUP_LINK_TEXT: "Sign up",
  FORGOT_PASSWORD_LINK_TEXT: "Forgot password?",
  CREATE_ACCOUNT_BUTTON_TEXT: "Create Account",
  VERIFY_CODE_BUTTON_TEXT: "Verify Code",
  RESEND_CODE_TEXT: "Resend Code",
};


export const labels = {
  EMAIL_LABEL: "Email",
  EMAIL_PLACEHOLDER: "you@example.com",
  PASSWORD_LABEL: "Password",
  PASSWORD_PLACEHOLDER: "Password",
  CONFIRM_PASSWORD_PLACEHOLDER: "Confirm Password",
};

export const messages = {
  DIVIDER_TEXT: "OR CONTINUE WITH",
  EDIT_EMAIL_MESSAGE: "Go back to edit your email",
  NO_ACCOUNT_TEXT: "Didn't have an account? ",
  LOADING_TEXT: "Logging in",
  CREATING_ACCOUNT_TEXT: "Creating Account",
  VERIFYING_CODE_TEXT: "Verifying",
  RESENDING_CODE_TEXT: "Resending",
  NOT_RECEIVE_CODE_TEXT: "Didn't receive the code? ",
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
};

export const TOAST_MESSAGES = {
  LOGIN_SUCCESS_TOAST: "User login successfully",
  USER_NOT_FOUND_TOAST: "User not found",
  SERVER_ERROR_TOAST: "Server error",
  USER_VERIFIED_TOAST: "User verified successfully",
  REGISTER_SUCCESS_TOAST: "User registered successfully",
  USER_EXISTS_TOAST: "User already exists",
  USER_ALREADY_VERIFIED_TOAST: "User already verified",
  CODE_SENT_TOAST: "Verification code sent successfully",
};

// Regular expression
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\W)(?=.*\d).{8,}$/;

export const placeholders = {
  EMAIL_PLACEHOLDER: "name@example.com",
  PASSWORD_PLACEHOLDER: "Password",
  CONFIRM_PASSWORD_PLACEHOLDER: "Confirm Password",
};
