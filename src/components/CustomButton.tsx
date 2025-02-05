import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import React from "react";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  background: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  fontSize?: number;
  color?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  style,
  title,
  background,
  icon,
  iconColor = "#fff",
  iconSize = 24,
  fontSize = 18,
  color = "#fff",
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          paddingVertical: 0,
          paddingHorizontal: 52,
          borderRadius: 12,
          height: 52,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: background,
          flexDirection: "row",
        },
       ...(Array.isArray(style) ? style : [style]),
      ]}
      {...rest}
    >
      {icon && (
        <MaterialCommunityIcons name={icon} color={iconColor} size={iconSize} />
      )}
      <Text
        style={{
          fontFamily: "Medium",
          fontSize: fontSize,
          color: color,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
