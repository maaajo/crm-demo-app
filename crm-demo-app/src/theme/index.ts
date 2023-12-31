import { extendTheme } from "@chakra-ui/react";
import ButtonTheme from "./buttonTheme";
import CheckboxTheme from "./checkboxTheme";
import InputTheme from "./inputTheme";
import { SelectTheme } from "./selectTheme";

const customTheme = extendTheme({
  styles: {
    global: () => ({
      body: {
        background: "blackAlpha.300",
      },
    }),
  },
  fonts: {
    heading: "var(--font-inter)",
    body: "var(--font-inter)",
  },
  components: {
    Input: InputTheme,
    Checkbox: CheckboxTheme,
    Button: ButtonTheme,
    Select: SelectTheme,
  },
});

export default customTheme;
