import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { FC, useState } from "react";
import { useUI } from "@context/UIContext";
import { THEME } from "@utils/ui";
import CustomText from "@components/CustomText";
import HeightGap from "@components/HeightGap";
import InputTextField from "@components/InputTextField";
import ErrorMessage from "@components/ErrorMessage";
import CustomButton from "@components/CustomButton";
import { NoAuthLayout } from "@context/NoAuthLayout";
import LogoBoxNoAuth from "@components/LogoBoxNoAuth";
import { LoginScreenStyles } from "@styles/login-screen";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "@utils/constant";
import { getUserProfileAPI } from "@utils/services";
import { useAuth } from "@context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const PendingProfile: FC = ({ route }: any) => {
  const { theme, setFullscreenLoading, setNotification } = useUI();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [mobileNumber, setmobileNumber] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState<any>({});
  const { navigate } = useNavigation();
  const { clearToken, setProfile, storeToken } = useAuth();
  // console.log(route);

  const verifyInput = () => {
    let valid = true;
    let tempError: any = {};

    // Regular expression to ensure the phone number contains only digits
    const numericPattern = /^[0-9]+$/;

    if (name.trim() === "") {
      tempError.name = "Name is required.";
      valid = false;
    }

    if (mobileNumber.trim() === "") {
      tempError.phoneNo = "Mobile number is required.";
      valid = false;
    } else if (!numericPattern.test(mobileNumber)) {
      tempError.phoneNo = "Mobile number should contain only digits.";
      valid = false;
    } else if (mobileNumber.trim().length !== 10) {
      tempError.phoneNo = "Mobile number should be exactly 10 digits.";
      valid = false;
    }

    if (state.trim() === "") {
      tempError.state = "State is required.";
      valid = false;
    }
    // if (country.trim() === "") {
    //   tempError.country = "Country is required.";
    //   valid = false;
    // }

    setErrors(tempError);
    return valid;
  };

  const handleSubmit = async () => {
    if (!verifyInput()) {
      return;
    }
    setFullscreenLoading(true);
    try {
      const resp = await fetch(API_BASE_URL + "/api/v1/auth/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${route.params.token}`,
        },
        body: JSON.stringify({
          name,
          mobileNumber,
          country,
          state,
        }),
      });

      const data = await resp.json();
      if (resp.ok) {
        console.log(data);
        const userProfile = await getUserProfileAPI(route.params.token);
        // console.log('my otk',token);

        if (userProfile) {
          setProfile(userProfile);
          storeToken(route.params.token);
        } else {
          clearToken();
        }
      } else {
        console.log("fsfa", data);

        setNotification({
          visible: true,
          success: false,
          title: "Update failed!",
          message:
            "Could not update your profile at the moment, please try again later",
          duration: 1800,
        });
      }
    } catch (e) {
      console.log("Error Updating Pending Profile", e);
      setNotification({
        visible: true,
        success: false,
        title: "An error occurred",
        message:
          "Could not update your profile at the moment, please try again later",
        duration: 2000,
      });
    } finally {
      setFullscreenLoading(false);
    }
  };

  return (
    <View style={{ flex: 1,  padding: 16,backgroundColor:'#ffffff' }}>
      <View style={{ justifyContent: "center" }}>
        <LogoBoxNoAuth />
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          // padding: 16,
        }}
      >
        <CustomText
          heading="Complete Profile"
          subHeading="Complete your profile to use the app."
          headingColor={THEME[theme].primary}
          subHeadingColor={THEME[theme].SubHeadingTextColor}
        />

        <HeightGap height={20} />
        <InputTextField
          placeholder="Eg: John Doe"
          label="Enter your name"
          isRequired={true}
          value={name}
          onChangeText={setName}
        />
        {errors.name ? <ErrorMessage message={errors.name} /> : null}
        <HeightGap height={10} />
        <InputTextField
          placeholder="Eg: 987654321"
          label="Mobile number"
          isRequired={true}
          value={mobileNumber}
          onChangeText={setmobileNumber}
          keyboardType="numeric"
          maxLength={10}
        />
        {errors.phoneNo ? <ErrorMessage message={errors.phoneNo} /> : null}
        <HeightGap height={10} />
        <InputTextField
          placeholder="Eg: Uttar Pradesh"
          label="State"
          isRequired={true}
          value={state}
          onChangeText={setState}
        />
        {errors.state ? <ErrorMessage message={errors.state} /> : null}
        <HeightGap height={20} />
        {/* <InputTextField
              placeholder="Eg: India"
              label="Country"
              isRequired={true}
              value={country}
              onChangeText={setCountry}
            />
            {errors.country ? <ErrorMessage message={errors.country} /> : null}
            <HeightGap height={20} /> */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* <View
                style={{
                  flex: 1,
                }}
              > */}
          {/* <TouchableOpacity onPress={() => navigate('LOGIN')}>
                  <Text
                    style={{
                      color: THEME[theme].HeadingTextColor,
                      fontFamily: 'NunitoSans_400Regular',
                      fontsize:RFValue(16),
                      textAlign: 'right',
                    }}>
                    Go Back
                  </Text>
                </TouchableOpacity> */}
          {/* </View> */}
        </View>
        <CustomButton
          title="Submit"
          background={THEME[theme].primary}
          onPress={handleSubmit}
          style={{ marginTop: "auto" }}
        />
        <HeightGap height={20} />
      </ScrollView>
    </View>
  );
};

export default PendingProfile;
