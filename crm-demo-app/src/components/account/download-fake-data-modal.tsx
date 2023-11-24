import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  HStack,
  ModalCloseButton,
  Select,
  chakra,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { OUTPUT_TYPES } from "@/pages/api/fake-accounts";
import { FakeAccountsQueryProps } from "@/pages/api/fake-accounts";
import { faker } from "@faker-js/faker";
import axios from "redaxios";
import { saveAs } from "file-saver";

type DownloadFakeDataModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const selectFormName = "output_type";

const downloadFakeData = async (
  outputType: FakeAccountsQueryProps["outputType"]
) => {
  const randomNumber = faker.number.int({ min: 10, max: 200 });

  const response = await axios.get(
    `/api/fake-accounts?outputType=${outputType}&size=${randomNumber}`,
    {
      responseType: "blob",
    }
  );

  const contentType = response.headers.get("content-type") || "";
  const contentDisposition = response.headers.get("content-disposition") || "";
  const contentDispositionFileNameRegex = new RegExp(
    `file-name[^;\\n]*=(UTF-\\d['"]*)?((['"]).*?[.]$\\2|[^;\\n]*)?`,
    "g"
  );
  const fileNameArray =
    contentDispositionFileNameRegex.exec(contentDisposition);
  const fileName = fileNameArray ? fileNameArray[2] : "";

  const blob = new Blob([response.data], {
    type: contentType,
  });

  saveAs(blob, fileName);
};

const DownloadFakeDataModal = ({
  isOpen,
  onClose,
}: DownloadFakeDataModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleDownloadFakeAccounts = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const outputType = formData
        .get(selectFormName)!
        .toString() as FakeAccountsQueryProps["outputType"];

      await downloadFakeData(outputType);

      toast({
        status: "success",
        description: "Fake accounts file download started successfully",
        title: "Success",
      });

      onClose();
    } catch (e: any) {
      toast({
        status: "error",
        description: e.message,
        title: "Failure",
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      closeOnOverlayClick={!isSubmitting}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent py={8} px={4}>
        <ModalCloseButton isDisabled={isSubmitting} />
        <ModalBody textAlign={"center"} mt={10} mb={4}>
          <chakra.form onSubmit={handleDownloadFakeAccounts}>
            <Heading fontSize={"2xl"} fontWeight={"extrabold"}>
              Download fake accounts
            </Heading>
            <FormControl mt={6} isDisabled={isSubmitting}>
              <FormLabel textAlign={"center"}>
                Please select output type
              </FormLabel>
              <Select variant={"primary"} name={selectFormName} mt={4}>
                {[OUTPUT_TYPES.CSV, OUTPUT_TYPES.XLSX].map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </FormControl>
            <HStack pt={8} width={"full"}>
              <Button
                flex={1}
                name="confirm"
                variant={"blackWhiteOutline"}
                type={"submit"}
                isLoading={isSubmitting}
                loadingText="Downloading..."
              >
                Download
              </Button>
              <Button
                flex={1}
                name="cancel"
                variant={"blackSolid"}
                onClick={onClose}
                type={"button"}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
            </HStack>
          </chakra.form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DownloadFakeDataModal;
