import {
  InputGroup,
  Input,
  InputLeftElement,
  Icon,
  InputProps,
} from "@chakra-ui/react";
import { AtSign } from "lucide-react";
import { LegacyRef } from "react";

interface IEmailInputProps extends InputProps {
  emailRef?: LegacyRef<HTMLInputElement>;
}

const EmailInput = ({ emailRef, ...props }: IEmailInputProps) => {
  return (
    <InputGroup size={"md"}>
      <InputLeftElement pointerEvents={"none"}>
        <Icon as={AtSign} color={"gray.500"} />
      </InputLeftElement>
      <Input
        type={"email"}
        placeholder="Enter Email Address"
        variant={"black"}
        ref={emailRef}
        {...props}
      />
    </InputGroup>
  );
};

export default EmailInput;
