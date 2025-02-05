import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import CustomText from "@components/CustomText";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import Search from "@components/Search";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";
import CourseCard from "@components/CourseCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FeatureSection from "@components/FeatureSection";
import PopularUniversities from "@components/PopularUniversities";
import CarouselComponent from "@components/CarouselComponent";
import { RFValue } from "react-native-responsive-fontsize";


interface Course {
  id: string;
  courseName: string;
  tuitionFee: string;
  university: any;
}

const Dashboard = () => {
  const { theme, setNotification, setFullscreenLoading } = useUI();

  const { navigate } = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [courseList, setCourseList] = useState<Course[]>([]);

  const fetchCourseList = async () => {
    try {
      // setFullscreenLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/getAllCourses?page=2&pageSize=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-jwt-assertion": SYSTEM_TOKEN,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCourseList(data.data);
        console.log("fetched successfully");
      } else {
        console.log("error", data);
        setNotification({
          title: "Fetch Status",
          message: "Failed to fetch course list",
          duration : 1800,
          visible: true,
          success: false,
        });
      }
    } catch (error) {
      console.error("err", error);
      setNotification({
        title: "Fetch Status",
        message: "Failed to fetch course list",
        duration : 1800,
        visible: true,
        success: false,
      });
    } finally {
      // setFullscreenLoading(false)
    }
  };

  useEffect(() => {
    fetchCourseList();
  }, []);

  return (
    <View
      style={{ flex: 1, backgroundColor: THEME[theme].background, padding: 16 }}
    >
      <CustomText
        heading="Find your favorite university here"
        headingColor={THEME[theme].primary}
      />
      {/* <View style={{ marginVertical: 16 }}>
        <Search
          placeholderColor={THEME[theme].inputTextColor}
          textColor={THEME[theme].text.secondary}
          // value={search}
          // onSearchChange={handleInputChange} // Update to use handleInputChange
          backgroundColor={"white"}
          borderColor={THEME[theme].disabled}
          icon={"magnify"}
          placeholder={"Search your university here"}
          iconColor={THEME[theme].text.secondary}
        />
      </View> */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1,marginTop:16 }}
        showsVerticalScrollIndicator={false}
      >
        <CarouselComponent />

        <View style={styles.trendingSection}>
          <FeatureSection />
          <View style={{ marginVertical: 16, gap: 16 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <CustomText heading="Popular Universities" />
              <TouchableOpacity
                onPress={() =>
                  navigate("AUTHENTICATED", { screen: "Universities" })
                }
              >
                <CustomText
                  heading="View all"
                  headingColor={THEME[theme].primary}
                  headingFontSize={14}
                />
              </TouchableOpacity>
            </View>

            <PopularUniversities />
          </View>

          <TouchableOpacity
            style={{ marginVertical: "5%" }}
            onPress={() => navigate("AUTHENTICATED", { screen: "Courses" })}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <CustomText
                style={styles.sectionTitle}
                heading="Trending Courses"
              />
              <CustomText
                heading="View all"
                headingColor={THEME[theme].primary}
                headingFontSize={14}
              />
            </View>
          </TouchableOpacity>

          <FlatList
            data={courseList}
            contentContainerStyle={{}}
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={({ item, index }) => (
              <CourseCard item={item} width={200} height={120}  />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  trendingSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: RFValue(20),
    marginBottom: 15,
  },
  courseCard: {
    width: 200,
    marginRight: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    overflow: "hidden",
  },
  courseImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#DDD",
  },
  courseTitle: {
    fontSize:RFValue(16),
    padding: 10,
  },
  courseSubtitle: {
    fontSize:RFValue(14),
    color: "#666",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  noResults: {
    textAlign: "center",
    fontSize:RFValue(16),
    color: "#666",
    marginTop: 20,
  },
});
