import { useState } from "react";
import { InputGroup, Input, InputRightElement, Button } from "@chakra-ui/react";

const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleButtonClick = () => setShowPassword((prevValue) => !prevValue);

  const passwordWidth = "4.5rem";

  return (
    <InputGroup size={"md"}>
      <Input
        pr={passwordWidth}
        type={showPassword ? "text" : "password"}
        placeholder="Enter Password"
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
