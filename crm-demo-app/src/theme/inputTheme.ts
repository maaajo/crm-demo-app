import { ComponentStyleConfig } from "@chakra-ui/react";

export const InputTheme: ComponentStyleConfig = {
  variants: {
    black: {
      field: {
        color: "black",
        borderWidth: "1px",
        borderColor: "blackAlpha.500",
        _focusVisible: {
          borderColor: "blackAlpha.900",
        },
        _invalid: {
          borderColor: "red.400",
        },
      },
    },
  },
};
