import { useUI } from "@context/UIContext";
import { screenHeight, screenWidth } from "@utils/Scaling";
import { THEME } from "@utils/ui";
import { FC } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

const FontsLoading: FC = () => {
  return (
    // <View
    //   style={{
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     paddingHorizontal: 20,
    //     backgroundColor: '#2c2c31',
    //   }}>
    //   {/* <Text
    //     style={{
    //       fontFamily: 'NunitoSans_300Light',
    //       fontsize:RFValue(16),
    //       color: '#2980b9',
    //     }}>
    //     Loading ...
    //   </Text> */}
    //   <ActivityIndicator size={'large'} color={'#2980b9'}/>
    // </View>
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

export default FontsLoading;
