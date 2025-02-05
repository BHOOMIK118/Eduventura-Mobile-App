import CustomButton from "@components/CustomButton";
import CustomText from "@components/CustomText";
import Separator from "@components/Separator";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { API_BASE_URL } from "@utils/constant";
import { prettier } from "@utils/helpers";
import { THEME } from "@utils/ui";
import React, { FC, useCallback, useEffect, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";

import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const ApplicationDetails: FC = () => {
  const { params } = useRoute<any>();
  const { theme, setFullscreenLoading, setNotification } = useUI();
  const [loading, setLoading] = useState(false);
  const [user, setApplicationDetails] = useState<any>(null);
  const { setOptions } = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  console.log("sfasjfkhasfhjaksfh", params);
  const fetchApplicationDetails = async () => {
    try {
      setFullscreenLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/getKycDetails?userId=${params.userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setApplicationDetails(data.user);
        console.log("Fetched user data:", data.user.profile.educationHistory);
      } else {
        setNotification({
          title: "Fetching Status",
          message: "Failed to fetch application details",
          duration: 1800,
          visible: true,
          success: false,
        });
        console.warn("Error:", data);
      }
    } catch (error) {
      setNotification({
        title: "Fetching Status",
        message: "Failed to fetch application details",
        duration: 1800,
        visible: true,
        success: false,
      });
      console.error("Error:", error);
    } finally {
      setFullscreenLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setOptions({
        headerTitle: "Application Details",
        headerTitleAlign: "left",
        headerTitleStyle: { fontFamily: "Medium" },
      });
    }, [])
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        {/* <ActivityIndicator size="large" color="#0000ff" /> */}
      </SafeAreaView>
    );
  }

  const ViewDocument = ({ isModalVisible, setModalVisible, imageUri }) => {
    return (
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
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
              width: "100%",
              height: "100%",
              backgroundColor: "white",
              //   borderRadius: 10,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                flex: 1,
                alignSelf: "stretch",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                paddingHorizontal: 4,
              }}
              source={{ uri: imageUri }}
            />

            <View
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                borderRadius: 50,
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ padding: 4 }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color={THEME[theme].primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const StatusModal = ({
    statusModalVisible,
    setStatusModalVisible,
    onChangeStatus,
  }) => {
    const [open, setOpen] = useState(false); // Controls dropdown visibility
    const [selectedStatus, setSelectedStatus] = useState(null);
    const { token } = useAuth();
    const [items, setItems] = useState([
      { label: "Pending", value: "PENDING" },
      { label: "Approved", value: "APPROVED" },
      { label: "Rejected", value: "REJECTED" },
      // { label: "On Hold", value: "On Hold" },
    ]);

    const handleChangeStatus = async (selectedStatus) => {
      try {
        setFullscreenLoading(true);
        const url =
          API_BASE_URL + `/api/v1/changeStatus/${params?.applicationId}`;
        console.log("url is", url);
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: selectedStatus,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          console.log("success", data);
          onChangeStatus(selectedStatus);
          setNotification({
            title:'Status Changed',
            message: `Status changed to ${selectedStatus} successfully`,
            duration:1200,
            visible:true,
            success:true
          })
        } else {
          console.warn("error", data);
          setNotification({
            title: "Failed to change status",
            message: "Could not change the status of the application",
            duration: 1200,
            visible: true,
            success: false,
          });
        }
      } catch (error) {
        setNotification({
          title: "Failed to change status",
          message: "Could not change the status of the application",
          duration: 1200,
          visible: true,
          success: false,
        });
        console.error("Error", error);
      } finally {
        setFullscreenLoading(false);
      }
    };
    return (
      <Modal
        transparent={true}
        visible={statusModalVisible}
        animationType="slide"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Change Status</Text>
            <View style={styles.dropdownContainer}>
              <DropDownPicker
                open={open}
                value={selectedStatus}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedStatus}
                setItems={setItems}
                placeholder="Select a status"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownMenu}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setStatusModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={() => {
                  if (selectedStatus) {
                    onChangeStatus(selectedStatus); // Call the callback to update status
                    setStatusModalVisible(false);
                    handleChangeStatus(selectedStatus); // Close the modal
                  } else {
                    alert("Please select a status");
                  }
                }}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const profile = user?.profile;

  const SectionCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.card}>
      <CustomText style={styles.sectionTitle} heading={title} />
      {children}
    </View>
  );

  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | boolean | null | undefined;
  }) => (
    <View style={styles.infoItem}>
      <CustomText
        style={[styles.label, { fontSize:RFValue(14) }]}
        heading={`${label}:`}
      />
      <View style={{flexShrink:2}}>

      <CustomText
        style={styles.value}
        subHeading={value ? value.toString() : "N/A"}
        />
        </View>
    </View>
  );

  // prettier("sdasdsfa", user.profile);
  return (
    <SafeAreaView style={styles.container}>
      <ViewDocument
        isModalVisible={modalVisible}
        setModalVisible={setModalVisible}
        imageUri={selectedCertificate}
      />

      <StatusModal
        statusModalVisible={statusModalVisible}
        setStatusModalVisible={setStatusModalVisible}
        onChangeStatus={(newStatus) => {
          console.log("Updated status:", newStatus);
          // Update the status in your application logic
        }}
      />

      <ScrollView>
        {/* Header Section */}
        <View style={styles.header}>
          {profile?.profilePictureUrl ? (
            <Image
              source={{ uri: profile?.profilePictureUrl }}
              style={styles.profilePicture}
            />
          ) : (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={100}
              color={THEME[theme].disabled}
            />
          )}
          <CustomText style={styles.name} heading={user?.name || "N/A"} />
          <CustomText style={styles.email} subHeading={user?.email || "N/A"} />
        </View>

        {/* Personal Information Section */}
        <SectionCard title="Personal Information">
          <InfoItem label="Mobile" value={user?.mobileNumber} />
          <InfoItem label="Country" value={user?.country} />
          <InfoItem label="State" value={user?.state} />
          <InfoItem label="Gender" value={profile?.gender} />
          <InfoItem
            label="Date of Birth"
            value={
              profile?.dateOfBirth
                ? new Date(profile.dateOfBirth).toLocaleDateString()
                : "N/A"
            }
          />
          <InfoItem label="Marital Status" value={profile?.maritalStatus} />
          <InfoItem label="Dependents" value={profile?.dependents} />
          <InfoItem
            label="Visa Status"
            value={profile?.visaStatus ? "Yes" : "No"}
          />
          <InfoItem
            label="Disqualification Status"
            value={profile?.disqualificationStatus ? "Yes" : "No"}
          />
        </SectionCard>

        {/* Bio & Interests Section */}
        <SectionCard title="Bio & Interests">
          <CustomText style={styles.bio} subHeading={profile?.bio || "N/A"} />
          <View style={styles.interestsContainer}>
            {profile?.interests?.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <CustomText style={styles.interestText} subHeading={interest} />
              </View>
            ))}
          </View>
        </SectionCard>

        {/* Education Section */}
        <SectionCard title="Education">
          {profile?.educationHistory?.map((edu, index) => (
            <View key={index} style={styles.educationItem}>
              <CustomText style={styles.subTitle} subHeading={edu.degree} />
              <InfoItem label="Major Subjects" value={edu.majorSubjects} />
              <InfoItem label="Percentage" value={`${edu.percentage}%`} />
              <InfoItem label="Year of Passing" value={edu.yearOfPassing} />
              <InfoItem label="Backlogs" value={edu.backlogs} />
              <View
                style={{
                  flexDirection: "row",
                  // justifyContent: "space-between",
                  gap: 70,
                  alignItems: "center",
                }}
              >
                <CustomText
                  heading="Certificate:"
                  headingFontSize={14}
                  style={{ marginVertical: 4 }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCertificate(edu.certification); // Set the selected certificate
                    setModalVisible(true); // Show the modal
                  }}
                  style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
                >
                  <MaterialCommunityIcons
                    name="file"
                    size={20}
                    color={THEME[theme].primary}
                  />
                  <CustomText
                    subHeading="View Certificate"
                    subHeadingColor="blue"
                    style={{ textDecorationLine: "underline" }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </SectionCard>

        {/* Work Experience Section */}
        <SectionCard title="Work Experience">
          {profile?.workExperience?.map((work, index) => (
            <View key={index} style={styles.workItem}>
              <CustomText
                style={styles.subTitle}
                subHeading={work.workplaceName}
              />
              <InfoItem label="Job Profile" value={work.jobProfile} />
              <InfoItem
                label="From"
                value={new Date(work.from).toLocaleDateString()}
              />
              <InfoItem
                label="To"
                value={new Date(work.to).toLocaleDateString()}
              />
            </View>
          ))}
        </SectionCard>

        {/* Language Proficiency Section */}
        <SectionCard title="Language Proficiency">
          {profile?.languageProficiency?.map((lang, index) => (
            <View key={index} style={styles.languageItem}>
              <CustomText style={styles.subTitle} subHeading={lang.testName} />
              <InfoItem
                label="Date of Test"
                value={new Date(lang.dateOfTest).toLocaleDateString()}
              />
              {/* <InfoItem label="Individual Band" value={lang.individualBand} /> */}
              <InfoItem label="Overall Band" value={lang.overallBand} />
            </View>
          ))}
        </SectionCard>

        {/* Financial Details Section */}
        <SectionCard title="Financial Details">
          {profile?.financialDetails?.map((finance, index) => (
            <View key={index} style={styles.financeItem}>
              <InfoItem
                label="Total Family Income"
                value={`$${finance.totalFamilyIncome}`}
              />
              <InfoItem label="Sponsors" value={finance.sponsors} />
              <InfoItem
                label="Fund Available"
                value={`$${finance.fundAvailable}`}
              />
            </View>
          ))}
        </SectionCard>

        {/* Study Preferences Section */}
        <SectionCard title="Study Preferences">
          {profile?.studyPreferences?.map((pref, index) => (
            <View key={index} style={styles.preferenceItem}>
              <InfoItem
                label="Preferred Country"
                value={pref.preferredCountry}
              />
              <InfoItem
                label="Preferred University"
                value={pref?.university?.institutionName}
              />
              {/* <InfoItem
                label="Preferred College"
                value={pref.preferredCollege}
              /> */}
              <InfoItem
                label="Course Preference"
                value={pref?.course?.courseName}
              />
            </View>
          ))}
        </SectionCard>
        <View style={{ paddingHorizontal: 16, marginVertical: 16 }}>
          <CustomButton
            title="Change Status"
            background={THEME[theme].primary}
            onPress={() => setStatusModalVisible(true)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { alignItems: "center", marginVertical: 16 },
  profilePicture: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 20, marginTop: 8 },
  email: { fontSize:RFValue(16), color: "gray", marginVertical: 4 },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    borderRadius: 24,
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    marginBottom: 10,
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 20,
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 8,
    zIndex: 10, // Make sure dropdown appears above other elements
  },
  dropdownMenu: {
    borderColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  sectionTitle: { fontSize: RFValue(18), marginBottom: 8 },
  infoItem: { flexDirection: "row", marginVertical: 4 },
  label: { width: 150 },
  value: { flex: 1, color: "gray" },
  bio: { fontSize:RFValue(16), fontStyle: "italic", marginBottom: 8 },
  interestsContainer: { flexDirection: "row", flexWrap: "wrap" },
  interestTag: {
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    padding: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: { color: "#000" },
  educationItem: { marginBottom: 12 },
  subTitle: { fontSize:RFValue(16), marginBottom: 4 },
  workItem: { marginBottom: 12 },
  languageItem: { marginBottom: 12 },
  financeItem: { marginBottom: 12 },
  preferenceItem: { marginBottom: 12 },
});

export default ApplicationDetails;
