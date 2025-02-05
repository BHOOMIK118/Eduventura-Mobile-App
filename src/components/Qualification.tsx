import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import CustomText from "./CustomText";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import HeightGap from "./HeightGap";
import Accordion from "./Accordion";
import { useAuth } from "@context/AuthContext";
import InputTextField from "./InputTextField";
import CustomButton from "./CustomButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";
import DateTimePicker from "@react-native-community/datetimepicker";
import { prettier } from "@utils/helpers";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { screenHeight, screenWidth } from "@utils/Scaling";
import { RFValue } from "react-native-responsive-fontsize";
import CustomDropdown from "./CustomDropdown";
import {
  BACKLOG_OPTIONS,
  DEGREE_OPTIONS,
  GRADING_OPTIONS,
  MAJOR_SUBJECTS,
  TEST_OPTIONS,
} from "src/data/constantValues";

interface Qualification {
  certification: string;
  degree: string;
  percentage: number;
  yearOfPassing: number;
  majorSubjects: string;
  backlogs: number;
}

const QualificationItem = ({
  title,
  formData,
  setFormData,
}: {
  title: any;
  formData: any;
  setFormData: any;
}) => {
  const { theme, setNotification, setFullscreenLoading } = useUI();
  const [expand, setExpand] = useState(false);
  const [certificateImage, setCertificateImage] = useState<{
    uri: string | null;
    name: string | null | undefined;
  }>({
    uri: null,
    name: null,
  });

  const [academicQualifications, setAcademicQualifications] =
    useState<any>(formData);
  const { token, profile, kycDetails, setKycDetails } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [gradingSystem, setGradingSystem] = useState(GRADING_OPTIONS[0].value);

  useEffect(() => {
    setAcademicQualifications(formData);
  }, [formData]);

  const saveEducationHistory = async (isDelete = false) => {
    let updatedEducationHistory = kycDetails?.user?.profile?.educationHistory;

    if (isDelete) {
      updatedEducationHistory = updatedEducationHistory.filter(
        (item) => item.id !== academicQualifications.id
      );
    } else {
      updatedEducationHistory = updatedEducationHistory.map((item) =>
        item.id === academicQualifications.id ? academicQualifications : item
      );
    }

    const requestBody = {
      ...(kycDetails?.user?.Application?.length > 0 && {
        applicationId: kycDetails?.user?.Application[0]?.applicationId,
      }),
      educationHistory: updatedEducationHistory,
    };
    console.log("hello world", requestBody);

    try {
      setFullscreenLoading(true);
      const response = await fetch(API_BASE_URL + "/api/v1/updateKyc", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (response.status === 200) {
        prettier("success", data);
        setKycDetails(data);
        setNotification({
          title: "Qualification Updated",
          message: "Your information has been updated",
          duration: 1200,
          success: true,
          visible: true,
        });
        setExpand(false);
      } else {
        console.warn("Failed to update:", data);
        setNotification({
          title: "Failed to update qualification",
          message: "Your information could not be updated",
          duration: 1200,
          success: false,
          visible: true,
        });
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed to update qualification",
        message: "Your information could not be updated",
        duration: 1200,
        success: false,
        visible: true,
      });
    } finally {
      setFullscreenLoading(false);
      setExpand(false);
    }
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setCertificateImage({
        uri: result.assets[0].uri,
        name: result.assets[0].fileName,
      });
      console.log("dss", {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName,
      });

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
      const imageFormData: any = new FormData();
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
        setCertificateImage((prev) => ({
          ...prev,
          uri: data?.url || "",
        }));
        setAcademicQualifications((prev) => ({
          ...prev,
          certification: data?.url,
        }));
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
  return (
    <Accordion
      title={title}
      isExpanded={expand}
      setIsExpanded={setExpand}
      style={{
        justifyContent: "space-between",
        flexDirection: "row-reverse",
        backgroundColor: "white",
        borderColor: "#ddd",
        borderWidth: 1,
      }}
      Icon={"pencil"}
    >
      <View style={{ padding: 8, borderColor: "#ddd", borderWidth: 1, gap: 8 }}>
        <CustomDropdown
          label="Degree"
          value={academicQualifications?.degree}
          onChange={(text) =>
            setAcademicQualifications((prev) => {
              return { ...prev, degree: text };
            })
          }
          data={DEGREE_OPTIONS}
          required
        />

        <CustomDropdown
          label="Grading System"
          required
          value={gradingSystem}
          data={GRADING_OPTIONS}
          onChange={setGradingSystem}
        />

{gradingSystem === "Percentage (1-100)" ? (
              <InputTextField
                label="Percentage"
                keyboardType="numeric"
                isRequired={true}
                backgroundColor={THEME[theme].background}
                value={academicQualifications?.percentage?.toString()}
                placeholder="Enter percentage"
                onChangeText={(percentage) => {
                  setAcademicQualifications((prev) => {
                    return { ...prev, percentage: Number(percentage) };
                  });
                }}
              />
            ) : (
              <InputTextField
                label="CGPA"
                keyboardType="numeric"
                isRequired={true}
                backgroundColor={THEME[theme].background}
                value={academicQualifications?.percentage?.toString()}
                placeholder="Enter your cgpa"
                onChangeText={(percentage) => {
                  setAcademicQualifications((prev) => {
                    return { ...prev, percentage: Number(percentage) };
                  });
                }}
              />
            )}

        

        <CustomDropdown
          label="Major Subject"
          required
          value={academicQualifications?.majorSubjects}
          onChange={(text) =>
            setAcademicQualifications((prev) => {
              return { ...prev, majorSubjects: text };
            })
          }
          data={MAJOR_SUBJECTS}
        />

        <InputTextField
          label="Year of passing"
          isRequired={true}
          keyboardType="numeric"
          backgroundColor={THEME[theme].background}
          maxLength={4}
          placeholder="Enter year of passing"
          value={academicQualifications?.yearOfPassing?.toString()}
          onChangeText={(yearOfPassing) =>
            setAcademicQualifications((prev) => {
              return { ...prev, yearOfPassing: Number(yearOfPassing) };
            })
          }
        />

        <CustomDropdown
          value={academicQualifications?.backlogs?.toString()}
          onChange={(text) =>
            setAcademicQualifications((prev) => {
              return {
                ...prev,
                backlogs: Number(text),
              };
            })
          }
          data={BACKLOG_OPTIONS}
          label="Backlogs"
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomText
            subHeading="Certificate"
            style={{
              color: THEME[theme].inputTextColor,
              fontFamily: "Regular",
              fontSize: RFValue(16),
              lineHeight: 22,
            }}
          />
          <CustomText
            subHeading="*"
            style={{
              color: "red",
              fontFamily: "Regular",
              fontSize: RFValue(16),
              lineHeight: 22,
            }}
          />
        </View>

        <TouchableOpacity
          style={{
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: THEME[theme].inputTextFieldBorderColor,
            backgroundColor: "white",
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
        {academicQualifications?.certification !== "" && (
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
            onPress={() => {
              if (
                certificateImage.uri ||
                academicQualifications?.certification !== ""
              ) {
                setIsModalVisible(true);
              }
            }}
          >
            <CustomText
              subHeading="View Certificate"
              subHeadingColor="#3498db"
            />
          </TouchableOpacity>
        )}

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Image
                source={
                  {
                    uri:
                      certificateImage.uri ||
                      academicQualifications?.certification,
                  } as never
                }
                style={{ width: screenWidth * 0.8, height: screenHeight * 0.8 }}
                resizeMode="contain"
              />
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={{
                  marginTop: 10,
                  alignSelf: "center",
                  padding: 10,
                  backgroundColor: THEME[theme].primary,
                  borderRadius: 8,
                }}
              >
                <CustomText subHeading="Close" subHeadingColor="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginVertical: 8,
            marginBottom: 8,
          }}
        >
          <CustomButton
            title="Discard"
            background={"red"}
            onPress={() => saveEducationHistory(true)}
          />
          <CustomButton
            title="Save"
            background={THEME[theme].primary}
            onPress={() => saveEducationHistory()}
          />
        </View>
      </View>
    </Accordion>
  );
};

const EnglishLanguageItem = ({ title, formData, setFormData }) => {
  const { theme, setNotification, setFullscreenLoading } = useUI();
  const { token, profile, kycDetails, setKycDetails } = useAuth();
  const [showTestDatePicker, setTestDatePicker] = useState(false);
  const [addlanguageProficiency, setLanguageProficiency] =
    useState<any>(formData);
  const [languageAccordion, setLanguageAccordion] = useState(false);
  const handleTestDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setTestDatePicker(false);
      return;
    }
    const current = selectedDate || new Date();
    setTestDatePicker(false);

    setLanguageProficiency((prev) => ({ ...prev, dateOfTest: current }));
  };

  useEffect(() => {
    setLanguageProficiency(formData);
  }, [formData]);

  const saveLanguageProficiency = async (isDelete = false) => {
    // console.log("sff", addlanguageProficiency);
    let updatedLanguageProficiency = [
      ...kycDetails?.user?.profile?.languageProficiency,
    ];
    if (isDelete) {
      updatedLanguageProficiency = updatedLanguageProficiency.filter(
        (item) => item.id !== addlanguageProficiency.id
      );
    } else {
      updatedLanguageProficiency = updatedLanguageProficiency.map((item) =>
        item.id === addlanguageProficiency.id ? addlanguageProficiency : item
      );
    }
    const requestBody = {
      ...(kycDetails?.user?.Application?.length > 0 && {
        applicationId: kycDetails?.user?.Application[0]?.applicationId,
      }),
      languageProficiency: updatedLanguageProficiency,
    };

    console.log("my req", requestBody);

    try {
      setFullscreenLoading(true);
      const response = await fetch(API_BASE_URL + "/api/v1/updateKyc", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (response.status === 200) {
        prettier("success", data);

        setKycDetails(data);
        setNotification({
          title: "Qualification updated",
          message: "Your information has been updated",
          duration: 1200,
          success: true,
          visible: true,
        });
        setLanguageAccordion(false);
      } else {
        console.warn("Failed to update:", data);
        setNotification({
          title: "Failed to update qualification",
          message: "Your information could not be updated",
          duration: 1200,
          success: false,
          visible: true,
        });
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed to update qualification",
        message: "Your information could not be updated",
        duration: 1200,
        success: false,
        visible: true,
      });
    } finally {
      setFullscreenLoading(false);
      setLanguageAccordion(false);
    }
  };
  return (
    <>
      {/* Language Proficiency */}

      <Accordion
        title={title}
        isExpanded={languageAccordion}
        setIsExpanded={setLanguageAccordion}
        style={{
          justifyContent: "space-between",
          flexDirection: "row-reverse",
          backgroundColor: "white",
          borderColor: "#ddd",
          borderWidth: 1,
        }}
        Icon={"pencil"}
      >
        <View
          style={{ padding: 8, borderColor: "#ddd", borderWidth: 1, gap: 8 }}
        >
          <CustomDropdown
            value={addlanguageProficiency?.testName}
            onChange={(text) =>
              setLanguageProficiency((prev) => {
                return { ...prev, testName: text };
              })
            }
            data={TEST_OPTIONS}
            label="Test Name"
            required
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CustomText
              subHeading="Test Date"
              style={{
                color: THEME[theme].inputTextColor,
                fontFamily: "Regular",
                fontSize: RFValue(16),
                lineHeight: 22,
              }}
            />
            <CustomText
              subHeading="*"
              style={{
                color: "red",
                fontFamily: "Regular",
                fontSize: RFValue(16),
                lineHeight: 22,
              }}
            />
          </View>

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
                fontSize: RFValue(14),
                lineHeight: 22,
              }}
              subHeading={
                addlanguageProficiency?.dateOfTest !== ""
                  ? new Date(addlanguageProficiency?.dateOfTest).toDateString()
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
          )}

          <InputTextField
            label="Test Score"
            isRequired={true}
            value={addlanguageProficiency?.overallBand?.toString()}
            backgroundColor={THEME[theme].background}
            placeholder="Enter your test score"
            keyboardType="numeric"
            onChangeText={(overallBand) => {
              console.log("overall", overallBand);
              setLanguageProficiency((prev) => ({
                ...prev,
                overallBand: Number(overallBand),
              }));
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginVertical: 16,
              marginBottom: 8,
            }}
          >
            <CustomButton
              title="Discard"
              background={"red"}
              onPress={() => saveLanguageProficiency(true)}
            />
            <CustomButton
              title="Save"
              background={THEME[theme].primary}
              onPress={() => saveLanguageProficiency()}
            />
          </View>
        </View>
      </Accordion>
    </>
  );
};

