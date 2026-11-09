/**
 * Password rule shared by signup, reset, set-password and change-password,
 * on both client and server: at least 8 characters with a letter and a number.
 */
export const PASSWORD_HINT = "At least 8 characters, including a letter and a number.";

export function passwordProblem(password: unknown): string | null {
  if (typeof password !== "string" || password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > 200) return "Password is too long.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Password must include at least one letter and one number.";
  return null;
}
