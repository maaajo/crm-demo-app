export const AuthTypes = {
  Login: "login",
  Register: "register",
  Forgot: "forgot",
  Change: "change",
} as const;

export type TAuthKeys = {
  type: (typeof AuthTypes)[keyof typeof AuthTypes];
};
