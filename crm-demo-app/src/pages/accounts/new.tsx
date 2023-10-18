import PageTitle from "@/components/page-title";
import {
  RedirectCheckType,
  checkPossibleRedirect,
  getServerSideAuthUserDetails,
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
  FormErrorMessage,
  Button,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import { config } from "@/lib/config/config";
import { Countries } from "@/lib/static/countries";
import startCase from "lodash.startcase";
import { TAccountZOD } from "@/lib/types/account";
import { newAccountSchema } from "@/lib/schemas/newAccount";
import { AccountStatus, Currencies, Sources } from "@/lib/types/account";
import { routes } from "@/lib/routes";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/lib/types/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const AddNewAcount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TAccountZOD>({ resolver: zodResolver(newAccountSchema) });
  const router = useRouter();
  const toast = useToast();
  const supabase = useSupabaseClient<Database>();

  const onSubmit: SubmitHandler<TAccountZOD> = async (newAccountData) => {
    const { data, error } = await supabase
      .from("accounts")
      .insert([
        {
          name: newAccountData.accountName,
          is_active: newAccountData.isActive,
          status: newAccountData.status,
          source: newAccountData.source,
          currency: newAccountData.currency,
          website: newAccountData.website,
          revenue: newAccountData.revenue,
          address_line: newAccountData.addressLine,
          country: newAccountData.country,
          city: newAccountData.city,
          state: newAccountData.state,
          zip: newAccountData.zip,
        },
      ])
      .select();

    if (error) {
      toast({
        title: "Failed to save account",
        description: error.message,
        status: "error",
        isClosable: true,
        position: "top",
        duration: 10000,
      });

      return;
    }

    toast({
      title: `Account added`,
      description: `${data[0].name} saved with success!`,
      status: "success",
      isClosable: true,
      position: "top",
      duration: 10000,
    });

    router.push(routes.accounts.index);
  };

  return (
    <>
      <Head>
        <title>{`${config.appName} - New account`}</title>
      </Head>
      <chakra.form mb={6} h={"full"} onSubmit={handleSubmit(onSubmit)}>
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
            isLoading={isSubmitting}
            loadingText="Saving..."
            onClick={handleSubmit(onSubmit)}
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
                isDisabled={isSubmitting}
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
              <Switch
                id="is-active"
                {...register("isActive")}
                isDisabled={isSubmitting}
              />
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
                  <Radio
                    value={AccountStatus.NEW}
                    {...register("status")}
                    isDisabled={isSubmitting}
                  >
                    {startCase(AccountStatus.NEW)}
                  </Radio>
                  <Radio
                    value={AccountStatus.PENDING}
                    {...register("status")}
                    isDisabled={isSubmitting}
                  >
                    {startCase(AccountStatus.PENDING)}
                  </Radio>
                  <Radio
                    value={AccountStatus.CLOSED}
                    {...register("status")}
                    isDisabled={isSubmitting}
                  >
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
                isDisabled={isSubmitting}
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
                isDisabled={isSubmitting}
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
                  isDisabled={isSubmitting}
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
                  isDisabled={isSubmitting}
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
                isDisabled={isSubmitting}
              />
            </FormControl>
          </VStack>
          <VStack spacing={6} h={"full"}>
            <FormControl isRequired isInvalid={Boolean(errors.country)}>
              <FormLabel>Country</FormLabel>
              <Select
                borderColor={"blackAlpha.500"}
                backgroundColor={"white"}
                _focusVisible={{
                  borderColor: "blackAlpha.900",
                }}
                _hover={{ borderColor: "blackAlpha.500" }}
                {...register("country")}
                isDisabled={isSubmitting}
              >
                <option></option>
                {Countries.map((country) => (
                  <option value={country.code} key={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </Select>
              {errors.country && (
                <FormErrorMessage>
                  {errors.country.message!.toString()}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(errors.city)}>
              <FormLabel>City</FormLabel>
              <Input
                placeholder="City"
                variant={"black"}
                errorBorderColor={"red.300"}
                type="text"
                {...register("city")}
                isDisabled={isSubmitting}
              />
              {errors.city && (
                <FormErrorMessage>
                  {errors.city.message!.toString()}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>State</FormLabel>
              <Input
                placeholder="State"
                variant={"black"}
                errorBorderColor={"red.300"}
                type="text"
                {...register("state")}
                isDisabled={isSubmitting}
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
                isDisabled={isSubmitting}
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
  const supabase = createServerSupabaseClient<Database>(ctx);
  const redirectPage = await checkPossibleRedirect(
    supabase,
    RedirectCheckType.Main
  );

  if (redirectPage) {
    return {
      redirect: {
        destination: redirectPage,
        permanent: false,
      },
    };
  }

  const { userEmail } = await getServerSideAuthUserDetails(supabase);

  return {
    props: { userEmail },
  };
};

export default AddNewAcount;
