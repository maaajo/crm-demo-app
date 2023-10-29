import { selectAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(selectAnatomy.keys);

const primary = definePartsStyle({
  field: {
    borderColor: "blackAlpha.500",
    borderWidth: "1px",
    backgroundColor: "white",
    _focusVisible: {
      borderColor: "blackAlpha.900",
    },
    _hover: { borderColor: "blackAlpha.500" },
    _invalid: {
      borderColor: "red.400",
    },
  },
});

export const SelectTheme = defineMultiStyleConfig({
  variants: { primary },
});
