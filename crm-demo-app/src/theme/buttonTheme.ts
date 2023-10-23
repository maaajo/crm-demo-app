import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const blackSolid = defineStyle({
  color: "white",
  bgColor: "black",
  _hover: {
    bgColor: "blackAlpha.800",
    textDecoration: "none",
  },
});

const ButtonTheme = defineStyleConfig({
  variants: { blackSolid },
});

export default ButtonTheme;
