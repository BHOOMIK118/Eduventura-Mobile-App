import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Heart, Play, ChevronRight } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomText from "@components/CustomText";
import { RFValue } from "react-native-responsive-fontsize";
import { useUI } from "@context/UIContext";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";
import { useAuth } from "@context/AuthContext";
import { prettier } from "@utils/helpers";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const thumbnails = [
  { id: 1, type: "video", image: require("@assets/images/university.jpg") },
  { id: 2, image: require("@assets/images/university.jpg") },
  { id: 3, image: require("@assets/images/university.jpg") },
  { id: 4, image: require("@assets/images/university.jpg") },
];

interface UniversityDetails {
  institutionName: string;
  institutionType: string;
  institutionCapacity: number;
  website: string;
  cricosProviderCode: string;
  postalAddressCity: string;
  postalAddressLine1: string;
  postalAddressPostcode: string;
  postalAddressState: string;
  description?: string;
  image?: string;
}

const UniversityDetails = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const route = useRoute();
  const { params }: any = route;
  const { universityDetails: details } = params;
  const { navigate } = useNavigation<any>();
  const [universityDetails, setUniversityDetails] =
    useState<UniversityDetails>();
  const { theme, setFullscreenLoading, setNotification } = useUI();
  const { token } = useAuth();

  // console.log("fs", details);

  const [selectedTerm, setSelectedTerm] = useState("Fall");

  const fetchUniversityDetails = async (universityId: string) => {
    try {
      // setFullscreenLoading(true);

      const response = await fetch(
        API_BASE_URL + `/api/v1/getUniversityById/${universityId}`,
        {
          method: "GET",
          headers: {
            "x-jwt-assertion": SYSTEM_TOKEN,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUniversityDetails(data.data);
      } else {
        console.warn("error", data);
        setNotification({
          title: "Failed to fetch university details",
          message: "Coulnd not fetch university details at this moment",
          duration: 1800,
          visible: true,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Network request failed",
        message: "Internal server error",
        duration: 1800,
        visible: true,
        success: false,
      });
    } finally {
      // setFullscreenLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversityDetails(details?.cricosProviderCode);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{paddingBottom:16}} showsVerticalScrollIndicator={false}>
        <View style={{}}>
          <Image
            source={{
              uri: details?.image && details?.image,
            }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.8)"]} // Gradient colors
            style={styles.gradient}
          />

          <View style={styles.heroContent}>
            <CustomText
              style={styles.heroTitle}
              heading={details?.institutionName}
            />
            <View
              style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            >
              <CustomText
                style={styles.heroSubtitle}
                subHeading={details?.postalAddressCity + ","}
              />
              <CustomText
                style={styles.heroSubtitle}
                subHeading={details?.postalAddressState}
              />
            </View>
          </View>
        </View>

        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
        >
          {thumbnails.map((thumb, index) => (
            <View key={thumb.id} style={styles.thumbnailWrapper}>
              <Image source={thumb.image} style={styles.thumbnail} />
              {thumb.type === "video" && (
                <View style={styles.playButton}>
                  <Play size={16} color="#fff" fill="#fff" />
                </View>
              )}
            </View>
          ))}
        </ScrollView> */}

        <View style={{ padding: 16, gap: 10, paddingBottom: 0 }}>
          <CustomText heading="Description" />
          <CustomText subHeading={details?.description ||universityDetails?.description} />
        </View>

        <View style={[styles.content, {}]}>
          <View style={styles.section}>
            <CustomText style={styles.sectionTitle} heading="Website" />

            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  details.website.startsWith("http")
                    ? details?.website
                    : `https://` + details.website
                ).catch((err) => console.error("Failed to open URL", err))
              }
            >
              <CustomText
                style={styles.description}
                subHeading={details?.website}
              />
            </TouchableOpacity>
            {/* <Text style={styles.readMore}>Read more.</Text> */}
          </View>

          <View style={styles.section}>
            <CustomText
              style={styles.sectionTitle}
              heading="Institution Address"
            />
            <CustomText
              style={styles.rankingText}
              subHeading={
                details?.postalAddressLine1 +
                ", " +
                details?.postalAddressCity +
                ", " +
                details?.postalAddressState
                // ", " +
                // details?.postalAddressPostcode
              }
            />
          </View>
          <View style={styles.section}>
            <CustomText
              style={styles.sectionTitle}
              heading="Institution Type"
            />
            <CustomText
              style={styles.rankingText}
              subHeading={details.institutionType}
            />
          </View>
          <View style={styles.section}>
            <CustomText
              style={styles.sectionTitle}
              heading="Institution Capacity"
            />
            <CustomText
              style={styles.rankingText}
              subHeading={details.institutionCapacity}
            />
          </View>

          {/* <View style={styles.section}>
            <CustomText style={styles.sectionTitle} heading="Start Date" />
            <View style={styles.termSelector}>
              {["Fall", "Spring", "Summer"].map((term) => (
                <TouchableOpacity
                  key={term}
                  style={[
                    styles.termButton,
                    selectedTerm === term && styles.termButtonActive,
                  ]}
                  onPress={() => setSelectedTerm(term)}
                >
                  <CustomText
                    style={[
                      styles.termButtonText,
                      selectedTerm === term && styles.termButtonTextActive,
                    ]}
                    subHeading={term}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.dateContainer}>
              <View style={styles.dateColumn}>
                <CustomText style={styles.dateLabel} heading="Start Date" />
                <CustomText
                  style={styles.dateValue}
                  subHeading="20 July, 2022"
                />
              </View>
              <View style={styles.dateColumn}>
                <CustomText
                  style={styles.dateLabel}
                  heading="Application Due"
                />
                <CustomText
                  style={styles.dateValue}
                  subHeading="24 August, 2022"
                />
              </View>
            </View>
          </View> */}

          {/* <TouchableOpacity style={styles.costButton}>
            <CustomText
              style={styles.costButtonText}
              heading="Select course to see the cost"
            />
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity> */}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() =>
                navigate("EXPLORECOURSES", { id: details.cricosProviderCode })
              }
            >
              <CustomText
                style={styles.applyButtonText}
                heading="Explore Courses"
              />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.consultButton}>
              <CustomText
                style={styles.consultButtonText}
                heading="Get Consultation"
              />
            </TouchableOpacity> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UniversityDetails;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heroContainer: {
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: 250,
    // borderBottomLeftRadius: 24,
    // borderBottomRightRadius: 24,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
     // Adjust height for the gradient
  },
  heartButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    padding: 8,
  },
  heroContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
  },
  heroTitle: {
    color: "#fff",
    fontSize: RFValue(24),
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    color: "#fff",
    fontSize: RFValue(16),
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  thumbnailContainer: {
    padding: 16,
    flexDirection: "row",
  },
  thumbnailWrapper: {
    position: "relative",
    marginRight: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 4,
  },
  content: {
    // padding: 16,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: RFValue(18),
    color: "#333",
    marginBottom: 4,
  },
  description: {
    fontSize: RFValue(14),
    color: "#3498db",
    lineHeight: 20,
    textDecorationLine: "underline",
  },
  readMore: {
    color: "#13478b",
  },
  rankingText: {
    fontSize: RFValue(14),
    color: "#666",
  },
  termSelector: {
    flexDirection: "row",
    marginBottom: 16,
  },
  termButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 12,
  },
  termButtonActive: {
    backgroundColor: "#13478b",
  },
  termButtonText: {
    color: "#666",
  },
  termButtonTextActive: {
    color: "#fff",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateColumn: {
    flex: 1,
  },
  dateLabel: {
    fontSize: RFValue(14),
    color: "#666",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: RFValue(14),
    color: "#333",
    fontWeight: "500",
  },
  costButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 24,
  },
  costButtonText: {
    fontSize: RFValue(14),
    color: "#666",
  },
  eligibilityLabel: {
    fontSize: RFValue(14),
    color: "#666",
    marginBottom: 4,
  },
  eligibilityValue: {
    fontSize: RFValue(16),
    color: "#333",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#13478b",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#13478b",
    fontSize: RFValue(16),
    fontWeight: "600",
  },
  consultButton: {
    flex: 1,
    backgroundColor: "#13478b",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  consultButtonText: {
    color: "#fff",
    fontSize: RFValue(16),
    fontWeight: "600",
  },
});
