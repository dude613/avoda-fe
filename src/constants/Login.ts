// Constants for src/pages/Login/index.tsx

// Page titles and headings
export const LOGIN_PAGE_TITLE = "Login";
export const LOGIN_PAGE_SUBTITLE = "Enter your credentials to access your account";

// Button and link text
export const GOOGLE_BUTTON_TEXT = "Google";
export const EMAIL_BUTTON_TEXT = "Continue with Email";
export const SIGNUP_LINK_TEXT = "Sign up";
export const FORGOT_PASSWORD_LINK_TEXT = "Forgot password?";

// Form labels and placeholders
export const EMAIL_LABEL = "Email";
export const EMAIL_PLACEHOLDER = "you@example.com";
export const PASSWORD_LABEL = "Password";
export const PASSWORD_PLACEHOLDER = "Password";
export const CONFIRM_PASSWORD_PLACEHOLDER = "Confirm Password";
export const PASSWORDS_MISMATCH_ERROR = "Passwords do not match.";
// Divider text
export const DIVIDER_TEXT = "OR CONTINUE WITH";

// Account-related text
export const NO_ACCOUNT_TEXT = "Didn't have an account? ";

// Error and validation messages
export const REQUIRED_EMAIL_ERROR = "Please enter your email";
export const REQUIRED_PASSWORD_ERROR = "Please enter your password";
export const INVALID_PASSWORD_ERROR = "Password must be at least 8 characters, with 1 uppercase letter and 1 special character.";

export const INVALID_EMAIL_ERROR = "Please enter a valid email address.";

// Loading state text
export const LOADING_TEXT = "Logging in";

// Toast notifications
export const LOGIN_SUCCESS_TOAST = "User login successfully";
export const USER_NOT_FOUND_TOAST = "User not found";
export const SERVER_ERROR_TOAST = "Server error";


//........Regular expression...\\
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\W).{8,}$/;