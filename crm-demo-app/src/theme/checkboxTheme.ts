import { checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const black = definePartsStyle({
  control: defineStyle({
    borderColor: "blackAlpha.700",
  }),
});

export const CheckboxTheme = defineMultiStyleConfig({
  variants: { black },
});
