import React, { FC, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TextInputProps,
} from "react-native";
import { useUI } from "@context/UIContext";
import { THEME } from "@utils/ui";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { RFValue } from "react-native-responsive-fontsize";


interface BottomSheetInputFieldProps extends TextInputProps {
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
  isPasswordSecure?: boolean;
  disableColor?: string;
  inputColor?: string;
  labelColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  value: any;
}

const BottomSheetInputField: FC<BottomSheetInputFieldProps> = ({
  placeholder,
  label,
  isRequired = false,
  isPasswordSecure: isPasswordSecureProp = false,
  disableColor = "transparent",
  inputColor,
  labelColor,
  borderColor,
  backgroundColor,
  ...rest
}) => {
  const { theme } = useUI();
  const [isPasswordSecure, setIsPasswordSecure] =
    useState(isPasswordSecureProp);

  const Styles = StyleSheet.create({
    Row: {
      justifyContent: "flex-start",
      alignItems: "flex-start",
      padding: 0,
    },
    LabelRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    LabelRowLeft: {
      flex: 1,
    },
    Label: {
      color: labelColor || THEME[theme].inputTextColor,
      fontFamily: "Regular",
      fontSize:RFValue(14),
      lineHeight: 22,
    },
    InputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: borderColor || THEME[theme].inputTextFieldBorderColor,
      borderRadius: 5,
      height: 48,
      paddingHorizontal: 16,
      backgroundColor: backgroundColor || disableColor,
    },
    Input: {
      flex: 1,
      color: inputColor || THEME[theme].inputTextColor,
      fontFamily: "Regular",
      fontSize:RFValue(14),
    },
    IconContainer: {
      marginLeft: 10,
    },
  });
  return (
    <View style={Styles.Row}>
      <View style={Styles.LabelRow}>
        <View style={Styles.LabelRowLeft}>
          <Text style={Styles.Label}>{label}</Text>
        </View>
        {isRequired && <Text style={{ ...Styles.Label, color: "red" }}>*</Text>}
      </View>
      <View style={Styles.InputContainer}>
        <BottomSheetTextInput
          style={Styles.Input}
          autoCapitalize="none"
          secureTextEntry={isPasswordSecure}
          placeholder={placeholder}
          placeholderTextColor={THEME[theme].inputPlaceholderColor}
          {...rest}
        />
        {isPasswordSecureProp && (
          <TouchableOpacity
            style={Styles.IconContainer}
            onPress={() => setIsPasswordSecure(!isPasswordSecure)}
          >
            <MaterialCommunityIcons
              name={isPasswordSecure ? "eye-off" : "eye"}
              size={24}
              color={THEME[theme].disabled}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default BottomSheetInputField;
