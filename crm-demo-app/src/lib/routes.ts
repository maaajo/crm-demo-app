export const mainPages = {
  auth: "auth",
  accounts: "accounts",
  home: "home",
};

export const routes = {
  home: "/",
  accounts: {
    index: `/${mainPages.accounts}`,
    new: `/${mainPages.accounts}/new`,
    edit: `/${mainPages.accounts}/edit`,
    details: `/${mainPages.accounts}/details`,
  },
  auth: {
    signIn: `/${mainPages.auth}/sign-in`,
    signOut: `/${mainPages.auth}/sign-out`,
    forgot: `/${mainPages.auth}/forgot-password`,
    signUp: `/${mainPages.auth}/sign-up`,
    passwordRecovery: `/${mainPages.auth}/change-password`,
    provider: `/${mainPages.auth}/provider`,
  },
};
