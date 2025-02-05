import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { FC, useCallback, useRef, useState } from "react";
import Swiper from "react-native-swiper";
import { screenHeight, screenWidth } from "@utils/Scaling";
import CustomText from "@components/CustomText";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import CustomButton from "@components/CustomButton";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import InputTextField from "@components/InputTextField";
import { API_BASE_URL, ROLE_ID_USER, SYSTEM_TOKEN } from "@utils/constant";
import { decodeRolesFromToken, prettier } from "@utils/helpers";
import { getKycDetails, getUserProfileAPI } from "@utils/services";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@context/AuthContext";
import ErrorMessage from "@components/ErrorMessage";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import Separator from "@components/Separator";

const Onboarding: FC<any> = ({ route }) => {
  const { theme, setFullscreenLoading, setNotification } = useUI();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalMode, setModalMode] = useState<any>(
    route?.params?.modalMode || "login"
  );
  const [errors, setErrors] = useState<any>({});
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { navigate } = useNavigation<any>();
  const { storeToken, setProfile,setKycDetails } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      // Ensure Google Play services are available
      await GoogleSignin.hasPlayServices();

      // Sign out to clear any cached login state
      await GoogleSignin.signOut();

      // Now prompt the user to sign in and choose an account
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        // prettier("Signed in user:", userInfo);
        try {
          setFullscreenLoading(true);
          const { idToken: token }: any = userInfo?.data;
          // console.log('my token',token);

          const response = await fetch(
            API_BASE_URL + "/api/v1/auth/googleLogin",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token,
              }),
            }
          );
          const data = await response.json();
          if (response.status === 200) {
            console.log("hello", data);
            const { role } = data?.user;
            const { sessionToken: newToken } = data;
            console.log("my thing", role);

            if (role === "REGULAR_USER") {
              await storeToken(newToken);
              const userProfile = await getUserProfileAPI(newToken);
              // console.log(userProfile);
              const kyc = await getKycDetails(token,userProfile.user.userId);
            await setKycDetails(kyc)
              if (userProfile.user.mobileNumber === null) {
                setFullscreenLoading(false);
                navigate("PENDINGPROFILE", { token: newToken } as never);
              } else {
                setProfile(userProfile);
                setNotification({
                  visible: true,
                  success: true,
                  title: "Login Successful",
                  message:
                    "Welcome to Pioneer. Your journey for dream university starts here.",
                  duration: 1800,
                });
              }
            } else if (role === "ADMIN") {
              await storeToken(newToken);
              console.log("askfjsajkfjsahjfhksajfhjksfjafhjehfef");

              const userProfile = await getUserProfileAPI(newToken);
              if (userProfile) {
                setProfile(userProfile);
                console.log("sdsad");
              } else {
                console.error("Error");
              }
            }
          } else {
            console.warn("lg gye", data);
          }
        } catch (error) {
          console.error("Error", error);
          setFullscreenLoading(false);
        }
      }

      // Use userInfo as needed
    } catch (error) {
      console.error("Google Sign-In error:", error);
    }
  };

  const handlePresentModalPress = useCallback(() => {
    setModalMode("login"); // Default to login
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const validateInput = () => {
    let valid = true;
    let tempErrors: any = {};

    if (email.trim() === "") {
      tempErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email) || /^$|\s+/.test(email)) {
      tempErrors.email = "Please enter a valid Email address.";
      valid = false;
    }
    if (password.trim() === "" && modalMode === "login") {
      tempErrors.password = "Password is required.";
      valid = false;
    } else if (password.length < 6 && modalMode === "login") {
      tempErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateInput()) {
      return;
    }
    setFullscreenLoading(true);
    try {
      const resp = await fetch(API_BASE_URL + "/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jwt-assertion": SYSTEM_TOKEN,
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (resp.ok) {
        const response = await resp.json();
        console.log(response);
        if (response.token) {
          const token = response.token;

          const role = decodeRolesFromToken(token);

          if (role === "REGULAR_USER") {
            await storeToken(token);
            const userProfile = await getUserProfileAPI(token);
            // prettier('sdf',userProfile);
            const kyc = await getKycDetails(token,userProfile.user.userId);
            await setKycDetails(kyc)
            if (userProfile.user.mobileNumber === null) {
              navigate("PENDINGPROFILE", { token: token } as never);
            } else {
              setProfile(userProfile);
              setNotification({
                visible: true,
                success: true,
                title: "Login Successful",
                message:
                  "Welcome to Pioneer. Your journey for dream university starts here.",
                duration: 1800,
              });
            }
          } else if (role === "ADMIN") {
            await storeToken(token);
            console.log("askfjsajkfjsahjfhksajfhjksfjafhjehfef");

            const userProfile = await getUserProfileAPI(token);
            if (userProfile) {
              setProfile(userProfile);
              console.log("sdsad");
            } else {
              console.error("Error");
            }
          } else {
            setNotification({
              visible: true,
              success: false,
              title: "Invalid credentials",
              message:
                "You do not have the required permissions to access this application.",
              duration: 1800,
            });
          }
        }
      } else {
        setNotification({
          visible: true,
          success: false,
          title: "Login failed!",
          message: "Email / Password does not seem to match.",
          duration: 1800,
        });
      }
    } catch (e) {
      console.log("Error Logging into the account", e);
      setNotification({
        visible: true,
        success: false,
        title: "An error occurred",
        message: "Something went wrong, please try again later",
        duration: 2000,
      });
    } finally {
      setFullscreenLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateInput()) {
      return;
    }
    setFullscreenLoading(true);
    try {
      const resp = await fetch(API_BASE_URL + "/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jwt-assertion": SYSTEM_TOKEN,
        },
        body: JSON.stringify({
          email: email,
          role: ROLE_ID_USER,
        }),
      });

      const response = await resp.json();
      if (resp.ok) {
        navigate("ENTEROTP", { email: email, screenName: "REGISTERSCREEN" });
      } else {
        console.log("response is ", response);

        setNotification({
          title: "Register Status",
          message: "Email already exists",
          duration: 1800,
          visible: true,
          success: false,
        });
      }
    } catch (e) {
      console.log("Error during registration:", e);
      setNotification({
        visible: true,
        success: false,
        title: "Something went wrong",
        message: "An error has occured",
        duration: 2000,
      });
    } finally {
      setFullscreenLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View style={{ flex: 1, paddingBottom: 16 }}>
        <Swiper
          style={styles.wrapper}
          autoplayDirection
          dot={
            <View
              style={{
                backgroundColor: THEME[theme].disabled,
                width: 13,
                height: 13,
                borderRadius: 7,
                marginLeft: 7,
                marginRight: 7,
              }}
            />
          }
          activeDot={
            <View
              style={{
                backgroundColor: THEME[theme].primary,
                width: 13,
                height: 13,
                borderRadius: 7,
                marginLeft: 7,
                marginRight: 7,
              }}
            />
          }
          paginationStyle={{ bottom: 70 }}
          loop={true}
          autoplay={true}
        >
          <View style={styles.slide}>
            <Image
              style={{ width: screenWidth * 0.8, height: screenHeight * 0.38 }}
              source={require("@assets/images/onboarding1.png")}
              resizeMode="contain"
            />
            <CustomText
              heading="Online Consultation"
              headingColor={THEME[theme].primary}
            />
            <CustomText
              subHeading="Get online consultation from experts to clarify your confusion."
              style={{
                textAlign: "center",
                paddingHorizontal: 20,
                lineHeight: 25,
              }}
            />
          </View>
          <View style={styles.slide}>
            <Image
              style={{ width: screenWidth * 0.8, height: screenHeight * 0.38 }}
              source={require("@assets/images/onboarding2.png")}
              resizeMode="contain"
            />
            <CustomText
              heading="Top Ranked Universities"
              headingColor={THEME[theme].primary}
            />
            <CustomText
              subHeading="Study global, Get more out of your career"
              style={{
                textAlign: "center",
                paddingHorizontal: 20,
                lineHeight: 25,
              }}
            />
          </View>
        </Swiper>
        <CustomButton
          title="Start your journey now"
          background={THEME[theme].primary}
          style={{ borderRadius: 50, marginHorizontal: 16 }}
          onPress={handlePresentModalPress}
        />
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
            handleStyle={{
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
            snapPoints={["95%"]}
            enableDynamicSizing={false}
            backdropComponent={({ style }) => (
              <View
                style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
              />
            )}
          >
            <BottomSheetScrollView contentContainerStyle={{padding:16}} showsVerticalScrollIndicator={false} >
                  <Image
                    style={{
                      width: screenWidth * 0.5,
                      height: screenHeight * 0.2,
                      alignSelf: "center",
                    }}
                    source={require("@assets/logo.png")}
                    resizeMode="contain"
                  />
                  <CustomText
                    heading={modalMode === "login" ? "Welcome Back" : "Join Us"}
                    headingFontSize={20}
                  />
                  <CustomText
                    subHeading={
                      modalMode === "login"
                        ? "Log in to continue"
                        : "Create an account to get started"
                    }
                  />
                  <InputTextField
                    placeholder="Email address"
                    value={email}
                    onChangeText={setEmail}
                  />
                  {errors.email ? (
                    <ErrorMessage message={errors.email} />
                  ) : null}
                  {modalMode === "login" && (
                    <>
                      <InputTextField
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        isPasswordSecure={true}
                        textContentType={"oneTimeCode"}
                      />
                      {errors.password ? (
                        <ErrorMessage message={errors.password} />
                      ) : null}
                    </>
                  )}

                  <CustomText
                    subHeading="By proceeding, you agree to our Terms & Conditions and Privacy Policy"
                    style={{ marginTop: 12 }}
                  />
                  <View style={{ width: "100%", marginTop: 16 }}>
                    <CustomButton
                      title={modalMode === "login" ? "Login" : "Sign Up"}
                      background={THEME[theme].primary}
                      onPress={
                        modalMode === "login" ? handleLogin : handleRegister
                      }
                    />
                  </View>
                  <View style={{flexDirection:'row',alignItems:'center',gap:4,marginVertical:8}}>
                    <Separator  width={'46%'}/>
                      <CustomText subHeading="OR" subHeadingColor={THEME[theme].text.secondary}/>
                    <Separator  width={'50%'}/>

                  </View>
                  <View style={{ alignItems: "center" }}>
                    <GoogleSigninButton
                      size={GoogleSigninButton.Size.Wide}
                      color={GoogleSigninButton.Color.Dark}
                      onPress={handleGoogleSignIn}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      navigate("FORGOTPASSWORD" as never);
                    }}
                    style={{ marginTop: 16 }}
                  >
                    <CustomText
                      subHeading={"Forgot Password?"}
                      style={{ color: THEME[theme].primary }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setModalMode((prev) =>
                        prev === "login" ? "signup" : "login"
                      );
                      setErrors({});
                    }}
                    style={{ marginTop: 16 }}
                  >
                    <CustomText
                      subHeading={
                        modalMode === "login"
                          ? "Don't have an account? Sign Up"
                          : "Already have an account? Log In"
                      }
                      style={{ color: THEME[theme].primary }}
                    />
                  </TouchableOpacity>
                {/* </ScrollView> */}
            </BottomSheetScrollView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  slide: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    paddingHorizontal: 16,
    textAlign: "center",
    alignItems: "center",
  },
});
