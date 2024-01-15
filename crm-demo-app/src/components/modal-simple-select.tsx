import ModalBase from "./modal-base";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Select,
  chakra,
} from "@chakra-ui/react";

type ModalSimpleSelectProps = {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  title: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  selectName: string;
  selectFormLabelText: string;
  selectOptions: string[] | number[];
};

const ModalSimpleSelect = ({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
  selectName,
  selectFormLabelText,
  selectOptions,
  title,
}: ModalSimpleSelectProps) => {
  return (
    <ModalBase
      isOpen={isOpen}
      isSubmitting={isSubmitting}
      onClose={onClose}
      title={title}
    >
      <chakra.form onSubmit={onSubmit}>
        <FormControl mt={6} isDisabled={isSubmitting}>
          <FormLabel textAlign={"center"}>{selectFormLabelText}</FormLabel>
          <Select variant={"primary"} name={selectName} mt={4}>
            {selectOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormControl>
        <HStack pt={8} width={"full"}>
          <Button
            flex={1}
            name="cancel"
            variant={"blackWhiteOutline"}
            onClick={onClose}
            type={"button"}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            flex={1}
            name="confirm"
            variant={"blackSolid"}
            type={"submit"}
            isLoading={isSubmitting}
            loadingText="Processing..."
          >
            Confirm
          </Button>
        </HStack>
      </chakra.form>
    </ModalBase>
  );
};

export default ModalSimpleSelect;
