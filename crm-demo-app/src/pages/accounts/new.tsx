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
  Switch,
  RadioGroup,
  Stack,
  Radio,
  InputGroup,
  InputLeftElement,
  InputLeftAddon,
  Textarea,
  Button,
} from "@chakra-ui/react";
import Head from "next/head";
import { config } from "@/lib/config/config";
import { countries } from "@/lib/static/countries";
import * as z from "zod";

const AccountStatus = {
  NEW: "New",
  PENDING: "Pending",
  CLOSED: "Closed",
} as const;

const Currency = {};

const zodAuthSchema = z.object({
  accountName: z.string().min(2, { message: "Account Name has to be filled" }),
  isActive: z.boolean({
    required_error: "Active is required",
  }),
  status: z.nativeEnum(AccountStatus),
});

const AddNewAcount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <>
      <Head>
        <title>{`${config.appName} - New account`}</title>
      </Head>
      <chakra.form mb={6} h={"full"}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <PageTitle title="Add new account" />
          <Button
            px={10}
            mt={6}
            type="submit"
            variant={"solid"}
            colorScheme={"blue"}
          >
            Save
          </Button>
        </Box>
        <SimpleGrid columns={2} h={"full"} gap={20}>
          <VStack spacing={6} h={"full"}>
            <FormControl isRequired>
              <FormLabel>Account Name</FormLabel>
              <Input
                placeholder="Account Name"
                variant={"black"}
                errorBorderColor={"red.300"}
                type="text"
              />
            </FormControl>
            <FormControl display={"flex"} alignItems={"center"} isRequired>
              <FormLabel mb={"0"} htmlFor="is-active">
                Is active?
              </FormLabel>
              <Switch id="is-active" />
            </FormControl>
            <FormControl display={"flex"} alignItems={"center"} isRequired>
              <FormLabel mb={"0"}>Status</FormLabel>
              <RadioGroup defaultValue="new">
                <Stack spacing={5} direction={"row"}>
                  <Radio value={AccountStatus.NEW.toLowerCase()}>
                    {AccountStatus.NEW}
                  </Radio>
                  <Radio value={AccountStatus.PENDING.toLowerCase()}>
                    {AccountStatus.PENDING}
                  </Radio>
                  <Radio value={AccountStatus.CLOSED.toLowerCase()}>
                    {AccountStatus.CLOSED}
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Source</FormLabel>
              <Select
                borderColor={"blackAlpha.500"}
                backgroundColor={"white"}
                _focusVisible={{
                  borderColor: "blackAlpha.900",
                }}
                _hover={{ borderColor: "blackAlpha.500" }}
              >
                <option></option>
                <option value="website">Company Website</option>
                <option value="linkedin">LinkedIn</option>
                <option value="referral">Referral</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Currency</FormLabel>
              <Select
                borderColor={"blackAlpha.500"}
                backgroundColor={"white"}
                _focusVisible={{
                  borderColor: "blackAlpha.900",
                }}
                _hover={{ borderColor: "blackAlpha.500" }}
              >
                <option></option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Website</FormLabel>
              <InputGroup>
                <InputLeftAddon
                  pointerEvents="none"
                  borderColor={"blackAlpha.500"}
                >
                  URL
                </InputLeftAddon>
                <Input
                  placeholder="Website"
                  variant={"black"}
                  errorBorderColor={"red.300"}
                  type="text"
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Revenue</FormLabel>
              <InputGroup>
                <InputLeftAddon
                  pointerEvents="none"
                  borderColor={"blackAlpha.500"}
                >
                  $
                </InputLeftAddon>
                <Input
                  placeholder="Revenue"
                  variant={"black"}
                  errorBorderColor={"red.300"}
                  type="number"
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Address Line</FormLabel>
              <Textarea
                placeholder="Address Line"
                backgroundColor={"white"}
                borderColor={"blackAlpha.500"}
                _focusVisible={{
                  borderColor: "blackAlpha.900",
                }}
                _hover={{ borderColor: "blackAlpha.500" }}
                resize={"none"}
              />
            </FormControl>
          </VStack>
          <VStack spacing={6} h={"full"}>
            <FormControl>
              <FormLabel>Country</FormLabel>
              <Select
                borderColor={"blackAlpha.500"}
                backgroundColor={"white"}
                _focusVisible={{
                  borderColor: "blackAlpha.900",
                }}
                _hover={{ borderColor: "blackAlpha.500" }}
              >
                <option></option>
                {countries.map((country) => (
                  <option value={country.code} key={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>City</FormLabel>
              <Input
                placeholder="City"
                variant={"black"}
                errorBorderColor={"red.300"}
                type="text"
              />
            </FormControl>
            <FormControl>
              <FormLabel>State</FormLabel>
              <Input
                placeholder="State"
                variant={"black"}
                errorBorderColor={"red.300"}
                type="text"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Zip</FormLabel>
              <Input
                placeholder="Zip"
                variant={"black"}
                errorBorderColor={"red.300"}
                type="text"
              />
            </FormControl>
          </VStack>
        </SimpleGrid>
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
