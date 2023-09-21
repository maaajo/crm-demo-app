import PageTitle from "@/components/page-title";
import {
  RedirectCheckType,
  checkPossibleRedirect,
  getServerSideAuthUserEmail,
} from "@/lib/auth/methods";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  VStack,
  chakra,
  SimpleGrid,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";

const AddNewAcount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <>
      <PageTitle title="Add new account" />
      <chakra.form my={4} maxW={"50%"}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Account Name</FormLabel>
            <Input
              placeholder="Account Name"
              variant={"black"}
              errorBorderColor={"red.300"}
              type="text"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Source</FormLabel>
            <Select
              borderColor={"blackAlpha.500"}
              backgroundColor={"white"}
              _focusVisible={{
                borderColor: "blackAlpha.900",
              }}
              _hover={{ borderColor: "blackAlpha.900" }}
            >
              <chakra.option></chakra.option>
              <chakra.option value="website">Company Website</chakra.option>
              <chakra.option value="linkedin">LinkedIn</chakra.option>
              <chakra.option value="referral">Referral</chakra.option>
              <chakra.option value="other">Other</chakra.option>
            </Select>
          </FormControl>
        </VStack>
      </chakra.form>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  userEmail: string;
}> = async (ctx) => {
  const redirectPage = await checkPossibleRedirect(ctx, RedirectCheckType.Main);

  if (redirectPage) {
    return {
      redirect: {
        destination: redirectPage,
        permanent: false,
      },
    };
  }

  const userEmail = await getServerSideAuthUserEmail(ctx);

  return {
    props: { userEmail },
  };
};

export default AddNewAcount;
