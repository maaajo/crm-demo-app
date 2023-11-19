export default function getBearerTokenFromHeader(
  authHeader: string | undefined
) {
  if (!authHeader) {
    return "";
  }

  const authHeaderCleaned = authHeader.trim();

  if (!authHeaderCleaned) {
    return "";
  }

  const authHeaderSplit = authHeaderCleaned.split(" ");

  if (authHeaderSplit.length !== 2) {
    return "";
  }

  if (authHeaderSplit[0].toLowerCase() !== "bearer") {
    return "";
  }

  return authHeaderSplit[1].trim();
}
