import { Text } from "@chakra-ui/react";

type StatusIndicatorProps = {
  isActive: Boolean;
};

export default function StatusIndicator({ isActive }: StatusIndicatorProps) {
  const indicatorActiveColor = "green.500";
  const indicatorInactiveColor = "red.500";
  const indicatorActiveText = "Active";
  const indicatorInactiveText = "Inactive";

  return (
    <Text
      position={"relative"}
      _before={{
        content: "''",
        position: "absolute",
        display: "block",
        width: "12px",
        height: "12px",
        boxSizing: "border-box",
        borderRadius: "50%",
        bgColor: `${isActive ? indicatorActiveColor : indicatorInactiveColor}`,
        left: -5,
        top: 0.5,
      }}
    >
      {isActive ? indicatorActiveText : indicatorInactiveText}
    </Text>
  );
}
