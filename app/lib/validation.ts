const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export const AUTH_RULES = {
  minPasswordLength: 6,
  maxEmailLength: 254,
  maxFullnameLength: 120,
} as const;

export type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

function hasErrors(errors: Record<string, string>) {
  return Object.keys(errors).length === 0;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateLoginInput(
  email: string,
  password: string,
): ValidationResult {
  const errors: Record<string, string> = {};
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(normalizedEmail)) {
    errors.email = "Enter a valid email address";
  } else if (normalizedEmail.length > AUTH_RULES.maxEmailLength) {
    errors.email = "Email is too long";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < AUTH_RULES.minPasswordLength) {
    errors.password = `Password must be at least ${AUTH_RULES.minPasswordLength} characters`;
  }

  return { valid: hasErrors(errors), errors };
}

export function validateInviteInput(
  email: string,
  fullname: string,
  roleId: string,
): ValidationResult {
  const errors: Record<string, string> = {};
  const normalizedEmail = normalizeEmail(email);
  const normalizedName = fullname.trim();

  if (!normalizedEmail) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(normalizedEmail)) {
    errors.email = "Enter a valid email address";
  }

  if (!normalizedName) {
    errors.fullname = "Full name is required";
  } else if (normalizedName.length > AUTH_RULES.maxFullnameLength) {
    errors.fullname = "Full name is too long";
  }

  if (!roleId.trim()) {
    errors.roleId = "Role is required";
  } else if (!OBJECT_ID_REGEX.test(roleId.trim())) {
    errors.roleId = "Select a valid role";
  }

  return { valid: hasErrors(errors), errors };
}
