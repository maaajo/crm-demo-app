export const config = {
  appName: "CRM Playground",
  style: {
    sidebarWidth: 64,
  },
  signUp: {
    loadingMessage: "Loading...",
  },
  server: {
    cookies: {
      userDetailsName: "bp-aud",
      userAvatarName: "bp-avatar",
    },
  },
  authCallbackQueryParam: "returnURL",
  tables: {
    account: "account",
    profile: "profile",
  },
};
