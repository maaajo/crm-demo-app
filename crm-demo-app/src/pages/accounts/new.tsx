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
  FormLabel,
  Input,
  Select,
  Switch,
  RadioGroup,
  Stack,
  Radio,
  InputGroup,
  InputLeftAddon,
  Textarea,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import Head from "next/head";
import { config } from "@/lib/config/config";
import { countries } from "@/lib/static/countries";
import * as z from "zod";
import startCase from "lodash.startcase";

const AccountStatus = {
  NEW: "new",
  PENDING: "pending",
  CLOSED: "closed",
} as const;

const Currencies = ["USD", "EUR", "GBP", "Other"] as const;
const Sources = ["Company Website", "LinkedIn", "Referral", "Other"] as const;

const zodSchema = z.object({
  accountName: z.string().min(2, { message: "Account Name has to be filled" }),
  isActive: z.boolean({
    required_error: "Active is required",
  }),
  status: z.nativeEnum(AccountStatus, {
    required_error: "Status has to be filled",
  }),
  source: z.enum(Sources),
  currency: z.enum(Currencies),
  website: z.string().url().optional().or(z.literal("")),
  revenue: z.union([z.number(), z.nan()]).optional(),
  addressLine: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
});

type Schema = z.infer<typeof zodSchema>;

const AddNewAcount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({ resolver: zodResolver(zodSchema) });

  console.log(errors);

  return (
    <>
      <Head>
        <title>{`${config.appName} - New account`}</title>
      </Head>
      <chakra.form
        mb={6}
        h={"full"}
        onSubmit={handleSubmit((d) => console.log(d))}
      >
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
            bgColor={"black"}
            color={"white"}
            _hover={{
              bgColor: "blackAlpha.800",
            }}
            onClick={handleSubmit((d) => console.log(d))}
          >
            Save
          </Button>
        </Box>
        <SimpleGrid columns={2} h={"full"} gap={20}>
          <VStack spacing={6} h={"full"}>
            <FormControl isRequired isInvalid={Boolean(errors.accountName)}>
              <FormLabel>Account Name</FormLabel>
              <Input
                placeholder="Account Name"
                variant={"black"}
                errorBorderColor={"red.300"}
                type="text"
                {...register("accountName")}
              />
              {errors.accountName && (
                <FormErrorMessage>
                  {errors.accountName.message!.toString()}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              display={"flex"}
              alignItems={"center"}
              isRequired
              isInvalid={Boolean(errors.isActive)}
            >
              <FormLabel mb={"0"} htmlFor="is-active">
                Is active?
              </FormLabel>
              <Switch id="is-active" {...register("isActive")} />
              {errors.isActive && (
                <FormErrorMessage>
                  {errors.isActive.message!.toString()}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              display={"flex"}
              alignItems={"center"}
              isRequired
              isInvalid={Boolean(errors.status)}
            >
              <FormLabel mb={"0"}>Status</FormLabel>
              <RadioGroup defaultValue="new">
                <Stack spacing={5} direction={"row"}>
                  <Radio value={AccountStatus.NEW} {...register("status")}>
                    {startCase(AccountStatus.NEW)}
                  </Radio>
                  <Radio value={AccountStatus.PENDING} {...register("status")}>
                    {startCase(AccountStatus.PENDING)}
                  </Radio>
                  <Radio value={AccountStatus.CLOSED} {...register("status")}>
                    {startCase(AccountStatus.CLOSED)}
                  </Radio>
                </Stack>
              </RadioGroup>
              {errors.status && (
                <FormErrorMessage>
                  {errors.status.message!.toString()}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(errors.source)}>
              <FormLabel>Source</FormLabel>
              <Select
                borderColor={"blackAlpha.500"}
                backgroundColor={"white"}
                _focusVisible={{
                  borderColor: "blackAlpha.900",
                }}
                _hover={{ borderColor: "blackAlpha.500" }}
                {...register("source")}
              >
                <option></option>
                {Sources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </Select>
              {errors.source && (
                <FormErrorMessage>
                  {errors.source.message!.toString()}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(errors.currency)}>
              <FormLabel>Currency</FormLabel>
              <Select
                borderColor={"blackAlpha.500"}
                backgroundColor={"white"}
                _focusVisible={{
                  borderColor: "blackAlpha.900",
                }}
                _hover={{ borderColor: "blackAlpha.500" }}
                {...register("currency")}
              >
                <option></option>
                {Currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </Select>
              {errors.currency && (
                <FormErrorMessage>
                  {errors.currency.message!.toString()}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={Boolean(errors.website)}>
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
                  {...register("website")}
                />
              </InputGroup>
              {errors.website && (
                <FormErrorMessage>
                  {errors.website.message!.toString()}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={Boolean(errors.revenue)}>
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
                  {...register("revenue", { valueAsNumber: true })}
                />
              </InputGroup>
              {errors.revenue && (
                <FormErrorMessage>
                  {errors.revenue.message!.toString()}
                </FormErrorMessage>
              )}
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
                {...register("addressLine")}
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
                {...register("country")}
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
                {...register("city")}
              />
            </FormControl>
            <FormControl>
              <FormLabel>State</FormLabel>
              <Input
                placeholder="State"
                variant={"black"}
                errorBorderColor={"red.300"}
                type="text"
                {...register("state")}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Zip</FormLabel>
              <Input
                placeholder="Zip"
                variant={"black"}
                errorBorderColor={"red.300"}
                type="text"
                {...register("zip")}
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
