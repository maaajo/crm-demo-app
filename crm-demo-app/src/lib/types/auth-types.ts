export const AuthTypes = {
  Login: "login",
  Register: "register",
  Forgot: "forgot",
} as const;

export type TAuthKeys = {
  type: (typeof AuthTypes)[keyof typeof AuthTypes];
};
