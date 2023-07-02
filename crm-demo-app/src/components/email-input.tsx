import {
  InputGroup,
  Input,
  InputLeftElement,
  Icon,
  InputProps,
} from "@chakra-ui/react";
import { AtSign } from "lucide-react";

const EmailInput = ({ ...props }: InputProps) => {
  return (
    <InputGroup size={"md"}>
      <InputLeftElement pointerEvents={"none"}>
        <Icon as={AtSign} color={"gray.500"} />
      </InputLeftElement>
      <Input
        type={"email"}
        placeholder="Enter Email Address"
        variant={"black"}
        {...props}
      />
    </InputGroup>
  );
};

export default EmailInput;
