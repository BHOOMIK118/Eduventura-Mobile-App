import { AuthProvider } from "@context/AuthContext";
import { UIProvider } from "@context/UIContext";
import AppNavigator from "@navigation/AppNavigator";
import { StatusBar } from "react-native";
import SafeAreaWrapper from "@components/SafeAreaWrapper";
import FontsLoading from "@components/FontsLoading";
import { useFonts } from "expo-font";
import { LogBox } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CustomBottomSheetProvider } from "@context/CustomBottomSheetProvider";

LogBox.ignoreAllLogs(true);

export default function App() {
  let [fontsLoaded] = useFonts({
    "Bold-Italic": require("@assets/fonts/Bold-Italic.ttf"),
    Bold: require("@assets/fonts/Bold.ttf"),
    Italic: require("@assets/fonts/Italic.ttf"),
    "Light-Italic": require("@assets/fonts/Light-Italic.ttf"),
    "Medium-Italic": require("@assets/fonts/Medium-Italic.ttf"),
    Medium: require("@assets/fonts/Medium.ttf"),
    Regular: require("@assets/fonts/Regular.ttf"),
    "SemiBold-Italic": require("@assets/fonts/SemiBold-Italic.ttf"),
    SemiBold: require("@assets/fonts/SemiBold.ttf"),
  });

  try {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    });
    console.log("Google Sign-In configured successfully!");
  } catch (error) {
    console.error("Failed to configure Google Sign-In:", error);
  }

  if (!fontsLoaded) {
    console.log("loading", fontsLoaded);
    return <FontsLoading />;
  } else {
    console.log("dd", fontsLoaded);

    return (
      <GestureHandlerRootView>
        <AuthProvider>
          <StatusBar
            animated={true}
            hidden={false}
            networkActivityIndicatorVisible={true}
            barStyle={"dark-content"}
          />
          <UIProvider>
            {/* <StatusBar barStyle="dark-content" backgroundColor={'red'} hidden={false} /> */}
            <SafeAreaWrapper>
              <CustomBottomSheetProvider>
                <AppNavigator />
              </CustomBottomSheetProvider>
            </SafeAreaWrapper>
          </UIProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    );
  }
}
