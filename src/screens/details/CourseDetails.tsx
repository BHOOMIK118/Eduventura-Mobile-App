import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomText from "@components/CustomText";
import { prettier } from "@utils/helpers";
import { RFValue } from "react-native-responsive-fontsize";

import {
  Banknote,
  Book,
  Building,
  CheckCircle,
  ClockIcon,
  Code,
  GraduationCap,
  Link,
} from "lucide-react-native";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import { useAuth } from "@context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";

const CourseDetails: FC = () => {
  const route = useRoute();
  const { params }: any = route;
  const { kycDetails } = useAuth();
  const { course } = params;
  const { navigate } = useNavigation<any>();
  const { theme } = useUI();
  // prettier("course", course);

  return (
    <View style={styles.container}>
      <View style={{}}>
        <Image
          source={{ uri: course?.university?.image }}
          style={styles.heroImage}
          // blurRadius={10}
        />
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.8)"]} // Gradient colors
          style={styles.gradient}
        />

        <View
          style={[
            styles.heroContent,
            {bottom:48}

            // { backgroundColor: "rgba(0, 0, 0, 0.1)" },
          ]}
        >
          <CustomText
            style={styles.heroTitle}
            heading={course?.university?.institutionName}
          />
          <CustomText
            style={[styles.heroSubtitle]} // Ensures the text shrinks to fit
            subHeading={course?.courseName}
            numberOfLines={1}
          />
        </View>
        <View
          style={[
            {
              flexDirection: "row-reverse",
              alignItems: "center",
              // backgroundColor: "red",
              justifyContent: "flex-end",
              gap: 16,
              position: "absolute",
              bottom: 8,
              width: "100%",
              paddingHorizontal: 16,
            },
          ]}
        >
          <View style={styles.assignmentHeader}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  course.university.website.startsWith("http")
                    ? course.university?.website
                    : `https://` + course.university.website
                ).catch((err) => console.error("Failed to open URL", err))
              }
            >
              <Link size={20} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.applyButton,
              { backgroundColor: course?.expired==="Yes"?THEME[theme].disabled:THEME[theme].primary },
            ]}
            disabled={course?.expired==="Yes"}
            onPress={() => {
              // prettier("dsd", kycDetails);
              const kyc = kycDetails?.user?.profile;

              if (
                kyc?.educationHistory.length === 0 ||
                kyc?.workExperience.length === 0 ||
                kyc?.languageProficiency.length === 0 ||
                kyc?.studyPreferences.length === 0
              ) {
                console.warn("complete your kyc");
                Alert.alert(
                  "KYC Required", // Title of the alert
                  "Please complete your KYC to proceed.", // Message
                  [
                    {
                      text: "Cancel", // Button to dismiss
                      style: "cancel",
                    },
                    {
                      text: "Go to Profile", // Button to navigate
                      onPress: () => navigate("EDITPROFILE"),
                    },
                  ]
                );
              } else {
                navigate("COMPLETEKYC", { courseData: course });
              }
            }}
          >
            <CustomText style={styles.applyButtonText} heading={course?.expired==="Yes"?"Expired":"Apply Now"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.assignmentList}>
          <View style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <GraduationCap size={20} color={THEME[theme].primary} />
              <View style={styles.assignmentTitleContainer}>
                <CustomText
                  style={styles.assignmentTitle}
                  heading="Course Name"
                />
                <CustomText
                  style={styles.assignmentSubtitle}
                  subHeading={course.courseName}
                />
              </View>
            </View>
          </View>
          </View>
        <View style={styles.assignmentList}>
          <View style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <Book size={20} color={THEME[theme].primary} />
              <View style={styles.assignmentTitleContainer}>
                <CustomText
                  style={styles.assignmentTitle}
                  heading="Field Of Study"
                />
                <CustomText
                  style={styles.assignmentSubtitle}
                  subHeading={course?.foeDF?.split(' - ')[1]}
                />
              </View>
            </View>
          </View>
          </View>
        <View style={styles.assignmentList}>
          <View style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <GraduationCap size={20} color={THEME[theme].primary} />
              <View style={styles.assignmentTitleContainer}>
                <CustomText
                  style={styles.assignmentTitle}
                  heading="Dual Qualification"
                />
                <CustomText
                  style={styles.assignmentSubtitle}
                  subHeading={course?.dualQualification}
                />
              </View>
            </View>
          </View>
          <View style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <Code size={20} color={THEME[theme].primary} />
              <View style={styles.assignmentTitleContainer}>
                <CustomText
                  style={styles.assignmentTitle}
                  heading="Course Code"
                />
                <CustomText
                  style={styles.assignmentSubtitle}
                  subHeading={course.cricosCourseCode}
                />
              </View>
            </View>
          </View>

          <View style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <CheckCircle size={20} color={THEME[theme].primary} />
              <View style={styles.assignmentTitleContainer}>
                <CustomText
                  style={styles.assignmentTitle}
                  heading="Course Level"
                />
                <CustomText
                  style={styles.assignmentSubtitle}
                  subHeading={course.courseLevel}
                />
              </View>
            </View>
          </View>
          <View style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <ClockIcon size={20} color={THEME[theme].primary} />
              <View style={styles.assignmentTitleContainer}>
                <CustomText
                  style={styles.assignmentTitle}
                  heading="Course Duration"
                />
                <CustomText
                  style={styles.assignmentSubtitle}
                  subHeading={course.courseDuration+" (Weeks)" || "Not Available"}
                />
              </View>
            </View>
          </View>
          <View style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <Banknote size={20} color={THEME[theme].primary} />
              <View style={styles.assignmentTitleContainer}>
                <CustomText
                  style={styles.assignmentTitle}
                  heading="Total Fee"
                />
                <CustomText
                  style={styles.assignmentSubtitle}
                  subHeading={`$${course.totalFee}`}
                />
              </View>
            </View>
          </View>
          <View style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <Banknote size={20} color={THEME[theme].primary} />
              <View style={styles.assignmentTitleContainer}>
                <CustomText
                  style={styles.assignmentTitle}
                  heading="Course Language"
                />
                <CustomText
                  style={styles.assignmentSubtitle}
                  subHeading={`${course?.courseLanguage}`}
                />
              </View>
            </View>
          </View>
          <View style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <Building size={20} color={THEME[theme].primary} />
              <View style={styles.assignmentTitleContainer}>
                <CustomText
                  style={styles.assignmentTitle}
                  heading="Institution Address"
                />
                <CustomText
                  style={styles.assignmentSubtitle}
                  subHeading={`${course?.university?.postalAddressLine1 +
                    ", " +
                    course?.university?.postalAddressCity +
                    ", " +
                    course?.university?.postalAddressState}`}
                />
              </View>
            </View>
          </View>
          <View style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <Building size={20} color={THEME[theme].primary} />
              <View style={styles.assignmentTitleContainer}>
                <CustomText
                  style={styles.assignmentTitle}
                  heading="Institution Capacity"
                />
                <CustomText
                  style={styles.assignmentSubtitle}
                  subHeading={`${course.university.institutionCapacity}`}
                />
              </View>
            </View>
          </View>
          <View style={styles.assignmentItem}>
            <View style={styles.assignmentHeader}>
              <Building size={20} color={THEME[theme].primary} />
              <View style={styles.assignmentTitleContainer}>
                <CustomText
                  style={styles.assignmentTitle}
                  heading="Institution Type"
                />
                <CustomText
                  style={styles.assignmentSubtitle}
                  subHeading={`${course.university.institutionType}`}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CourseDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    // Adjust height for the gradient
  },
  applyButton: {
    // flex: 1,
    borderWidth: 1,
    borderColor: "#13478b",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontSize: RFValue(14),
    // fontWeight: "600",
  },
  heroContainer: {
    // position: "relative",
  },
  heroTitle: {
    color: "#fff",
    fontSize: RFValue(24),
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    flexWrap: "wrap",
  },
  heroSubtitle: {
    color: "white",
    fontSize: RFValue(16),
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroContent: {
    position: "absolute",
    bottom: 80,
    // top: 0,
    marginHorizontal: 16,
    // left: 16,
  },
  description: {
    fontSize: RFValue(14),
    color: "#3498db",
    lineHeight: 20,
    textDecorationLine: "underline",
  },
  header: {
    position: "relative",
    // borderBottomLeftRadius: 12,
    // borderBottomRightRadius: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: RFValue(20),
    marginBottom: 12,
  },
  nav: {
    flexDirection: "row",
  },
  navItem: {
    color: "#fff",
    marginRight: 20,
    fontSize: RFValue(16),
  },
  heroImage: {
    width: "100%",
    height: 200,
    // borderBottomLeftRadius: 24,
    // borderBottomRightRadius: 24,
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  notification: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  notificationText: {
    marginLeft: 12,
    color: "#666",
    flex: 1,
  },
  assignmentList: {
    gap: 16,
  },
  assignmentItem: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
  },
  assignmentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  assignmentTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  assignmentTitle: {
    fontSize: RFValue(14),
    color: "#111",
  },
  assignmentSubtitle: {
    color: "#666",
    marginTop: 4,
    fontSize: RFValue(12),
  },
  dueDate: {
    color: "#666",
    marginTop: 4,
  },
  assignmentStatus: {
    alignItems: "flex-end",
  },
  completionText: {
    color: "#13478b",
    fontWeight: "600",
  },
  weightText: {
    color: "#666",
    marginTop: 4,
  },
});
