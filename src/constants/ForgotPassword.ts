// Constants for src/pages/ForgotPassword/* files

// Page titles and headings
export const FORGOT_PASSWORD_TITLE = "Forgot your password?";
export const FORGOT_PASSWORD_SUBTITLE = "No worries, we'll send you reset instructions";
export const CHECK_EMAIL_TITLE = "Please check your email";
export const CHECK_EMAIL_SUBTITLE = "We sent you a verification link. Please check your email to verify your account.";
export const RESET_PASSWORD_TITLE = "Reset New Password";
export const RESET_PASSWORD_SUBTITLE = "Enter your new password below.";
export const INVALID_PASSWORD_ERROR = "Password must be at least 8 characters, with 1 uppercase letter and 1 special character.";

// Button and link text
export const RESET_PASSWORD_BUTTON_TEXT = "Reset Password";
export const BACK_TO_LOGIN_TEXT = "Back to Login";
export const RESEND_EMAIL_BUTTON_TEXT = "Resend Email";
export const RETURN_TO_SIGNIN_TEXT = "Return to Sign in";

// Form placeholders
export const EMAIL_PLACEHOLDER = "name@example.com";
export const NEW_PASSWORD_PLACEHOLDER = "New Password";
export const CONFIRM_PASSWORD_PLACEHOLDER = "Confirm Password";

// Error and validation messages
export const INVALID_EMAIL_ERROR = "Please enter a valid email address.";
export const EMPTY_EMAIL_ERROR = "Please enter your email.";
export const PASSWORD_REQUIRED_ERROR = "Password is required.";
export const PASSWORD_VALIDATION_ERROR = "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.";
export const PASSWORDS_MISMATCH_ERROR = "Passwords do not match.";
// Toast messages
export const RESET_LINK_SENT_TOAST = "Reset link sent to your email.";
export const PASSWORD_RESET_SUCCESS_TOAST = "Password reset successfully.";
export const PASSWORD_RESET_FAILED_TOAST = "Failed to reset password.";


//.................Email Regular////////////////
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\W).{8,}$/;