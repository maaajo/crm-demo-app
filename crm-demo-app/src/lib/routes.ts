const authMainPath = "auth";

export const routes = {
  auth: {
    signIn: `/${authMainPath}/sign-in`,
    signOut: `/${authMainPath}/sign-out`,
    forgot: `/${authMainPath}/forgot-password`,
    signUp: `/${authMainPath}/sign-up`,
    passwordRecovery: `/${authMainPath}/change-password`,
    provider: `/${authMainPath}/provider`,
  },
};
