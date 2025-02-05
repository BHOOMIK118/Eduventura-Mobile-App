import React, { FC } from "react";
import { ImageBackground, View, StyleSheet, Text } from "react-native";
import { LoginScreenStyles } from "src/styles/login-screen";
import CustomText from "@components/CustomText";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import HeightGap from "./HeightGap";
import { APP_NAME, APP_TAGLINE, APP_VERSION } from "@utils/constant";
import { screenHeight, screenWidth } from "@utils/Scaling";

const LogoBoxNoAuth: FC = () => {
  const { theme } = useUI();
  return (
    <View style={LoginScreenStyles.Logo.Box}>
      <View style={LoginScreenStyles.Logo.ImageHolder}>
        <ImageBackground
          source={require("@assets/logo.png")}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems:'center',
            alignSelf:'center',
            overflow: "hidden",
            height: screenHeight*0.15,
            width: screenWidth*1,
          }}
          resizeMode="contain"
        />
      </View>
      <HeightGap height={20} />
      {/* <Text
        style={{
          ...LoginScreenStyles.Logo.Title,
          color: THEME[theme].LoginFormLogoTextColor,
        }}
      >
        {APP_NAME}
      </Text> */}
      {/* <Text
        style={{
          ...LoginScreenStyles.Logo.SubTitle,
          color: THEME[theme].LoginFormLogoTextColor,
        }}
      >
        {APP_TAGLINE}
      </Text> */}
      {/* <Text
        style={{
          ...LoginScreenStyles.Logo.Version,
          color: THEME[theme].LoginFormLogoTextColor,
        }}
      >
        v {APP_VERSION}
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageBackground: {
    flex: 1,
  },
  loginText: {
    left: -10,
    marginBottom: 4,
  },
  subHeadingText: {
    left: -6,
  },
});

export default LogoBoxNoAuth;
