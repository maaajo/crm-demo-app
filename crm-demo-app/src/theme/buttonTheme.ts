import {
  StyleFunctionProps,
  defineStyle,
  defineStyleConfig,
  theme,
} from "@chakra-ui/react";

const blackSolid = defineStyle({
  color: "white",
  bgColor: "black",
  _hover: {
    bgColor: "blackAlpha.800",
    textDecoration: "none",
  },
});

const blackWhiteOutline = defineStyle({
  color: "blackAlpha.900",
  borderWidth: "1px",
  borderColor: "blackAlpha.600",
  _hover: {
    backgroundColor: "blackAlpha.50",
  },
});

const ButtonTheme = defineStyleConfig({
  variants: {
    blackSolid,
    blackWhiteOutline,
  },
});

export default ButtonTheme;
