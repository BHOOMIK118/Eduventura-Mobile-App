import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { FC, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useUI } from "@context/UIContext";
import { API_BASE_URL, ROLE_ID_USER, SYSTEM_TOKEN } from "@utils/constant";
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


const RegisterScreen: FC = () => {
  const { theme, setFullscreenLoading, setNotification } = useUI();
  const { navigate } = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<any>({});

  const validateInput = () => {
    let valid = true;
    let tempErrors: any = {};

    if (email.trim() === "") {
      tempErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email) || /^$|\s+/.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
      valid = false;
    }
    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = async () => {
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
        navigate("ENTEROTP",{email:email,screenName:"REGISTERSCREEN"});
      } else {
        console.log("response is ", response);

        setNotification({
          title: "Register Status",
          message: "Email already exists",
          duration : 1800,
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
    // <View style={{flex:1,justifyContent:'flex-end',backgroundColor:THEME[theme].background}}>
    //   <LogoBoxNoAuth />
    //   <KeyboardAvoidingView
    //     behavior={Platform.OS === "ios" ? "padding" : undefined}
    //   >
    //     <View
    //       style={{
    //         ...LoginScreenStyles.FormBox,
    //         backgroundColor: THEME[theme].LoginFormBoxBackground,
    //       }}
    //     >
    //       <CustomText
    //         heading="Register"
    //         subHeading="Create a new account."
    //         headingColor={THEME[theme].text.primary}
    //         subHeadingColor={THEME[theme].SubHeadingTextColor}
    //       />
    //       <HeightGap height={20} />
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
    //       </View>
    //       <HeightGap height={20} /> */}
    //       <InputTextField
    //         placeholder="Eg: john.doe@gmail.com"
    //         label="Email"
    //         // isRequired={true}
    //         value={email}
    //         onChangeText={setEmail}
    //       />
    //       {errors.email ? <ErrorMessage message={errors.email} /> : null}
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
    //             onPress={() => navigate("LOGINSCREEN" as never)}
    //           >
    //             <Text
    //               style={{
    //                 color: THEME[theme].primary,
    //                 fontFamily: "Medium",
    //                 fontSize:RFValue(16),
    //               }}
    //             >
    //               Account login
    //             </Text>
    //           </TouchableOpacity>
    //         </View>
    //         <View>
    //           <TouchableOpacity
    //             onPress={() => navigate("FORGOTPASSWORD" as never)}
    //           >
    //             <Text
    //               style={{
    //                 color: THEME[theme].primary,
    //                 fontFamily: "Medium",
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
    //         title="Register"
    //         background={THEME[theme].primary}
    //         onPress={handleSubmit}
    //       />
    //     </View>
    //   </KeyboardAvoidingView>
    //   </View>


    <View style={styles.container}>
      <LogoBoxNoAuth />
      <View style={styles.content}>
        <CustomText style={styles.title} heading="Create an account" />
        <CustomText
          style={styles.subtitle}
          subHeading="Register with your email"
        />

        <View style={styles.form}>
          <InputTextField
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
          />
          {errors.email ? <ErrorMessage message={errors.email} /> : null}
          

          <View style={styles.rowContainer}>
            {/* <TouchableOpacity
              onPress={() => navigate("LOGINSCREEN" as never)}
            >
              <CustomText
                subHeadingColor={styles.forgotPassword.color}
                subHeading="Account login?"
              />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => navigate("FORGOTPASSWORD" as never)}
            >
              <CustomText
                subHeadingColor={styles.forgotPassword.color}
                subHeading="Forgot Password?"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signInButton} onPress={handleSubmit} >
            <CustomText style={styles.signInButtonText} heading="Sign Up" />
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
              subHeading="Already have an account? "
            />
            <TouchableOpacity
              onPress={() => navigate("LOGINSCREEN" as never)}
            >
              <CustomText style={styles.signUpLink} heading="Sign In" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;
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
