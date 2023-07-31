const authKeyword = "auth";

export const routes = {
  auth: {
    signIn: `/${authKeyword}/sign-in`,
    signOut: `/${authKeyword}/sign-out`,
    forgot: `/${authKeyword}/forgot-password`,
    signUp: `/${authKeyword}/sign-up`,
    passwordRecovery: `/${authKeyword}/change-password`,
  },
};
