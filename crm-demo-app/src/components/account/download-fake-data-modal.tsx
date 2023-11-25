import { useToast } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { OUTPUT_TYPES } from "@/pages/api/fake-accounts";
import { FakeAccountsQueryProps } from "@/pages/api/fake-accounts";
import { faker } from "@faker-js/faker";
import axios from "redaxios";
import { saveAs } from "file-saver";
import ModalSimpleSelect from "../modal-simple-select";

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
    <ModalSimpleSelect
      isOpen={isOpen}
      isSubmitting={isSubmitting}
      onClose={onClose}
      title="Download fake accounts"
      onSubmit={handleDownloadFakeAccounts}
      selectFormLabelText="Select output type:"
      selectName={selectFormName}
      selectOptions={[OUTPUT_TYPES.CSV, OUTPUT_TYPES.XLSX]}
    />
  );
};

export default DownloadFakeDataModal;
