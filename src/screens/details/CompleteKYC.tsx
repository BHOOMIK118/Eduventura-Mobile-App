import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useMemo, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomText from "@components/CustomText";
import { THEME } from "@utils/ui";
import DropDownPicker from "react-native-dropdown-picker";
import CustomButton from "@components/CustomButton";
import InputTextField from "@components/InputTextField";
import { ScrollView } from "react-native-gesture-handler";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";
import { RFValue } from "react-native-responsive-fontsize";

// import * as ImagePicker from "expo-image-picker";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import DateTimePicker from "@react-native-community/datetimepicker";
import Separator from "@components/Separator";
import { prettier } from "@utils/helpers";

const CompleteKYC: FC = () => {
  const { profile, token, kycDetails } = useAuth();
  const params = useRoute();
  const { courseData }: any = params.params;

  const { setFullscreenLoading, theme, setNotification } = useUI();
  const navigation = useNavigation();

  // const [certificateImage, setCertificateImage] = useState<any>({
  //   uri: null,
  //   name: null,
  // });

  const dependentsOptions = useMemo(
    () => [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    []
  );

  const [formData, setFormData] = useState({
    profile: {
      // gender: profile?.user?.profile[0]?.gender,
      // dateOfBirth: profile?.user?.profile[0]?.dateOfBirth,
      // maritalStatus: profile?.user?.profile[0]?.maritalStatus,
      dependents: "",
      visaStatus: "",
      disqualificationStatus: "",
    },
    // educationHistory: [
    //   {
    //     certification: "",
    //     degree: "",
    //     percentage: 0,
    //     yearOfPassing: 0,
    //     majorSubjects: "",
    //     backlogs: 0,
    //   },
    // ],
    // workExperience: [
    //   {
    //     workplaceName: "",
    //     from: "",
    //     to: "",
    //     jobProfile: "",
    //   },
    // ],
    // languageProficiency: [
    //   {
    //     testName: "",
    //     dateOfTest: "",
    //     individualBand: 90,
    //     overallBand: 0,
    //   },
    // ],
    financialDetails: [
      {
        totalFamilyIncome: 0,
        sponsors: "",
        fundAvailable: 0,
      },
    ],
    // studyPreferences: [
    //   {
    //     preferredCountry: courseData?.university?.postalAddressState,
    //     preferredUniversity: courseData?.university?.cricosProviderCode,
    //     preferredCollege: courseData?.university?.institutionName,
    //     coursePreference: courseData?.cricosCourseCode,
    //   },
    // ],
  });
  const visaOptions = useMemo(
    () => [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    []
  );

  // const [showFromDatePicker, setFromDatePicker] = useState(false);
  // const [showTestDatePicker, setTestDatePicker] = useState(false);
  // const [showToDatePicker, setToDatePicker] = useState(false);
  const disqualificationOptions = useMemo(
    () => [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    []
  );
  // const degreeOptions = useMemo(
  //   () => [
  //     { label: "Masters", value: "Masters" },
  //     { label: "Bachelors", value: "Bachelors" },
  //     { label: "Phd", value: "Phd" },
  //   ],
  //   []
  // );

  const [dependentsOpen, setDependentsOpen] = useState(false);

  const [disqualificationOpen, setDisqualificationOpen] = useState(false);

  const [visaOpen, setVisaOpen] = useState(false);

  // const [degreeOpen, setDegreeOpen] = useState(false);

  // const pickImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setCertificateImage({
  //       uri: result.assets[0].uri,
  //       name: result.assets[0].fileName,
  //     });
  //     console.log("dss", {
  //       uri: result.assets[0].uri,
  //       name: result.assets[0].fileName,
  //     });

  //     handleUpload(result.assets[0].uri);
  //   }
  // };

  // const handleUpload = async (imageURI: string) => {
  //   if (!imageURI) {
  //     setNotification({
  //       visible: true,
  //       success: false,
  //       message: "No image selected to upload.",
  //       title: "Upload Error",
  //       duration: 1800,
  //     });
  //     return;
  //   }

  //   try {
  //     const imageFormData:any = new FormData();
  //     imageFormData.append("image", {
  //       uri: imageURI,
  //       type: "image/jpeg",
  //       name: "profile.jpg",
  //     });

  //     const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
  //       method: "POST",
  //       headers: {
  //         "x-jwt-assertion": SYSTEM_TOKEN,
  //       },
  //       body: imageFormData,
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       console.log("Image uploaded successfully:", data);
  //       setCertificateImage((prev) => ({
  //         ...prev,
  //         uri: data?.url || "",
  //       }));
  //       setFormData((prev) => ({
  //         ...prev,
  //         educationHistory: prev.educationHistory.map((entry, index) =>
  //           index === 0 ? { ...entry, certification: data?.url || "" } : entry
  //         ),
  //       }));
  //     } else {
  //       console.error("Image upload failed:", data);
  //       setNotification({
  //         visible: true,
  //         success: false,
  //         message: "Image could not be uploaded",
  //         title: "Upload Status",
  //         duration: 1800,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     setNotification({
  //       visible: true,
  //       success: false,
  //       message: "Internal Server Error",
  //       title: "Upload Status",
  //       duration: 1800,
  //     });
  //   } finally {
  //     // setFullscreenLoading(false);
  //   }
  // };

  // const handleFromDateChange = (event, selectedDate) => {
  //   if (event.type === "dismissed") return;
  //   const current = selectedDate || new Date();
  //   setFromDatePicker(false);

  //   setFormData((prev) => ({
  //     ...prev,
  //     workExperience: prev.workExperience.map((work, index) =>
  //       index === 0 ? { ...work, from: current } : work
  //     ),
  //   }));
  // };
  // const handleTestDateChange = (event, selectedDate) => {
  //   if (event.type === "dismissed") return;
  //   const current = selectedDate || new Date();
  //   setTestDatePicker(false);

  //   setFormData((prev) => ({
  //     ...prev,
  //     languageProficiency: prev.languageProficiency.map((test, index) =>
  //       index === 0 ? { ...test, dateOfTest: current } : test
  //     ),
  //   }));
  // };
  // const handleToDateChange = (event, selectedDate) => {
  //   if (event.type === "dismissed") return;
  //   const current = selectedDate || new Date();
  //   setToDatePicker(false);
  //   setFormData((prev) => ({
  //     ...prev,
  //     workExperience: prev.workExperience.map((work, index) =>
  //       index === 0 ? { ...work, to: current } : work
  //     ),
  //   }));
  // };

  const handleSubmit = async () => {
    try {
      // console.log("kyc", kycDetails);
      const kyc = kycDetails?.user?.profile;
      const newRequestBody = {
        ...formData,
        // applicationId:kycDetails?.user?.Application[0]?.applicationId,
        educationHistory: kyc?.educationHistory,
        languageProficiency: kyc?.languageProficiency,
        workExperience: kyc?.workExperience,
        studyPreferences:[{...kyc?.studyPreferences[0],
          preferredUniversity:kyc?.studyPreferences[0]?.university?.cricosProviderCode,
          coursePreference:kyc?.studyPreferences[0]?.course?.cricosCourseCode
        }]
      };
      prettier('new',newRequestBody)
      setFullscreenLoading(true);
      const response = await fetch(API_BASE_URL + "/api/v1/updateKyc", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRequestBody),
      });
      const data = await response.json();
      if (response.ok) {
        setNotification({
          visible: true,
          success: true,
          duration: 1800,
          title: "Applied successfully",
          message: "Your application has been submitted successfully",
        });
        console.log("success", data);
        navigation.navigate("AUTHENTICATED" as never);
      } else {
        setNotification({
          visible: true,
          success: false,
          duration: 1800,
          title: "Applied status",
          message: "Your application could not be submitted",
        });
        console.warn("error", data);
      }
    } catch (error) {
      setNotification({
        visible: true,
        success: false,
        duration: 1800,
        title: "Internal server error",
        message: "An error has occurred",
      });
      console.error("Error", error);
    } finally {
      setFullscreenLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "white",
        padding: 16,
        gap: 16,
      }}
    >
      {/* Personal Information */}
      <CustomText
        heading="Personal Information"
        style={{
          color: THEME[theme].inputTextColor,
          fontFamily: "Medium",
          fontSize: RFValue(20),
          lineHeight: 22,
        }}
      />
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
      
      <CustomText
        subHeading="Visa"
        style={{
          color: THEME[theme].inputTextColor,
          fontFamily: "Regular",
          fontSize:RFValue(16),
          lineHeight: 22,
        }}
      />
      <CustomText
        subHeading="*"
        style={{
          color: 'red',
          fontFamily: "Regular",
          fontSize:RFValue(16),
          lineHeight: 22,
        }}
      />
      </View>
      <DropDownPicker
        open={visaOpen}
        value={formData.profile.visaStatus}
        items={visaOptions as never}
        containerProps={{
          style: { height: visaOpen ? "18%" : null },
        }}
        setOpen={setVisaOpen}
        setValue={(callback) => {
          setFormData((prev) => {
            const newValue = callback(prev.profile.visaStatus);
            return {
              ...prev,
              profile: {
                ...prev.profile,
                visaStatus: newValue,
              },
            };
          });
        }}
        placeholder="Select Visa status"
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
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
  
      <CustomText
        subHeading="Dependents"
        style={{
          color: THEME[theme].inputTextColor,
          fontFamily: "Regular",
          fontSize:RFValue(16),
          lineHeight: 22,
        }}
      />
      <CustomText
        subHeading="*"
        style={{
          color: 'red',
          fontFamily: "Regular",
          fontSize:RFValue(16),
          lineHeight: 22,
        }}
      />
      </View>
      <DropDownPicker
        open={dependentsOpen}
        value={formData.profile.dependents}
        items={dependentsOptions}
        containerProps={{
          style: { height: dependentsOpen ? "18%" : null },
        }}
        setOpen={setDependentsOpen}
        setValue={(callback) => {
          setFormData((prev) => {
            const newValue = callback(prev.profile.dependents);
            return {
              ...prev,
              profile: {
                ...prev.profile,
                dependents: newValue,
              },
            };
          });
        }}
        placeholder="Select"
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
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
      
      <CustomText
        subHeading="Disqualification Status"
        style={{
          color: THEME[theme].inputTextColor,
          fontFamily: "Regular",
          fontSize:RFValue(16),
          lineHeight: 22,
        }}
      />
      <CustomText
        subHeading="*"
        style={{
          color: 'red',
          fontFamily: "Regular",
          fontSize:RFValue(16),
          lineHeight: 22,
        }}
      />
      </View>
      <DropDownPicker
        open={disqualificationOpen}
        value={formData.profile.disqualificationStatus}
        items={disqualificationOptions as never}
        containerProps={{
          style: { height: disqualificationOpen ? "18%" : null },
        }}
        setOpen={setDisqualificationOpen}
        setValue={(callback) => {
          setFormData((prev) => {
            const newValue = callback(prev.profile.disqualificationStatus);
            return {
              ...prev,
              profile: {
                ...prev.profile,
                disqualificationStatus: newValue,
              },
            };
          });
        }}
        placeholder="Select"
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

      <Separator color={THEME[theme].disabled} />

      {/*Education Section  */}
      {/* <CustomText
        subHeading="Education Information"
        style={{
          color: THEME[theme].inputTextColor,
          fontFamily: "Medium",
          fontSize: 20,
          lineHeight: 22,
        }}
      />
      <CustomText
        subHeading="Degree"
        style={{
          color: THEME[theme].inputTextColor,
          fontFamily: "Regular",
          fontSize:RFValue(16),
          lineHeight: 22,
        }}
      />
      <DropDownPicker
        open={degreeOpen}
        value={formData.educationHistory[0].degree}
        items={degreeOptions}
        containerProps={{
          style: { height: degreeOpen ? "8%" : null },
        }}
        setOpen={setDegreeOpen}
        setValue={(callback) => {
          setFormData((prev) => {
            const newValue = callback(prev.educationHistory[0].degree);
            return {
              ...prev,
              educationHistory: prev.educationHistory.map((entry, index) =>
                index === 0 ? { ...entry, degree: newValue } : entry
              ),
            };
          });
        }}
        placeholder="Select"
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

      <CustomText
        subHeading="Certificate"
        style={{
          color: THEME[theme].inputTextColor,
          fontFamily: "Regular",
          fontSize:RFValue(16),
          lineHeight: 22,
        }}
      />

      <TouchableOpacity
        style={{
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: THEME[theme].inputTextFieldBorderColor,
          borderRadius: 8,
          height: 48,
          paddingHorizontal: 16,
        }}
        onPress={pickImage}
      >
        <MaterialCommunityIcons
          name="file"
          size={20}
          color={THEME[theme].primary}
        />
        {certificateImage.name ? (
          <CustomText
            subHeadingColor={THEME[theme].inputTextColor}
            subHeading={certificateImage.name}
            style={{ marginHorizontal: 16 }}
            numberOfLines={1}
          />
        ) : (
          <CustomText
            subHeadingColor={THEME[theme].inputTextColor}
            subHeading="Select Certificate"
          />
        )}
      </TouchableOpacity>

      <InputTextField
        label="Backlogs"
        keyboardType="numeric"
        value={formData.educationHistory[0].backlogs}
        placeholder="Enter number of backlogs"
        onChangeText={(backlogs) =>
          setFormData((prev) => ({
            ...prev,
            educationHistory: prev.educationHistory.map((entry, index) =>
              index === 0 ? { ...entry, backlogs: Number(backlogs) } : entry
            ),
          }))
        }
      />
      <InputTextField
        label="Percentage"
        keyboardType="numeric"
        value={formData.educationHistory[0].percentage}
        placeholder="Enter percentage"
        onChangeText={(percentage) =>
          setFormData((prev) => ({
            ...prev,
            educationHistory: prev.educationHistory.map((entry, index) =>
              index === 0 ? { ...entry, percentage: Number(percentage) } : entry
            ),
          }))
        }
      />
      <InputTextField
        label="Year of passing"
        keyboardType="numeric"
        maxLength={4}
        placeholder="Enter year of passing"
        value={formData.educationHistory[0].yearOfPassing}
        onChangeText={(yearOfPassing) =>
          setFormData((prev) => ({
            ...prev,
            educationHistory: prev.educationHistory.map((entry, index) =>
              index === 0
                ? { ...entry, yearOfPassing: Number(yearOfPassing) }
                : entry
            ),
          }))
        }
      /> */}
      {/* <InputTextField
        label="Major Subject"
        value={formData.educationHistory[0].majorSubjects}
        placeholder="Enter your major subject"
        onChangeText={(majorSubjects) =>
          setFormData((prev) => ({
            ...prev,
            educationHistory: prev.educationHistory.map((entry, index) =>
              index === 0 ? { ...entry, majorSubjects } : entry
            ),
          }))
        }
      /> */}
      {/* <Separator color={THEME[theme].disabled} /> */}
      {/* Work Experience */}
      {/* <CustomText
        subHeading="Work Experience"
        style={{
          color: THEME[theme].inputTextColor,
          fontFamily: "Medium",
          fontSize: 20,
          lineHeight: 22,
        }}
      />

      <InputTextField
        label="Workplace Name"
        value={formData.workExperience[0].workplaceName}
        placeholder="Enter your last workplace name "
        onChangeText={(workplaceName) =>
          setFormData((prev) => ({
            ...prev,
            workExperience: prev.workExperience.map((entry, index) =>
              index === 0 ? { ...entry, workplaceName } : entry
            ),
          }))
        } */}
      {/* /> */}
      {/* <InputTextField
        label="Job Title"
        value={formData.workExperience[0].jobProfile}
        placeholder="Enter your job profile "
        onChangeText={(jobProfile) =>
          setFormData((prev) => ({
            ...prev,
            workExperience: prev.workExperience.map((entry, index) =>
              index === 0 ? { ...entry, jobProfile } : entry
            ),
          }))
        }
      /> */}
      {/* <CustomText
        subHeading="From Date"
        style={{
          color: THEME[theme].inputTextColor,
          fontFamily: "Regular",
          fontSize:RFValue(16),
          lineHeight: 22,
        }}
      />
      <TouchableOpacity
        onPress={() => setFromDatePicker(true)}
        style={[
          styles.datePickerButton,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <CustomText
          style={{
            color: THEME[theme].inputTextColor,
            fontFamily: "Regular",
            fontSize:RFValue(14),
            lineHeight: 22,
          }}
          subHeading={
            formData.workExperience[0].from !== ""
              ? new Date(formData.workExperience[0].from).toDateString()
              : "Select From Date"
          }
        />
        <MaterialCommunityIcons
          name="calendar"
          size={20}
          color={THEME[theme].primary}
        />
      </TouchableOpacity>
      {showFromDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleFromDateChange}
          maximumDate={new Date()}
        />
      )} */}
      {/* <CustomText
        subHeading="To Date"
        style={{
          color: THEME[theme].inputTextColor,
          fontFamily: "Regular",
          fontsize:RFValue(16),
          lineHeight: 22,
        }}
      />
      <TouchableOpacity
        onPress={() => setToDatePicker(true)}
        style={[
          styles.datePickerButton,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <CustomText
          style={{
            color: THEME[theme].inputTextColor,
            fontFamily: "Regular",
            fontSize:RFValue(14),
            lineHeight: 22,
          }}
          subHeading={
            formData.workExperience[0].to !== ""
              ? new Date(formData.workExperience[0].to).toDateString()
              : "Select To Date"
          }
        />
        <MaterialCommunityIcons
          name="calendar"
          size={20}
          color={THEME[theme].primary}
        />
      </TouchableOpacity>
      {showToDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleToDateChange}
          maximumDate={new Date()}
        />
      )} */}

      {/* Language Proficiency */}

      {/* <CustomText
        heading="Language Proficiency"
        style={{
          color: THEME[theme].inputTextColor,
          fontFamily: "Medium",
          fontSize: 20,
          lineHeight: 22,
        }}
      /> */}

      {/* <InputTextField
        label="Test Name"
        value={formData.languageProficiency[0].testName}
        placeholder="Enter test name "
        onChangeText={(testName) =>
          setFormData((prev) => ({
            ...prev,
            languageProficiency: prev.languageProficiency.map((entry, index) =>
              index === 0 ? { ...entry, testName } : entry
            ),
          }))
        }
      /> */}

      {/* <CustomText
        subHeading="Test Date"
        style={{
          color: THEME[theme].inputTextColor,
          fontFamily: "Regular",
          fontsize:RFValue(16),
          lineHeight: 22,
        }}
      />

      <TouchableOpacity
        onPress={() => setTestDatePicker(true)}
        style={[
          styles.datePickerButton,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <CustomText
          style={{
            color: THEME[theme].inputTextColor,
            fontFamily: "Regular",
            fontSize:RFValue(14),
            lineHeight: 22,
          }}
          subHeading={
            formData.languageProficiency[0].dateOfTest !== ""
              ? new Date(
                  formData.languageProficiency[0].dateOfTest
                ).toDateString()
              : "Select Test Date"
          }
        />
        <MaterialCommunityIcons
          name="calendar"
          size={20}
          color={THEME[theme].primary}
        />
      </TouchableOpacity>
      {showTestDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleTestDateChange}
          maximumDate={new Date()}
        />
      )} */}

      {/* <InputTextField
        label="Test Score"
        value={formData.languageProficiency[0].overallBand}
        placeholder="Enter your test score"
        keyboardType="numeric"
        onChangeText={(overallBand) =>
          setFormData((prev) => ({
            ...prev,
            languageProficiency: prev.languageProficiency.map((entry, index) =>
              index === 0
                ? { ...entry, overallBand: Number(overallBand) }
                : entry
            ),
          }))
        }
      /> */}

      {/* Financial Details */}
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
      
      <CustomText
        heading="Financial Information"
        style={{
          color: THEME[theme].inputTextColor,
          fontFamily: "Medium",
          fontSize: RFValue(20),
          lineHeight: 22,
        }}
      />
      <CustomText
        heading="*"
        style={{
          color:'red',
          fontFamily: "Medium",
          fontSize: RFValue(20),
          lineHeight: 22,
        }}
      />
      </View>

      <InputTextField
        label="Family Income"
        isRequired={true}
        value={formData.financialDetails[0].totalFamilyIncome}
        placeholder="Enter your family income"
        keyboardType="numeric"
        onChangeText={(totalFamilyIncome) =>
          setFormData((prev) => ({
            ...prev,
            financialDetails: prev.financialDetails.map((entry, index) =>
              index === 0
                ? { ...entry, totalFamilyIncome: Number(totalFamilyIncome) }
                : entry
            ),
          }))
        }
      />
      <InputTextField
        label="Sponsers"
        isRequired={true}
        value={formData.financialDetails[0].sponsors}
        placeholder="Enter your sponser"
        onChangeText={(sponsors) =>
          setFormData((prev) => ({
            ...prev,
            financialDetails: prev.financialDetails.map((entry, index) =>
              index === 0 ? { ...entry, sponsors } : entry
            ),
          }))
        }
      />
      <InputTextField
        label="Funds Available"
        isRequired={true}
        value={formData.financialDetails[0].fundAvailable}
        placeholder="Enter your available funds"
        keyboardType="numeric"
        onChangeText={(fundAvailable) =>
          setFormData((prev) => ({
            ...prev,
            financialDetails: prev.financialDetails.map((entry, index) =>
              index === 0
                ? { ...entry, fundAvailable: Number(fundAvailable) }
                : entry
            ),
          }))
        }
      />

      <CustomButton
        onPress={() => {
          prettier("ff", formData);

          handleSubmit();
        }}
        background={THEME[theme].primary}
        title="Apply"
      />
    </ScrollView>
  );
};

export default CompleteKYC;

const styles = StyleSheet.create({
  dropdown: {
    borderColor: "#ccc",
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
  },
  label: {
    fontSize: RFValue(18),
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadButtonText: {
    // color: "#fff",
    fontSize:RFValue(16),
  },
  photoPreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});