const Qualification = () => {
  const { theme, setFullscreenLoading, setNotification } = useUI();
  const { profile, kycDetails, setKycDetails, token } = useAuth();
  const [showTestDatePicker, setTestDatePicker] = useState(false);
  const [formData, setFormData] = useState<any>({
    educationHistory: kycDetails?.user?.profile?.educationHistory,

    languageProficiency: kycDetails?.user?.profile?.languageProficiency,
  });

  useEffect(() => {
    setFormData({
      educationHistory: kycDetails?.user?.profile?.educationHistory,

      languageProficiency: kycDetails?.user?.profile?.languageProficiency,
    });
  }, [kycDetails]);

  const [academicQualifications, setAcademicQualifications] = useState<any>({
    certification: "",
    degree: "Undergraduate",
    percentage: "",
    yearOfPassing: "",
    majorSubjects: "Science",
    backlogs: "0",
  });

  const [addlanguageProficiency, setLanguageProficiency] = useState<any>({
    testName: "",
    dateOfTest: "",
    individualBand: "90",
    overallBand: "",
  });

  const handleTestDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setTestDatePicker(false);
      return;
    }
    const current = selectedDate || new Date();
    setTestDatePicker(false);

    setLanguageProficiency((prev) => ({ ...prev, dateOfTest: current }));
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [gradingSystem, setGradingSystem] = useState(GRADING_OPTIONS[0].value);
  const [languageAccordion, setLanguageAccordion] = useState(false);
  const [certificateImage, setCertificateImage] = useState<{
    uri: string | null;
    name: string | null | undefined;
  }>({
    uri: null,
    name: null,
  });

  const saveEducationHistory = async () => {
    console.log("sff", academicQualifications);
    try {
      if (
        academicQualifications.degree &&
        academicQualifications.percentage > 0 &&
        academicQualifications.yearOfPassing > 0 &&
        academicQualifications.majorSubjects &&
        academicQualifications.backlogs >= 0
      ) {
        const convertion = {
          certification: academicQualifications?.certification,
          degree: academicQualifications?.degree,
          percentage: Number(academicQualifications?.percentage),
          yearOfPassing: Number(academicQualifications?.yearOfPassing),
          majorSubjects: academicQualifications?.majorSubjects,
          backlogs: Number(academicQualifications?.backlogs),
        };
        setFullscreenLoading(true);
        const requestBody = {
          ...(kycDetails?.user?.Application?.length > 0 && {
            applicationId: kycDetails?.user?.Application[0]?.applicationId,
          }),
          educationHistory: [
            ...(kycDetails?.user?.profile?.educationHistory || []),
            convertion,
          ],
        };
        // console.log("my request body", requestBody);
        const response = await fetch(API_BASE_URL + "/api/v1/updateKyc", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });
        const data = await response.json();

        if (response.status === 200) {
          setAcademicQualifications({
            certification: "",
            degree: "",
            percentage: 0,
            yearOfPassing: 0,
            majorSubjects: "",
            backlogs: "0",
          });
          setKycDetails(data);
          setNotification({
            title: "Qualification",
            message: "Your information has been updated",
            duration: 1200,
            success: true,
            visible: true,
          });
          prettier("success", data);
          setIsExpanded(false);
        } else {
          console.info("Failed to update:", data);
          setNotification({
            title: "Failed to update qualification",
            message: "Your information could not be updated",
            duration: 1200,
            success: false,
            visible: true,
          });
        }
      } else {
        alert("Please fill all the required fields before saving.");
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed to update qualification",
        message: "Your information could not be updated",
        duration: 1200,
        success: false,
        visible: true,
      });
    } finally {
      setIsExpanded(false);
      setFullscreenLoading(false);
    }
  };

  const saveLanguageProficiency = async () => {
    try {
      if (
        addlanguageProficiency.testName &&
        addlanguageProficiency.dateOfTest &&
        addlanguageProficiency.individualBand > 0 &&
        addlanguageProficiency.overallBand
      ) {
        const convertion = {
          ...addlanguageProficiency,
          individualBand: Number(addlanguageProficiency?.individualBand),
          overallBand: Number(addlanguageProficiency?.overallBand),
        };
        setFullscreenLoading(true);
        const requestBody = {
          ...(kycDetails?.user?.Application?.length > 0 && {
            applicationId: kycDetails?.user?.Application[0]?.applicationId,
          }),
          languageProficiency: [
            ...(kycDetails?.user?.profile?.languageProficiency || []),
            convertion,
          ],
        };
        const response = await fetch(API_BASE_URL + "/api/v1/updateKyc", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });
        const data = await response.json();
        if (response.status === 200) {
          setLanguageProficiency({
            testName: "",
            dateOfTest: "",
            individualBand: 90,
            overallBand: 0,
          });
          setKycDetails(data);
          setNotification({
            title: "Qualification updated",
            message: "Your information has been updated",
            duration: 1200,
            success: true,
            visible: true,
          });
          prettier("success", data);
          setLanguageAccordion(false);
        } else {
          console.info("Failed to update:", data);
          setNotification({
            title: "Failed to update qualification",
            message: "Your information could not be updated",
            duration: 1200,
            success: false,
            visible: true,
          });
        }
      } else {
        alert("Please fill all the required fields before saving.");
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed to update qualification",
        message: "Your information could not be updated",
        duration: 1200,
        success: false,
        visible: true,
      });
    } finally {
      setLanguageAccordion(false);
      setFullscreenLoading(false);
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
      const imageFormData: any = new FormData();
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
        setCertificateImage((prev) => ({
          ...prev,
          uri: data?.url || "",
        }));
        setAcademicQualifications((prev) => ({
          ...prev,
          certification: data?.url,
        }));
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setCertificateImage({
        uri: result.assets[0].uri,
        name: result.assets[0].fileName,
      });
      console.log("dss", {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName,
      });

      handleUpload(result.assets[0].uri);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 16,
        backgroundColor: "#ffffff",
      }}
    >
      {/* Academic Qualification */}
      <View style={styles.section}>
        <CustomText
          subHeading="Academic qualification"
          subHeadingFontSize={14}
          subHeadingColor={THEME[theme].text.primary}
        />
        <HeightGap height={10} />
        {formData?.educationHistory?.map((qual, index) => (
          <QualificationItem
            key={index}
            title={qual.degree}
            setFormData={setFormData}
            formData={qual}
          />
        ))}

        <Accordion
          title={"Add Academic Qualification"}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        >
          <View
            style={{
              padding: 8,
              backgroundColor: THEME[theme].background,
              borderColor: THEME[theme].inputTextFieldBorderColor,
              borderWidth: 1,
              gap: 8,
            }}
          >
            <CustomDropdown
              label="Degree"
              required
              data={DEGREE_OPTIONS}
              onChange={(text) =>
                setAcademicQualifications((prev) => {
                  return { ...prev, degree: text };
                })
              }
              value={academicQualifications?.degree}
            />

            <CustomDropdown
              label="Grading System"
              required
              value={gradingSystem}
              data={GRADING_OPTIONS}
              onChange={setGradingSystem}
            />

            {gradingSystem === "Percentage (1-100)" ? (
              <InputTextField
                label="Percentage"
                keyboardType="numeric"
                isRequired={true}
                backgroundColor={THEME[theme].background}
                value={academicQualifications?.percentage}
                placeholder="Enter percentage"
                onChangeText={(percentage) => {
                  setAcademicQualifications((prev) => {
                    return { ...prev, percentage: Number(percentage) };
                  });
                }}
              />
            ) : (
              <InputTextField
                label="CGPA"
                keyboardType="numeric"
                isRequired={true}
                backgroundColor={THEME[theme].background}
                value={academicQualifications?.percentage}
                placeholder="Enter your cgpa"
                onChangeText={(percentage) => {
                  setAcademicQualifications((prev) => {
                    return { ...prev, percentage: Number(percentage) };
                  });
                }}
              />
            )}

            <CustomDropdown
              label="Major Subject"
              required
              value={academicQualifications?.majorSubjects}
              data={MAJOR_SUBJECTS}
              onChange={(text) =>
                setAcademicQualifications((prev) => {
                  return { ...prev, majorSubjects: text };
                })
              }
            />

            <InputTextField
              label="Year of passing"
              keyboardType="numeric"
              isRequired={true}
              backgroundColor={THEME[theme].background}
              maxLength={4}
              placeholder="Enter year of passing"
              value={academicQualifications?.yearOfPassing}
              onChangeText={(yearOfPassing) =>
                setAcademicQualifications((prev) => {
                  return { ...prev, yearOfPassing: Number(yearOfPassing) };
                })
              }
            />

            <CustomDropdown
              label="Backlogs"
              required
              value={academicQualifications?.backlogs?.toString()}
              data={BACKLOG_OPTIONS}
              onChange={(text) =>
                setAcademicQualifications((prev) => {
                  return { ...prev, backlogs: Number(text) };
                })
              }
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText
                subHeading="Certificate"
                style={{
                  color: THEME[theme].inputTextColor,
                  fontFamily: "Regular",
                  fontSize: RFValue(16),
                  lineHeight: 22,
                }}
              />
              <CustomText
                subHeading="*"
                style={{
                  color: "red",
                  fontFamily: "Regular",
                  fontSize: RFValue(16),
                  lineHeight: 22,
                }}
              />
            </View>

            <TouchableOpacity
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: THEME[theme].inputTextFieldBorderColor,
                backgroundColor: "white",
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
            {academicQualifications?.certification !== "" && (
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => {
                  if (
                    certificateImage.uri ||
                    academicQualifications?.certification !== ""
                  ) {
                    setIsModalVisible(true);
                  }
                }}
              >
                <CustomText
                  subHeading="View Certificate"
                  subHeadingColor="#3498db"
                />
              </TouchableOpacity>
            )}

            <Modal
              visible={isModalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setIsModalVisible(false)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 10,
                  }}
                >
                  <Image
                    source={
                      {
                        uri:
                          certificateImage.uri ||
                          academicQualifications?.certification,
                      } as never
                    }
                    style={{
                      width: screenWidth * 0.8,
                      height: screenHeight * 0.8,
                    }}
                    resizeMode="contain"
                  />
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(false)}
                    style={{
                      marginTop: 10,
                      alignSelf: "center",
                      padding: 10,
                      backgroundColor: THEME[theme].primary,
                      borderRadius: 8,
                    }}
                  >
                    <CustomText subHeading="Close" subHeadingColor="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                marginVertical: 16,
                marginBottom: 8,
              }}
            >
              <CustomButton
                title="Cancel"
                background={THEME[theme].disabled}
                onPress={() => setIsExpanded(false)}
              />
              <CustomButton
                title="Save"
                background={THEME[theme].primary}
                onPress={() => saveEducationHistory()}
              />
            </View>
          </View>
        </Accordion>
      </View>

      {/* Language Proficiency */}
      <View style={styles.section}>
        <CustomText
          subHeading="English Language"
          subHeadingFontSize={14}
          subHeadingColor={THEME[theme].text.primary}
        />

        <HeightGap height={10} />
        {formData?.languageProficiency?.map((proficiency, index) => (
          <EnglishLanguageItem
            key={index}
            title={proficiency?.testName}
            formData={proficiency}
            setFormData={setFormData}
          />
        ))}

        <Accordion
          title={"Add English Language"}
          isExpanded={languageAccordion}
          setIsExpanded={setLanguageAccordion}
        >
          <View
            style={{ padding: 8, borderColor: "#ddd", borderWidth: 1, gap: 8 }}
          >
            <CustomDropdown
              value={addlanguageProficiency?.testName}
              onChange={(text) =>
                setLanguageProficiency((prev) => {
                  return { ...prev, testName: text };
                })
              }
              data={TEST_OPTIONS}
              label="Test Name"
              required
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText
                subHeading="Test Date"
                style={{
                  color: THEME[theme].inputTextColor,
                  fontFamily: "Regular",
                  fontSize: RFValue(16),
                  lineHeight: 22,
                }}
              />
              <CustomText
                subHeading="*"
                style={{
                  color: "red",
                  fontFamily: "Regular",
                  fontSize: RFValue(16),
                  lineHeight: 22,
                }}
              />
            </View>

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
                  fontSize: RFValue(14),
                  lineHeight: 22,
                }}
                subHeading={
                  addlanguageProficiency?.dateOfTest !== ""
                    ? new Date(
                        addlanguageProficiency?.dateOfTest
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
            )}

            <InputTextField
              label="Test Score"
              isRequired={true}
              value={addlanguageProficiency?.overallBand}
              backgroundColor={THEME[theme].background}
              placeholder="Enter your test score"
              keyboardType="numeric"
              onChangeText={(overallBand) =>
                setLanguageProficiency((prev) => ({
                  ...prev,
                  overallBand: overallBand,
                }))
              }
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                marginVertical: 16,
                marginBottom: 8,
              }}
            >
              <CustomButton
                title="Cancel"
                background={THEME[theme].disabled}
                onPress={() => setLanguageAccordion(false)}
              />
              <CustomButton
                title="Save"
                background={THEME[theme].primary}
                onPress={() => saveLanguageProficiency()}
              />
            </View>
          </View>
        </Accordion>
      </View>
    </ScrollView>
  );
};

export default Qualification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  section: {
    marginBottom: 24,
  },

  qualificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 8,
  },

  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});
