import { Box, Flex, Text, chakra } from "@chakra-ui/react";

type StatusIndicatorProps = {
  isActive: Boolean;
};

export default function StatusIndicator({ isActive }: StatusIndicatorProps) {
  const indicatorActiveColor = "green.500";
  const indicatorInactiveColor = "red.500";
  const indicatorActiveText = "Active";
  const indicatorInactiveText = "Inactive";

  return (
    <Flex alignItems={"center"}>
      <chakra.span
        width={"10px"}
        height={"10px"}
        borderRadius={"50%"}
        bgColor={isActive ? indicatorActiveColor : indicatorInactiveColor}
        mr={"1.5"}
      ></chakra.span>
      <Text>{isActive ? indicatorActiveText : indicatorInactiveText}</Text>
    </Flex>
  );
}
