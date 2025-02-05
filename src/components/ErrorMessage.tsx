import React from "react";
import { Text, TextStyle } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <Text
      style={{
        fontSize: RFValue(12),
        fontFamily: "Regular",
        color: "red",
        textAlign: "right" as TextStyle["textAlign"],
      }}
    >
      {message}
    </Text>
  );
};

export default ErrorMessage;
