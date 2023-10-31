export const AuthTypes = {
  Login: "login",
  Register: "register",
  Forgot: "forgot",
  Change: "change",
  Password_Reset_Error: "password_reset_error",
} as const;

export type TAuthKeys = (typeof AuthTypes)[keyof typeof AuthTypes];
