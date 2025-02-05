import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import CustomButton from "./CustomButton";
import { prettier } from "@utils/helpers";
import { THEME } from "@utils/ui";
import DropDownPicker from "react-native-dropdown-picker";
import CustomText from "./CustomText";
import InputTextField from "./InputTextField";
import CountryPicker from "react-native-country-picker-modal";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScrollView } from "react-native-gesture-handler";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { getUserProfileAPI } from "@utils/services";
import { RFValue } from "react-native-responsive-fontsize";


const BasicInformation = () => {
  const { profile, token, setProfile } = useAuth();
  const { setFullscreenLoading, theme, setNotification } = useUI();
  const navigation = useNavigation();

  const [profileImage, setProfileImage] = useState<string | null>(
    profile?.user?.profile?.profilePictureUrl || null
  );
  const [formData, setFormData] = useState({
    mobileNumber: profile?.user?.mobileNumber || "",
    country: profile?.user?.country || "IN",
    // country: "IN",
    state: profile?.user?.state || "",
    name: profile?.user?.name || "",
    bio: profile?.user?.profile?.bio || "",
    interests: profile?.user?.profile?.interests || [],
    profilePictureUrl: profile?.user?.profile?.profilePictureUrl || "",
    gender: profile?.user?.profile?.gender || null,
    dateOfBirth: profile?.user?.profile?.dateOfBirth || new Date(),
    maritalStatus: profile?.user?.profile?.maritalStatus || null,
  });
  const [genderOpen, setGenderOpen] = useState(false);

  const genderOptions = useMemo(
    () => [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Other", value: "Other" },
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const interestsOptions = [
    { label: "Coding", value: "Coding" },
    { label: "Reading", value: "Reading" },
    { label: "Sports", value: "Sports" },
    { label: "Music", value: "Music" },
  ];
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  const [maritalStatusOpen, setMaritalStatusOpen] = useState(false);

  const [showDatePicker, setDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {setDatePicker(false)
      return;
    };
    const current = selectedDate || new Date();
    setDatePicker(false);
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: current,
    }));
  };

  const maritalStatusOptions = useMemo(
    () => [
      { label: "Single", value: "Single" },
      { label: "Married", value: "Married" },
      { label: "Divorced", value: "Divorced" },
      { label: "Widowed", value: "Widowed" },
    ],
    []
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      handleUpload(result.assets[0].uri);
    }
  };

  const handleUpload = async (imageURI: string) => {
    if (!imageURI) {
      setNotification({
        visible: true,
        success: false,
        message: "No image selected to upload.",
        title: "Upload Error",
        duration: 1800,
      });
      return;
    }

    try {
      const imageFormData:any = new FormData();
      imageFormData.append("image", {
        uri: imageURI,
        type: "image/jpeg",
        name: "profile.jpg",
      });

      const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
        method: "POST",
        headers: {
          "x-jwt-assertion": SYSTEM_TOKEN,
        },
        body: imageFormData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Image uploaded successfully:", data);
        setUploadedPhoto(data.url);
        // setNotification({
        //   visible: true,
        //   success: true,
        //   message: "Image uploaded successfully.",
        //   title: "Upload Status",
        //   duration : 1800,
        // });
      } else {
        console.error("Image upload failed:", data);
        setNotification({
          visible: true,
          success: false,
          message: "Image could not be uploaded",
          title: "Upload Status",
          duration: 1800,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setNotification({
        visible: true,
        success: false,
        message: "Internal Server Error",
        title: "Upload Status",
        duration: 1800,
      });
    } finally {
      // setFullscreenLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setFullscreenLoading(true);
      const updatedFormData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth,
        profilePictureUrl: uploadedPhoto || formData.profilePictureUrl,
      };
      console.log("my data", updatedFormData);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/updateProfile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        const response2 = await getUserProfileAPI(token);
        if (response2) {
          setProfile(response2);
          console.log("Profile updated successfully:", data);
          setNotification({
            visible: true,
            success: true,
            message: "Profile updated successfully.",
            title: "Update Status",
            duration: 1800,
          });
        }
        else{
          console.warn('failed to update profile',response)
        }
      } else {
        console.warn("Profile update failed:", data);
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setFullscreenLoading(false);
    }
  };

  console.log('my interest are',formData.interests)
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 8,
        backgroundColor:'#ffffff'
        // paddingBottom: tabBarHeight,
      }}
    >
      {/* Profile Image */}
      <View style={styles.profileImageSection}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {profileImage ? (
            <Image
              source={{
                uri: profileImage,
              }}
              style={[
                styles.profileImage,
                { borderColor: THEME[theme].inputTextColor, borderWidth: 1 },
              ]}
            />
          ) : (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={100}
              color={THEME[theme].disabled}
            />
          )}
          <View style={styles.cameraButton}>
            <Camera size={20} color="#666" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, padding: 16, gap: 16 }}>
        <View style={{ gap: 4 }}>
          <InputTextField
            label="Name"
            isRequired={true}
            value={formData?.name}
            onChangeText={(name) =>
              setFormData((prev) => ({ ...prev, name: name }))
            }
          />
          <CustomText
            subHeading="As per your passport or ID proof"
            subHeadingFontSize={12}
            subHeadingColor={THEME[theme].text.secondary}
          />
        </View>
        {/* Gender Dropdown */}
        <View style={{ gap: 6 }}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

          <CustomText
            subHeading="Gender"
            style={{
              color: THEME[theme].inputTextColor,
              fontFamily: "Regular",
              fontSize:RFValue(14),
              lineHeight: 22,
            }}
            />
          <CustomText
            subHeading="*"
            style={{
              color: 'red',
              fontFamily: "Regular",
              fontSize:RFValue(14),
              lineHeight: 22,
            }}
            />
            </View>
          <DropDownPicker
            open={genderOpen}
            value={formData.gender}
            textStyle={{ color: THEME[theme].text.secondary }}
            items={genderOptions}
            containerProps={{ style: { height: genderOpen ? 180 : null } }}
            setOpen={setGenderOpen}
            placeholderStyle={{
              color: THEME[theme].inputTextColor,
              fontFamily: "Regular",
              fontSize:RFValue(16),
              lineHeight: 22,
            }}
            setValue={(callback) => {
              const newValue = callback(formData.gender);
              setFormData((prev) => ({ ...prev, gender: newValue }));
            }}
            placeholder="Select Gender"
            style={[
              styles.dropdown,
              { borderColor: THEME[theme].inputTextFieldBorderColor },
            ]}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>

        <View style={{ gap: 6 }}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

          <CustomText
            subHeading="Marital Status"
            style={{
              color: THEME[theme].inputTextColor,
              fontFamily: "Regular",
              fontSize:RFValue(14),
              lineHeight: 22,
            }}
          />
          <CustomText
            subHeading="*"
            style={{
              color: 'red',
              fontFamily: "Regular",
              fontSize:RFValue(14),
              lineHeight: 22,
            }}
          />
          </View>
          <DropDownPicker
            open={maritalStatusOpen}
            value={formData.maritalStatus}
            items={maritalStatusOptions}
            textStyle={{ color: THEME[theme].text.secondary }}
            containerProps={{
              style: { height: maritalStatusOpen ? 220 : null },
            }}
            setOpen={setMaritalStatusOpen}
            setValue={(callback) => {
              const newValue = callback(formData.maritalStatus);
              setFormData((prev) => ({ ...prev, maritalStatus: newValue }));
            }}
            placeholder="Select Marital Status"
            placeholderStyle={{
              color: THEME[theme].inputTextColor,
              fontFamily: "Regular",
              fontSize:RFValue(16),
              lineHeight: 22,
            }}
            style={[
              styles.dropdown,
              { borderColor: THEME[theme].inputTextFieldBorderColor },
            ]}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>

        <View style={{ gap: 6 }}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

          <CustomText
            subHeading="Date of Birth"
            style={{
              color: THEME[theme].inputTextColor,
              fontFamily: "Regular",
              fontSize:RFValue(14),
              lineHeight: 22,
            }}
          />
          <CustomText
            subHeading="*"
            style={{
              color: 'red',
              fontFamily: "Regular",
              fontSize:RFValue(14),
              lineHeight: 22,
            }}
          />
          </View>
          <TouchableOpacity
            onPress={() => setDatePicker(true)}
            style={styles.datePickerButton}
          >
            <CustomText
              style={{
                color: THEME[theme].inputTextColor,
                fontFamily: "Regular",
                fontSize:RFValue(14),
                lineHeight: 22,
              }}
              subHeading={
                formData.dateOfBirth
                  ? new Date(formData.dateOfBirth).toDateString()
                  : "Select Date"
              }
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date(formData?.dateOfBirth) || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <InputTextField
          label="Mobile Number"
          isRequired={true}
          value={formData.mobileNumber}
          onChangeText={(number) => {
            const filteredNumber = number.replace(/[^0-9]/g, "");
            setFormData((prev) => ({
              ...prev,
              mobileNumber: filteredNumber,
            }));
          }}
          keyboardType="numeric"
          maxLength={10}
        />
        <View style={{ gap: 6 }}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

          <CustomText
            subHeading="Country"
            style={{
              color: THEME[theme].inputTextColor,
              fontFamily: "Regular",
              fontSize:RFValue(14),
              lineHeight: 22,
            }}
          />
          <CustomText
            subHeading="*"
            style={{
              color: 'red',
              fontFamily: "Regular",
              fontSize:RFValue(14),
              lineHeight: 22,
            }}
          />
          </View>
          <CountryPicker
            withFilter
            withFlag
            countryCode={formData.country || "IN"}
            withCountryNameButton
            withCloseButton
            containerButtonStyle={[styles.countryPickerButton]}
            withCallingCode={false}
            theme={{
              fontFamily: "Regular",
              fontSize:RFValue(16),
              onBackgroundTextColor: THEME[theme].inputTextColor,
            }}
            withCallingCodeButton={false}
            withCurrency={false}
            withCurrencyButton={false}
            onSelect={(country) => {
              console.log(country);
              setFormData((prev) => ({
                ...prev,
                country: country.cca2, // Store only the country code
              }));
            }}
          />
        </View>

        <InputTextField
          label="State"
          value={formData.state}
          isRequired={true}
          onChangeText={(state) =>
            setFormData((prev) => ({ ...prev, state: state }))
          }
        />

        <InputTextField
          label="Bio"
          value={formData.bio}
          placeholder="Enter your Bio"
          onChangeText={(bio) => setFormData((prev) => ({ ...prev, bio: bio }))}
        />
        <View style={{ gap: 6 }}>
          <CustomText
            subHeading="Interests"
            style={{
              color: THEME[theme].inputTextColor,
              fontFamily: "Regular",
              fontSize:RFValue(14),
              lineHeight: 22,
            }}
          />

          <DropDownPicker
            open={open}
            value={formData.interests || []}
            items={interestsOptions}
            containerProps={{
              style: { height: open ? 260 : null },
            }}
            setOpen={setOpen}
            setValue={(newValue) => {
              console.log('New value:', newValue);
              setFormData((prev) => ({
                ...prev,
                interests: typeof newValue === 'function' ? newValue(prev.interests) : newValue,
              }));
            }}
            placeholder="Select Interests"
            placeholderStyle={{
              color: THEME[theme].inputTextColor,
              fontFamily: "Regular",
              fontSize:RFValue(14),
              lineHeight: 22,
            }}
            multiple={true}
            mode="BADGE"
            min={0}
            max={5}
            style={[
              styles.dropdown,
              { borderColor: THEME[theme].inputTextFieldBorderColor },
            ]}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>

        <CustomButton
          title="Update Profile"
          onPress={() => {
            prettier("form", formData);
            handleUpdate();
          }}
          background={THEME[theme].primary}
        />
      </View>
    </ScrollView>
  );
};

export default BasicInformation;

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    //   justifyContent: "center",
    padding: 16,
    // alignItems: "center",
    backgroundColor: "white",
  },
  contentText: {
    fontSize: RFValue(18),
    textAlign: "center",
    marginVertical: 10,
    color: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  countryPickerButton: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize:RFValue(16),
    fontWeight: "bold",
    marginBottom: 8,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize:RFValue(16),
    color: "#333",
  },
  profileImageSection: {
    alignItems: "center",
    marginVertical: 16,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
  },
  dropdown: {
    borderColor: "#ccc",
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  customTabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingHorizontal: 10,
  },
  customTabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  customTabItemFocused: {
    backgroundColor: "#f0e6ff",
  },
  customTabText: {
    fontSize: RFValue(12),
    fontWeight: "600",
    color: "gray",
  },
  customTabTextFocused: {
    color: "gray",
  },
});
