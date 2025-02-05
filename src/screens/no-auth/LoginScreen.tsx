import React, { useState, useEffect, FC } from "react";
import { NoAuthLayout } from "@context/NoAuthLayout";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useAuth } from "@context/AuthContext";
import InputTextField from "@components/InputTextField";
import { LoginScreenStyles } from "@styles/login-screen";
import HeightGap from "@components/HeightGap";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";

import { useNavigation } from "@react-navigation/native";
import LogoBoxNoAuth from "@components/LogoBoxNoAuth";
import ErrorMessage from "@components/ErrorMessage";
import CustomText from "@components/CustomText";
import CustomButton from "@components/CustomButton";
import { decodeRolesFromToken } from "@utils/helpers";
import { getUserProfileAPI } from "@utils/services";
// import { decodeRolesFromToken } from '../../utils/helpers';
import { RFValue } from "react-native-responsive-fontsize";


const LoginScreen: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token, storeToken, profile, setProfile } = useAuth();
  const { theme, setFullscreenLoading, setNotification } = useUI();
  const { navigate } = useNavigation<any>();
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (token && profile) {
      navigate("AUTHENTICATED" as never);
    }
  }, [token]);

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
    if (password.trim() === "") {
      tempErrors.password = "Password is required.";
      valid = false;
    } else if (password.length < 6) {
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
        console.log('sfsafsaf',response);
        if (response.token) {
          const token = response.token;

          const role = decodeRolesFromToken(token);
          console.log('role is',role);
          

          if (role === "REGULAR_USER") {
            await storeToken(token);
            console.log('sfjkashfjkshakjfhsajkf');
            
            const userProfile = await getUserProfileAPI(token);
            console.log(userProfile);
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
                duration : 1800,
              });
            }
          }
          else if(role==='ADMIN'){
            await storeToken(token);
            console.log('askfjsajkfjsahjfhksajfhjksfjafhjehfef');
            
            const userProfile = await getUserProfileAPI(token);
            if(userProfile){
              setProfile(userProfile);
              console.log('sdsad')
            }
            else{
              console.error("Error")
            }
          }
          else {
            setNotification({
              visible: true,
              success: false,
              title: "Invalid credentials",
              message:
                "You do not have the required permissions to access this application.",
              duration : 1800,
            });
          }
        }
      } else {
        setNotification({
          visible: true,
          success: false,
          title: "Login failed!",
          message: "Email / Password does not seem to match.",
          duration : 1800,
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

  return (
    // <View style={{flex:1,justifyContent:'flex-end',backgroundColor:THEME[theme].background}}>
    //   <LogoBoxNoAuth />
    //   <KeyboardAvoidingView
    //     behavior={Platform.OS === "ios" ? "padding" : undefined}
    //   >
    //     <View
    //       style={{
    //         ...LoginScreenStyles.FormBox,
    //         backgroundColor: THEME[theme].background,
    //       }}
    //     >
    //       <CustomText
    //         heading="Sign In"
    //         subHeading="Please sign in to access your account"
    //         headingColor={THEME[theme].text.primary}
    //         subHeadingColor={THEME[theme].SubHeadingTextColor}
    //       />

    //       {/* <HeightGap height={20} /> */}
    //       {/* <View
    //         style={{
    //           alignItems: "center",
    //         }}
    //       >
    //         <View
    //           style={{
    //             width: 220,
    //             height: 96,
    //           }}
    //         >
    //           <ImageBackground
    //             source={require("@assets/logo2.png")}
    //             style={{
    //               flex: 1,
    //               justifyContent: "center",
    //               borderRadius: 10,
    //             }}
    //             resizeMode="contain"
    //           />
    //         </View>
    //       </View> */}
    //       <HeightGap height={10} />
    //       <InputTextField
    //         placeholder="Enter your email"
    //         value={email}
    //         placeholderTextColor={THEME[theme].inputPlaceholderColor}
    //         onChangeText={setEmail}
    //       />
    //       {errors.email ? <ErrorMessage message={errors.email} /> : null}
    //       <HeightGap height={5} />
    //       <InputTextField
    //         placeholder="Enter your password"
    //         value={password}
    //         onChangeText={setPassword}
    //         placeholderTextColor={THEME[theme].inputPlaceholderColor}
    //         isPasswordSecure={true}
    //         textContentType="oneTimeCode"
    //       />
    //       {errors.password ? <ErrorMessage message={errors.password} /> : null}
    //       <HeightGap height={20} />
    //       <View
    //         style={{
    //           flexDirection: "row",
    //           alignItems: "center",
    //         }}
    //       >
    //         <View
    //           style={{
    //             flex: 1,
    //           }}
    //         >
    //           <TouchableOpacity
    //             onPress={() => navigate("REGISTERSCREEN" as never)}
    //           >
    //             <Text
    //               style={{
    //                 color: THEME[theme].text.primary,
    //                 fontFamily: "Regular",
    //                 fontSize:RFValue(16),
    //               }}
    //             >
    //               Register now
    //             </Text>
    //           </TouchableOpacity>
    //         </View>
    //         <View>
    //           <TouchableOpacity
    //             onPress={() => navigate("FORGOTPASSWORD" as never)}
    //           >
    //             <Text
    //               style={{
    //                 color: THEME[theme].text.primary,
    //                 fontFamily: "Regular",
    //                 fontSize:RFValue(16),
    //               }}
    //             >
    //               Forgot password?
    //             </Text>
    //           </TouchableOpacity>
    //         </View>
    //       </View>
    //       <HeightGap height={20} />
    //       <CustomButton
    //         title="Sign In"
    //         background={THEME[theme].primary}
    //         onPress={handleLogin}
    //       />
    //     </View>
    //   </KeyboardAvoidingView>
    //   </View>
    
    <View style={styles.container}>
      <LogoBoxNoAuth />
      <View style={styles.content}>
        <CustomText style={styles.title} heading="Sign In" />
        <CustomText
          style={styles.subtitle}
          subHeading="Please sign in to access your account"
        />

        <View style={styles.form}>
          <InputTextField
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
          />
          {errors.email ? <ErrorMessage message={errors.email} /> : null}
          <InputTextField
            placeholder="Password"
            isPasswordSecure={true}
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            textContentType="oneTimeCode"
          />
          {errors.password ? <ErrorMessage message={errors.password} /> : null}

          <View style={styles.rowContainer}>
            <TouchableOpacity
              onPress={() => navigate("FORGOTPASSWORD" as never)}
            >
              <CustomText
                subHeadingColor={styles.forgotPassword.color}
                subHeading="Forgot Password?"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
            <CustomText style={styles.signInButtonText} heading="Sign In" />
          </TouchableOpacity>

          {/* <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <CustomText style={styles.dividerText} subHeading="or continue with"/>
            <View style={styles.divider} />
          </View> */}

          {/* <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>in</Text>
            </TouchableOpacity>
          </View> */}

          <View style={styles.signUpContainer}>
            <CustomText
              style={styles.signUpText}
              subHeading="Don't have and account? "
            />
            <TouchableOpacity
              onPress={() => navigate("REGISTERSCREEN" as never)}
            >
              <CustomText style={styles.signUpLink} heading="Sign Up" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: RFValue(24),
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize:RFValue(14),
    color: "#666",
  },
  form: {
    // gap: 16,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize:RFValue(16),
    color: "#000",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 14,
  },
  rowContainer: {
    flexDirection: "row",
    marginVertical: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  checked: {
    backgroundColor: "#13478b",
    borderColor: "#13478b",
  },
  checkboxLabel: {
    fontSize:RFValue(14),
    color: "#666",
  },
  forgotPassword: {
    // fontSize:RFValue(14),
    color: "#666",
  },
  signInButton: {
    backgroundColor: "#13478b",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  signInButtonText: {
    color: "#fff",
    fontSize:RFValue(16),
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    color: "#666",
    fontSize:RFValue(14),
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  socialButtonText: {
    fontSize:RFValue(16),
    color: "#666",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signUpText: {
    fontSize:RFValue(14),
    color: "#666",
  },
  signUpLink: {
    fontSize:RFValue(14),
    color: "#13478b",
  },
});
