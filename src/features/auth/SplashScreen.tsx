import { View, Text, Image } from "react-native";
import React, { FC } from "react";
import { screenHeight, screenWidth } from "@utils/Scaling";

const SplashScreen: FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center",backgroundColor:'white' }}>
      <Image
        source={require("@assets/logo.png")}
        style={{
          height: screenHeight * 0.7,
          width: screenWidth * 0.7,
          resizeMode: "contain",
        }}
      />
    </View>
  );
};

export default SplashScreen;
