import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { FC, useRef, useState } from "react";
import { useUI } from "@context/UIContext";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@context/AuthContext";
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
import { getUserProfileAPI } from "@utils/services";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

const VerifyOTP: FC = ({ route }: any) => {
  const { theme, setNotification } = useUI();
  const { navigate } = useNavigation<any>();
  const [otp, setOtp] = useState(["", "", "", "","",""]);
  const { email } = route.params;
  const inputRefs = useRef<any>([]);
  const { storeToken, setProfile } = useAuth();
  const [errors, setErrors] = useState<any>({});
  const [showPopUp, setShowPopUp] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const validateOtpInput = () => {
    let valid = true;
    let tempError: any = {};
    if (!/^\d{6}$/.test(otp.join(""))) {
      tempError.otp = "Please enter a valid OTP.";
      valid = false;
    }
    setErrors(tempError);
    return valid;
  };
  const validatePassInput = () => {
    let valid = true;
    let tempError: any = {};

    if (password.trim() === "") {
      tempError.password = "Password is required.";
      valid = false;
    } else if (password.length < 6) {
      tempError.password = "Password must be at least 6 characters.";
      valid = false;
    }

    if (password.trim() === "") {
      tempError.confirmPassword = "Please confirm your password.";
      valid = false;
    } else if (password !== confirmPassword) {
      tempError.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(tempError);
    return valid;
  };
  const preValidateOTP = async () => {
    if (!validateOtpInput()) {
      return;
    }
    try {
      console.log(email, otp);
      setLoading(true);
      console.log({
        email,
        otp:otp.join(""),
      });
      
      const formattedOtp = otp.join("");
      const response = await fetch(
        API_BASE_URL + "/api/v1/auth/verifyResetOtp",
        {
          method: "POST",
          headers: {
            "x-jwt-assertion": SYSTEM_TOKEN,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: Number(formattedOtp),
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setShowPopUp(true);
        console.log(data);
      } else {
        console.log(data);

        setNotification({
          visible: true,
          success: false,
          title: "Action failed!",
          message: "OTP does not seem to match.",
          duration : 1800,
        });
      }
    } catch (error) {
      console.log(error);
      setNotification({
        visible: true,
        success: false,
        title: "Network request failed!",
        message: "Internal server error",
        duration : 1800,
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!validatePassInput()) {
      return;
    }

    console.log(email, otp, password);

    setLoading(true);
    try {
      const resp = await fetch(API_BASE_URL + `/api/v1/auth/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jwt-assertion": SYSTEM_TOKEN,
        },
        body: JSON.stringify({
          email,
          newPassword: password,
        }),
      });

      const data = await resp.json();

      if (resp.ok) {
        const resp2 = await fetch(API_BASE_URL + "/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-jwt-assertion": SYSTEM_TOKEN,
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        const data2 = await resp2.json();
        if (resp2.ok) {
          storeToken(data2.token);
          const userProfile = await getUserProfileAPI(data2.token);
          if (userProfile.user.mobileNumber) {
            setShowPopUp(false);
            setProfile(userProfile);
            setNotification({
              visible: true,
              success: true,
              title: "Login Successful",
              message:
                "Welcome to Pioneer. Your journey for finding the best university ends here",
              duration : 1800,
            });
          } else {
            navigate("PENDINGPROFILE", { token: data2.token });
          }
        } else {
          setNotification({
            title: "Forget password status",
            message: "Unable to reset the password",
            visible: true,
            success: false,
            duration : 1800,
          });
        }
      } else {
        setNotification({
          title: "Forget password status",
          message: "Unable to reset the password",
          visible: true,
          success: false,
          duration : 1800,
        });
      }
    } catch (error) {
      console.error(error);
      setNotification({
        title: "Action Failed",
        duration : 1800,
        visible: true,
        success: false,
        message: "Your action is not successfull",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <NoAuthLayout>
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
              heading="Enter OTP"
              subHeading="We have sent you an OTP on your email"
              headingColor={THEME[theme].primary}
              subHeadingColor={THEME[theme].SubHeadingTextColor}
            />
            <HeightGap height={20} />
            <View
              style={{
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 240,
                  height: 200,
                }}
              >
                <ImageBackground
                  source={require("../../assets/login/enter-otp.png")}
                  style={{
                    flex: 1,

                    justifyContent: "center",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                  resizeMode="cover"
                />
              </View>
            </View>
            <HeightGap height={20} />
            <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>
        {errors.otp ? <ErrorMessage message={errors.otp} /> : null}
        <HeightGap height={10}/>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* {screenName != "FORGOTPASSWORD" && (
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigate("LOGINSCREEN" as never)}
                  >
                    <Text
                      style={{
                        color: THEME[theme].HeadingTextColor,
                        fontFamily: "NunitoSans_400Regular",
                        fontsize:RFValue(16),
                      }}
                    >
                      Account login
                    </Text>
                  </TouchableOpacity>
                </View>
              )} */}
              {/* {screenName != "FORGOTPASSWORD" && (
                <View>
                  <TouchableOpacity
                    onPress={() => navigate("REGISTERSCREEN" as never)}
                  >
                    <Text
                      style={{
                        color: THEME[theme].HeadingTextColor,
                        fontFamily: "NunitoSans_400Regular",
                        fontsize:RFValue(16),
                      }}
                    >
                      Register now
                    </Text>
                  </TouchableOpacity>
                </View>
              )} */}
            </View>
            <HeightGap height={20} />
            <CustomButton
              title={!loading ? "Next" : "Loading"}
              background={THEME[theme].primary}
              onPress={preValidateOTP}
            />
          </View>
        </KeyboardAvoidingView>
      </NoAuthLayout>
      {/* {showPopUp && ( */}
      <Modal animationType="fade" transparent={true} visible={showPopUp}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.68)",
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              style={{
                width: 340,
                backgroundColor: "#ffffff",
                borderRadius: 20,
                marginHorizontal: 40,
                marginBottom: 40,
                paddingTop: 60,
                ...Platform.select({
                  ios: {
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 0.12,
                    shadowRadius: 4,
                  },
                  android: {
                    elevation: 10,
                  },
                }),
              }}
            >
              <TouchableOpacity
                onPress={() => setShowPopUp(false)}
                style={{
                  position: "absolute",
                  alignSelf: "flex-end",
                  right: 14,
                  top: 8,
                }}
              >
                <MaterialCommunityIcons
                  name="close"
                  color={THEME[theme].primary}
                  size={28}
                />
              </TouchableOpacity>
              
              <View style={{ paddingHorizontal: 20 }}>
                <InputTextField
                  placeholder="***************"
                  label="Set your password"
                  isRequired={true}
                  value={password}
                  onChangeText={setPassword}
                  isPasswordSecure={true}
                />
                {errors.password ? (
                  <ErrorMessage message={errors.password} />
                ) : null}
                <HeightGap height={10} />
                <InputTextField
                  placeholder="***************"
                  label="Confirm password"
                  isRequired={true}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  isPasswordSecure={true}
                />
                {errors.confirmPassword ? (
                  <ErrorMessage message={errors.confirmPassword} />
                ) : null}
                <HeightGap height={20} />
              </View>
              <TouchableOpacity
                onPress={() => {
                  verifyOtp();
                }}
                disabled={loading}
              >
                <View
                  style={{
                    backgroundColor: loading
                      ? "#f0f0f0"
                      : THEME[theme].primary,
                    paddingHorizontal: 16,
                    paddingVertical: 20,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      color: loading ? "#cfcfcf" : "white",
                      fontFamily: "SemiBold",
                      fontSize:RFValue(16),
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}
                  >
                    {loading ? "Confirming..." : "Confirm"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
      {/* )} */}
    </>
  );
};

export default VerifyOTP;

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: RFValue(20),
    textAlign: "center",
    color: "#000",
  },
})
