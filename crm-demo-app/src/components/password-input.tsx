import { useState } from "react";
import {
  InputGroup,
  Input,
  InputRightElement,
  InputLeftElement,
  Button,
  Icon,
  InputProps,
} from "@chakra-ui/react";
import { KeyRound } from "lucide-react";

const PasswordInput = ({ ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleButtonClick = () => setShowPassword((prevValue) => !prevValue);

  const passwordWidth = "4.5rem";

  return (
    <InputGroup size={"md"}>
      <InputLeftElement pointerEvents={"none"}>
        <Icon as={KeyRound} color={"gray.500"} />
      </InputLeftElement>
      <Input
        pr={passwordWidth}
        type={showPassword ? "text" : "password"}
        placeholder="Enter Password"
        variant={"black"}
        {...props}
      />
      <InputRightElement width={passwordWidth}>
        <Button h="1.75rem" size={"sm"} onClick={handleButtonClick}>
          {showPassword ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
