import { View, Text, StyleSheet, StyleSheetProperties, StyleProp, ViewStyle } from "react-native";
import React, { FC } from "react";
import { useUI } from "../context/UIContext";
import { THEME } from "../utils/ui";

interface SeparatorProps {
  color?: string;
  height?: number;
  width?: any;
  style?: StyleProp<ViewStyle>;
}

const Separator: FC<SeparatorProps> = ({ color, height, width, style }) => {
  const { theme } = useUI();
  return (
    <View
      style={[
        {
          height: height || 0.5,
          width: width || "100%",
          backgroundColor: color || THEME[theme].disabled,
        },
        style,
      ]}
    />
  );
};

export default Separator;
