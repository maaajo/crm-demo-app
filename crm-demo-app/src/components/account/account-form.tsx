import PageTitle from "@/components/page-title";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
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
  HStack,
} from "@chakra-ui/react";
import { Countries } from "@/lib/static/countries";
import startCase from "lodash.startcase";
import { TAccountSupabase, TAccountZOD } from "@/lib/types/account";
import { newAccountSchema } from "@/lib/schemas/newAccount";
import { AccountStatus, Currencies, Sources } from "@/lib/types/account";
import { routes } from "@/lib/routes";
import { useRouter } from "next/router";
import {
  SupabaseClient,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { Database } from "@/lib/types/supabase";
import { generateFakeAccount } from "@/lib/utils";

type AccountFormPropsAdd = {
  actionType: "add";
};

type AccountFormPropsEdit = {
  actionType: "edit";
  account: TAccountSupabase;
  userId: string;
};

type AccountFormPropsView = {
  actionType: "view";
  account: TAccountSupabase;
};

type AccountFormProps =
  | AccountFormPropsAdd
  | AccountFormPropsEdit
  | AccountFormPropsView;

const addNewAccount = async (
  supabase: SupabaseClient<Database>,
  newAccountData: TAccountZOD
) => {
  const { data, error } = await supabase
    .from("accounts")
    .insert([newAccountData])
    .select();

  return { data, error };
};

const editAccount = async (
  supabase: SupabaseClient<Database>,
  newAccountData: TAccountZOD,
  userId: string,
  accountId: string
) => {
  const { data, error } = await supabase
    .from("accounts")
    .update({
      ...newAccountData,
      edited_at: new Date(Date.now()).toISOString(),
      edited_by: userId,
    })
    .eq("id", accountId)
    .select();

  return { data, error };
};

const getPageTitle = (action: AccountFormProps["actionType"]) => {
  switch (action) {
    case "add":
      return "Add new account";
    case "edit":
      return `Edit account`;
    case "view":
      return `View account`;
    default:
      return "";
  }
};

export default function AccountForm(props: AccountFormProps) {
  const actionType = props.actionType;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<TAccountZOD>({
    resolver: zodResolver(newAccountSchema),
    ...(actionType === "edit" || actionType === "view"
      ? { defaultValues: props.account }
      : {}),
  });

  const router = useRouter();
  const toast = useToast();
  const supabase = useSupabaseClient<Database>();
  const isView = actionType === "view";

  const onFakeDataClick = () => {
    const fakeData = generateFakeAccount();

    reset(fakeData);
  };

  const onSubmit: SubmitHandler<TAccountZOD> = async (newAccountData) => {
    if (actionType == "add") {
      const { data, error } = await addNewAccount(supabase, newAccountData);

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

      if (data) {
        toast({
          title: `Account added`,
          description: `${data[0].name} saved with success!`,
          status: "success",
          isClosable: true,
          position: "top",
          duration: 10000,
        });
      }
    }

    if (actionType === "edit") {
      const { data, error } = await editAccount(
        supabase,
        newAccountData,
        props.userId,
        props.account.id
      );

      if (error) {
        toast({
          title: "Failed to edit account",
          description: error.message,
          status: "error",
          isClosable: true,
          position: "top",
          duration: 10000,
        });

        return;
      }

      if (data) {
        toast({
          title: `Account updated`,
          description: `${data[0].name} updated with success!`,
          status: "success",
          isClosable: true,
          position: "top",
          duration: 10000,
        });
      }
    }

    router.push(routes.accounts.index);
  };

  return (
    <chakra.form mb={6} h={"full"} onSubmit={handleSubmit(onSubmit)}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <PageTitle title={getPageTitle(actionType)} />
        {!isView ? (
          <HStack alignItems={"center"} spacing={4}>
            <Button
              type={"button"}
              variant={"outline"}
              colorScheme={"blackAlpha"}
              color={"blackAlpha.900"}
              onClick={onFakeDataClick}
            >
              Fill with fake data
            </Button>
            <Button
              px={10}
              type="submit"
              variant={"blackSolid"}
              isLoading={isSubmitting}
              loadingText={actionType === "add" ? "Saving..." : "Updating..."}
              onClick={handleSubmit(onSubmit)}
            >
              {actionType === "add" ? "Save" : "Update"}
            </Button>
          </HStack>
        ) : null}
      </Box>
      <SimpleGrid columns={2} h={"full"} gap={20}>
        <VStack spacing={6} h={"full"}>
          <FormControl isRequired isInvalid={Boolean(errors.name)}>
            <FormLabel>Account Name</FormLabel>
            <Input
              placeholder="Account Name"
              variant={"black"}
              errorBorderColor={"red.300"}
              type="text"
              isDisabled={isSubmitting || isView}
              {...register("name")}
            />
            {errors.name && (
              <FormErrorMessage>
                {errors.name.message!.toString()}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            display={"flex"}
            alignItems={"center"}
            isRequired
            isInvalid={Boolean(errors.is_active)}
          >
            <FormLabel mb={"0"} htmlFor="is-active">
              Is active?
            </FormLabel>
            <Controller
              control={control}
              name="is_active"
              render={({ field: { onChange, value, ref } }) => (
                <Switch
                  isChecked={value}
                  onChange={onChange}
                  ref={ref}
                  isDisabled={isSubmitting || isView}
                />
              )}
            />

            {errors.is_active && (
              <FormErrorMessage>
                {errors.is_active.message!.toString()}
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
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value, ref } }) => (
                <RadioGroup value={value} ref={ref}>
                  <Stack spacing={5} direction={"row"}>
                    <Radio
                      value={AccountStatus.NEW}
                      isDisabled={isSubmitting || isView}
                      onChange={onChange}
                    >
                      {startCase(AccountStatus.NEW)}
                    </Radio>
                    <Radio
                      value={AccountStatus.PENDING}
                      isDisabled={isSubmitting || isView}
                      onChange={onChange}
                    >
                      {startCase(AccountStatus.PENDING)}
                    </Radio>
                    <Radio
                      value={AccountStatus.CLOSED}
                      isDisabled={isSubmitting || isView}
                      onChange={onChange}
                    >
                      {startCase(AccountStatus.CLOSED)}
                    </Radio>
                  </Stack>
                </RadioGroup>
              )}
            />

            {errors.status && (
              <FormErrorMessage>
                {errors.status.message!.toString()}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired isInvalid={Boolean(errors.source)}>
            <FormLabel>Source</FormLabel>
            <Select
              variant={"primary"}
              isDisabled={isSubmitting || isView}
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
              variant={"primary"}
              isDisabled={isSubmitting || isView}
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
                isDisabled={isSubmitting || isView}
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
                isDisabled={isSubmitting || isView}
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
              {...register("address_line")}
              isDisabled={isSubmitting || isView}
            />
          </FormControl>
        </VStack>
        <VStack spacing={6} h={"full"}>
          <FormControl isRequired isInvalid={Boolean(errors.country)}>
            <FormLabel>Country</FormLabel>
            <Select
              variant={"primary"}
              {...register("country")}
              isDisabled={isSubmitting || isView}
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
              isDisabled={isSubmitting || isView}
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
              isDisabled={isSubmitting || isView}
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
              isDisabled={isSubmitting || isView}
            />
          </FormControl>
        </VStack>
      </SimpleGrid>
    </chakra.form>
  );
}
