import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { FC, useState } from "react";
import { useUI } from "@context/UIContext";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";
import { NoAuthLayout } from "@context/NoAuthLayout";
import LogoBoxNoAuth from "@components/LogoBoxNoAuth";
import { LoginScreenStyles } from "@styles/login-screen";
import { THEME } from "@utils/ui";
import CustomText from "@components/CustomText";
import HeightGap from "@components/HeightGap";
import InputTextField from "@components/InputTextField";
import ErrorMessage from "@components/ErrorMessage";
import CustomButton from "@components/CustomButton";
import { RFValue } from "react-native-responsive-fontsize";

const ForgetPassword: FC = () => {
  const [email, setEmail] = useState("");
  const { theme, setNotification, setFullscreenLoading } = useUI();
  const { navigate } = useNavigation<any>();
  const [error, showError] = useState<boolean>(false);

  const handleSubmit = async () => {
    if(email===""){
      showError(true);
      return;
    }
    try {
      setFullscreenLoading(true);
      const response = await fetch(API_BASE_URL + "/api/v1/auth/forgotpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jwt-assertion": SYSTEM_TOKEN,
        },
        body: JSON.stringify({
          email,
        }),
      });
      if (response.ok) {
        navigate("VERIFYOTP", {
          email: email,
        });
      } else {
        showError(true);
      }
    } catch (error) {
      console.log("Error to forget password", error);
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: THEME[theme].background,
      }}
    >
      <LogoBoxNoAuth />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={{
            ...LoginScreenStyles.FormBox,
            backgroundColor: THEME[theme].LoginFormBoxBackground,
          }}
        >
          <CustomText
            heading="Forgot Password"
            subHeading="Enter email to reset your password."
            headingColor={THEME[theme].text.primary}
            subHeadingColor={THEME[theme].SubHeadingTextColor}
          />
          {/* <HeightGap height={20} /> */}
          {/* <View
            style={{
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 200,
                height: 172,
              }}>
              <ImageBackground
                source={require('@assets/login/forgot-password.png')}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
                resizeMode='cover'
              />
            </View>
          </View> */}
          {/* <HeightGap height={20} /> */}
          <InputTextField
            placeholder="Enter your email"
            // label="Email"
            // isRequired={true}
            value={email}
            onChangeText={setEmail}
          />
          {error && <ErrorMessage message={"Email does not exist!"} />}
          <HeightGap height={20} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => navigate("ONBOARDING" as never)}
              >
                <CustomText
                  style={{
                    color: THEME[theme].primary,
                    fontFamily: "Regular",
                    fontSize:RFValue(16),
                  }}
                  heading="Account login"
                />
                
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => navigate("ONBOARDING",{modalMode:'signup'} as never)}
              >
                <CustomText
                  style={{
                    color: THEME[theme].primary,
                    fontFamily: "Regular",
                    fontSize:RFValue(16),
                  }}
                  heading="Register now"
                />
                
              </TouchableOpacity>
            </View>
          </View>
          <HeightGap height={20} />
          <CustomButton
            title="Submit"
            background={THEME[theme].primary}
            onPress={handleSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgetPassword;
