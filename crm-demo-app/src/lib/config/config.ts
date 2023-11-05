export const config = {
  appName: "CRM Playground",
  style: {
    sidebar: {
      width: 64,
      backgroundColor: "blackAlpha.900",
    },
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
