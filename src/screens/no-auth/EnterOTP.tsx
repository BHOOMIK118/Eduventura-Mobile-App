import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { FC, useRef, useState } from "react";
import { useUI } from "@context/UIContext";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@context/AuthContext";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";
import { RFValue } from "react-native-responsive-fontsize";

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

const EnterOTP: FC = ({ route }: any) => {
  const { theme, setNotification, setFullscreenLoading } = useUI();
  const { navigate } = useNavigation<any>();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<any>([]);
  const { email } = route.params;
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
    checkOTP();
  };

  const checkOTP = async () => {
    try {
      setFullscreenLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verifyOtpReg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jwt-assertion": SYSTEM_TOKEN,
        },
        body: JSON.stringify({
          email,
          otp: Number(otp.join("")),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setShowPopUp(true);
      } else {
        setNotification({
          visible: true,
          success: false,
          message: "OTP is invalid",
          title: "OTP Error",
          duration : 1800,
        });
      }
    } catch (error) {
      setNotification({
        visible: true,
        success: false,
        message: "Internal Server Error",
        title: "An error has occured",
        duration : 1800,
      });
    }
    finally{
      setFullscreenLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!validatePassInput()) {
      return;
    }

    console.log(email, otp, password);

    setFullscreenLoading(true);
    setLoading(true);
    try {
      const resp = await fetch(API_BASE_URL + `/api/v1/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jwt-assertion": SYSTEM_TOKEN,
        },
        body: JSON.stringify({
          email,
          otp: Number(otp.join("")),
          password: password,
        }),
      });

      if (resp.ok) {
        const response = await resp.json();
        if (response) {
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

          if (resp2.ok) {
            const response2 = await resp2.json();
            const token = response2.token;

            const userProfile = await getUserProfileAPI(token);

            if (userProfile.user.mobileNumber) {
              const set = await setProfile(userProfile);
              if (set) {
                setShowPopUp(false);
                await storeToken(token);
                setNotification({
                  visible: true,
                  success: true,
                  title: "Login Successful",
                  message:
                    "Welcome to Pioneer. Your journey for finding the best university ends here",
                  duration : 1800,
                });
                // navigate('AUTHENTICATED');
              }
            } else {
              navigate("PENDINGPROFILE", { token: token } as never);
            }
          } else {
            setNotification({
              visible: true,
              success: false,
              title: "Login failed!",
              message: "OTP / Username / Password does not seem to match.",
              duration : 1800,
            });
          }
        } else {
          setNotification({
            visible: true,
            success: false,
            title: "An error occurred",
            message: "OTP did not match",
            duration: 2000,
          });
        }
      } else {
        const response = await resp.json();
        console.log(response);

        setNotification({
          visible: true,
          success: false,
          title: "An error occurred",
          message: response.message,
          duration: 2000,
        });
      }
    } catch (e) {
      console.log("Error", e);
      setNotification({
        visible: true,
        success: false,
        title: "Something went wrong",
        message: "An error has occured",
        duration: 2000,
      });
    } finally {
      setLoading(false);
      setFullscreenLoading(false);
      if (showPopUp) {
        setShowPopUp(false);
      }
    }
  };
  return (
    // <>
    //   <NoAuthLayout>
    //     <LogoBoxNoAuth />
    //     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' :undefined}>
    //       <View
    //         style={{
    //           ...LoginScreenStyles.FormBox,
    //           backgroundColor: THEME[theme].LoginFormBoxBackground,
    //         }}>
    //         <CustomText
    //           heading="Enter OTP"
    //           subHeading="We have sent you an OTP on your email"
    //           headingColor={THEME[theme].HeadingTextColor}
    //           subHeadingColor={THEME[theme].SubHeadingTextColor}
    //         />
    //         <HeightGap height={20} />
    //         <View
    //           style={{
    //             alignItems: 'center',
    //           }}>
    //           <View
    //             style={{
    //               width: 240,
    //               height: 200,
    //             }}>
    //             <ImageBackground
    //               source={require('../../assets/login/enter-otp.png')}
    //               style={{
    //                 flex: 1,

    //                 justifyContent: 'center',
    //                 borderRadius: 10,
    //                 overflow: 'hidden',
    //               }}
    //               resizeMode='cover'
    //             />
    //           </View>
    //         </View>
    //         <HeightGap height={20} />
    //         <InputTextField
    //           placeholder="Enter OTP"
    //           label="OTP (6 digit code)"
    //           isRequired={true}
    //           value={otp}
    //           maxLength={6}
    //           onChangeText={setOtp}
    //           keyboardType="numeric"
    //         />
    //         {errors.otp ? <ErrorMessage message={errors.otp} /> : null}
    //         <HeightGap height={20} />
    //         <CustomButton title="Next" background={THEME[theme].HeadingTextColor} onPress={preValidateOTP} />
    //       </View>
    //     </KeyboardAvoidingView>
    //   </NoAuthLayout>
    //   {/* {showPopUp && ( */}
    //   <Modal animationType="fade" transparent={true} visible={showPopUp}>
    //     <View
    //       style={{
    //         flex: 1,
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //         backgroundColor: 'rgba(0, 0, 0, 0.68)',
    //       }}>
    //       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    //         <View
    //           style={{
    //             width: 340,
    //             backgroundColor: '#ffffff',
    //             borderRadius: 20,
    //             marginHorizontal: 40,
    //             marginBottom: 40,
    //             paddingTop: 60,
    //             ...Platform.select({
    //               ios: {
    //                 shadowColor: '#000',
    //                 shadowOffset: {
    //                   width: 0,
    //                   height: 0,
    //                 },
    //                 shadowOpacity: 0.12,
    //                 shadowRadius: 4,
    //               },
    //               android: {
    //                 elevation: 10,
    //               },
    //             }),
    //           }}>
    //           <TouchableOpacity
    //             onPress={() => setShowPopUp(false)}
    //             style={{ position: 'absolute', alignSelf: 'flex-end', right: 14, top: 8 }}>
    //             <MaterialCommunityIcons name="close" color={THEME[theme].HeadingTextColor} size={28} />
    //           </TouchableOpacity>
    //           <View
    //             style={{
    //               position: 'absolute',
    //               top: 0,
    //               left: 0,
    //               right: 0,
    //               bottom: 0,
    //               justifyContent: 'center',
    //               alignItems: 'center',
    //               height: 80,
    //               marginTop: -40,
    //             }}>
    //             <View
    //               style={{
    //                 height: 80,
    //                 width: 80,
    //                 borderRadius: 80,
    //                 backgroundColor: '#EAF8F4',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //               }}>
    //               <Ionicons name="water-outline" size={24} color={THEME[theme].HeadingTextColor} />
    //             </View>
    //           </View>
    //           <View style={{ paddingHorizontal: 20 }}>
    //             <InputTextField
    //               placeholder="***************"
    //               label="Set your password"
    //               isRequired={true}
    //               value={password}
    //               onChangeText={setPassword}
    //               isPasswordSecure={true}
    //             />
    //             {errors.password ? <ErrorMessage message={errors.password} /> : null}
    //             <HeightGap height={10} />
    //             <InputTextField
    //               placeholder="***************"
    //               label="Confirm password"
    //               isRequired={true}
    //               value={confirmPassword}
    //               onChangeText={setConfirmPassword}
    //               isPasswordSecure={true}
    //             />
    //             {errors.confirmPassword ? <ErrorMessage message={errors.confirmPassword} /> : null}
    //             <HeightGap height={20} />
    //           </View>
    //           <TouchableOpacity
    //             onPress={() => {
    //               verifyOtp();
    //             }}
    //             disabled={loading}>
    //             <View
    //               style={{
    //                 backgroundColor: loading ? '#f0f0f0' : THEME[theme].HeadingTextColor,
    //                 paddingHorizontal: 16,
    //                 paddingVertical: 20,
    //                 borderBottomLeftRadius: 20,
    //                 borderBottomRightRadius: 20,
    //               }}>
    //               <Text
    //                 style={{
    //                   color: loading ? '#cfcfcf' : 'white',
    //                   fontFamily: 'SemiBold',
    //                   fontSize:RFValue(16),
    //                   textAlign: 'center',
    //                   textTransform: 'uppercase',
    //                 }}>
    //                 {loading ? 'Confirming...' : 'Confirm'}
    //               </Text>
    //             </View>
    //           </TouchableOpacity>
    //         </View>
    //       </KeyboardAvoidingView>
    //     </View>
    //   </Modal>
    //   {/* )} */}
    // </>

    <View style={styles.container}>
      <LogoBoxNoAuth />
      {showPopUp && (
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
              behavior={Platform.OS === "ios" ? "padding" : undefined}
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
                    color={THEME[theme].disabled}
                    size={28}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 80,
                    marginTop: -40,
                  }}
                >
                  {/* <View
                    style={{
                      height: 80,
                      width: 80,
                      borderRadius: 80,
                      backgroundColor: "#EAF8F4",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="water-outline"
                      size={24}
                      color={THEME[theme].HeadingTextColor}
                    />
                  </View> */}
                </View>
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
      )}

      <View style={styles.content}>
        <CustomText style={styles.title} heading="Verify your email" />

        <CustomText
          style={styles.subtitle}
          subHeading="A code is sent to your email, please check your email"
        />

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
        <HeightGap height={10} />

        {/* <View style={styles.resendContainer}>
          <CustomText
            style={styles.resendText}
            subHeading={`An OTP has been sent to your number.\nDidn't receive the code.`}
          />

          <TouchableOpacity>
            <CustomText style={styles.resendLink} heading="Resend" />
          </TouchableOpacity>
        </View> */}

        <TouchableOpacity
          style={[
            styles.verifyButton,
            { backgroundColor: THEME[theme].primary },
          ]}
          onPress={preValidateOTP}
        >
          <CustomText style={styles.verifyButtonText} heading="Verify" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EnterOTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  content: {
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  title: {
    fontSize: RFValue(24),
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize:RFValue(14),
    color: "#666",
    marginBottom: 32,
    lineHeight: 20,
  },
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
  resendContainer: {
    // alignItems: 'center',
    marginBottom: 32,
    marginTop: 12,
  },
  resendText: {
    fontSize:RFValue(14),
    color: "#666",
    // textAlign: 'center',
    lineHeight: 20,
  },
  resendLink: {
    color: "#13478b",
    fontSize:RFValue(14),
    textAlign: "right",
    marginLeft: "auto",
  },
  verifyButton: {
    // backgroundColor: "#13478b",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize:RFValue(16),
    fontWeight: "600",
  },
});
