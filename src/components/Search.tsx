import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Search = ({
  placeholderColor,
  placeholder,
  borderColor,
  backgroundColor,
  icon,
  value,
  onSearchChange,
  iconColor,
  textColor,
}) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSearchChange = (text:string) => {
    onSearchChange(text);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View>
        <View
          style={[
            styles.container,
            { borderColor: borderColor, backgroundColor: backgroundColor },
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={iconColor}
            style={styles.icon}
          />
          <TextInput
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              color: textColor,
              fontFamily:'Regular'
            }}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            value={value}
            onChangeText={handleSearchChange}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 8,
    margin: 8,
    marginHorizontal: 4,
    marginTop: 4,
    borderRadius: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
  },
});

export default Search;
