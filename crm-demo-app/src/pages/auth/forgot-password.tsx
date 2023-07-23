import { Box, Text } from "@chakra-ui/react";
import AuthHeader from "@/components/auth-header";

const ForgotPassword = () => {
  return (
    <Box
      width={"full"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
    >
      <AuthHeader type="forgot" />
    </Box>
  );
};

export default ForgotPassword;
