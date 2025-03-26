// Constants for src/pages/Register/index.tsx and related files

// Page titles and headings
export const REGISTER_PAGE_TITLE = "Create an account";
export const REGISTER_PAGE_SUBTITLE = "Choose how you'd like to";
export const REGISTER_PAGE_SUBTITLE_SIGN_UP = "sign up"
export const SET_PASSWORD_TITLE = "Set your password";
export const SET_PASSWORD_SUBTITLE = "Choose a secure password for your account";
export const VERIFY_CODE_TITLE = "Enter Verification Code";
export const VERIFY_CODE_SUBTITLE = "We've sent a 6-digit code to ";

// Button and link text
export const GOOGLE_BUTTON_TEXT = "Continue with Google";
export const EMAIL_BUTTON_TEXT = "Continue with Email";
export const CREATE_ACCOUNT_BUTTON_TEXT = "Create Account";
export const CREATING_ACCOUNT_TEXT = "Creating Account";
export const VERIFY_CODE_BUTTON_TEXT = "Verify Code";
export const VERIFYING_CODE_TEXT = "Verifying";
export const RESEND_CODE_TEXT = "Resend Code";
export const RESENDING_CODE_TEXT = "Resending";

// Form placeholders
export const EMAIL_PLACEHOLDER = "name@example.com";
export const PASSWORD_PLACEHOLDER = "Password";
export const CONFIRM_PASSWORD_PLACEHOLDER = "Confirm Password";

// Divider text
export const DIVIDER_TEXT = "OR CONTINUE WITH";

// Error and validation messages
export const INVALID_EMAIL_ERROR = "Please enter a valid email address.";
export const EDIT_EMAIL_MESSAGE = "Go back to edit your email";
export const EMPTY_PASSWORD_ERROR = "Please enter your password.";
export const PASSWORD_LENGTH_ERROR = "Password must be at least 8 characters.";
export const PASSWORD_UPPERCASE_ERROR = "Must include an uppercase letter.";
export const PASSWORD_NUMBER_ERROR = "Must include a number.";
export const PASSWORD_SPECIAL_CHAR_ERROR = "Must include a special character.";
export const PASSWORDS_MISMATCH_ERROR = "Passwords do not match.";
export const EMPTY_CODE_ERROR = "Please fill in all the fields.";

// Toast notifications
export const REGISTER_SUCCESS_TOAST = "User registered successfully";
export const USER_EXISTS_TOAST = "User already exists";
export const SERVER_ERROR_TOAST = "Server error";
export const USER_VERIFIED_TOAST = "User verified successfully";
export const USER_ALREADY_VERIFIED_TOAST = "User already verified";
export const CODE_SENT_TOAST = "Verification code sent successfully";

// Other text
export const NOT_RECEIVE_CODE_TEXT = "Didn't receive the code? ";

// Password strength meter
export const PASSWORD_VERY_WEAK = "Very Weak";
export const PASSWORD_WEAK = "Weak";
export const PASSWORD_MEDIUM = "Medium";
export const PASSWORD_STRONG = "Strong";
export const PASSWORD_VERY_STRONG = "Very Strong";
export const PASSWORD_STRENGTH_TEXT = "Password Strength:";


//.............Email Regular expression..............\\

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/