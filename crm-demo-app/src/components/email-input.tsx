import { InputGroup, Input, InputLeftElement, Icon } from "@chakra-ui/react";
import { AtSign } from "lucide-react";

const EmailInput = () => {
  return (
    <InputGroup size={"md"}>
      <InputLeftElement pointerEvents={"none"}>
        <Icon as={AtSign} color={"gray.500"} />
      </InputLeftElement>
      <Input
        type={"email"}
        placeholder="Enter Email Address"
        variant={"black"}
      />
    </InputGroup>
  );
};

export default EmailInput;
