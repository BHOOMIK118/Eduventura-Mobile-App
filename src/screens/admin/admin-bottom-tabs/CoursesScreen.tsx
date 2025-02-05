import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Search from "@components/Search";
import { THEME } from "@utils/ui";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useUI } from "@context/UIContext";
import { useAuth } from "@context/AuthContext";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";
import CustomText from "@components/CustomText";
import { University } from "lucide-react-native";
import { RFValue } from "react-native-responsive-fontsize";



const CoursesScreen = () => {
  const [courseList, setCourseList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingPriority, setEditingPriority] = useState("");

  const { theme, setNotification, setFullscreenLoading } = useUI();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const { token } = useAuth();
  const { setOptions, navigate } = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourseList = async (search, pageNo) => {
    console.warn("search & page", search, pageNo);
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/api/v1/getAllCourses${
        search !== ""
          ? `?courseName=${encodeURIComponent(
              search
            )}&page=${pageNo}&pageSize=10`
          : `?page=${pageNo}&pageSize=10`
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-jwt-assertion": SYSTEM_TOKEN,
        },
      });

      const data = await response.json();
      if (response.ok) {
        // console.info("success", data);
        setCourseList((prev) =>
          pageNo === 1 ? data.data : [...prev, ...data.data]
        );
        setHasMore(data.data.length > 0);
      } else {
        console.warn("error", data);
        setNotification({
          title: "Failed to fetch course list",
          duration: 1200,
          message: "Could not fetch courses at this moment",
          success: false,
          visible: true,
        });
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed to fetch course list",
        duration: 1200,
        message: "Could not fetch courses at this moment",
        success: false,
        visible: true,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigate("CREATECOURSE")}>
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={"white"}
              style={{
                backgroundColor: THEME[theme].primary,
                padding: 8,
                borderRadius: 50,
                marginRight: 12,
              }}
            />
          </TouchableOpacity>
        ),
      });
      fetchCourseList(searchQuery, pageNo);
      return()=>{
        // setPageNo(1);
        // setHasMore(true);
        // setUniversities([]);
        // setSearchQuery("")
      }
    }, [pageNo])
  );

  const handlePrioritySet = async (courseId, priority) => {
    try {
      const payload = {
        courseId,
        priority: Number(priority),
      };
      console.log("hellosfsaf", payload);
      setFullscreenLoading(true);
      const response = await fetch(
        API_BASE_URL + "/api/v1/updateCoursePriority",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setEditingId(null);
        setEditingPriority("");
        console.log("successfully changed the priority ", data);
        setNotification({
          title: "Success",
          message: "You have successfully changed the priority",
          success: true,
          visible: true,
          duration: 1200,
        });
        fetchCourseList("",1);
      } else {
        console.warn("error", data);
        setNotification({
          title: "Failed to set priority",
          message: "Could not change the priority",
          success: false,
          visible: true,
          duration: 1200,
        });
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed to set priority",
        message: "Could not change the priority",
        success: false,
        visible: true,
        duration: 1200,
      });
    } finally {
      setFullscreenLoading(false);
    }
  };

  const handlePriorityDelete = async (courseId) => {
    try {
      const payload = {
        courseId,
      };
      console.log("fs", payload);
      setFullscreenLoading(true);
      const response = await fetch(
        API_BASE_URL + "/api/v1/clearCoursePriority",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("successfully deleted the priority ", data);
        setNotification({
          title: "Success",
          message: "You have successfully deleted the priority",
          success: true,
          visible: true,
          duration: 1200,
        });
        setEditingId(null);
        setEditingPriority("");
        fetchCourseList("",1);
      } else {
        console.warn("error", data);
        setNotification({
          title: "Failed to delete priority",
          message: "Could not delete the priority",
          success: false,
          visible: true,
          duration: 1200,
        });
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed to delete priority",
        message: "Could not delete the priority",
        success: false,
        visible: true,
        duration: 1200,
      });
    } finally {
      setFullscreenLoading(false);
    }
  };

  const debounce = (func: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetchData = useCallback(
    debounce((searchText: string) => {
      setPageNo(1); // Reset page number on new search
      fetchCourseList(searchText, 1);
    }, 300),
    []
  );

  const loadMore = () => {
    if (!loading && hasMore) {
      setPageNo((prev) => prev + 1);
    }
  };

  const handleInputChange = (text) => {
    setSearchQuery(text);
    debouncedFetchData(text);
  };

  const renderItem = ({ item, index }) => {
    const isEditing = editingId === index;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigate("CREATECOURSE", { edit: true, data: item })}
      >
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
          }}
          style={styles.image}
        />
        <View style={[styles.content, { gap: 0 }]}>
          <CustomText numberOfLines={2} heading={item.courseName} />

          {/* <Text style={styles.instructor}>{item.instructor}</Text> */}
          <View style={[styles.details, { marginVertical: 8 }]}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color="#666"
              />
              <CustomText
                style={styles.detailText}
                subHeading={item.courseDuration? item.courseDuration+' Weeks' : "Not mentioned"}
              />
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="signal-cellular-2"
                size={16}
                color="#666"
              />
              <CustomText
                style={styles.detailText}
                subHeading={item.courseLevel}
              />
            </View>
          </View>
          <View
            style={[styles.ratingContainer, { alignItems: "center", gap: 4 }]}
          >
            <University size={16} color={THEME[theme].primary} />
            <CustomText
              headingFontSize={14}
              heading={item?.university?.institutionName}
            />
          </View>

          <CustomText
            headingFontSize={12}
            style={{ marginLeft: 20 }}
            headingColor={THEME[theme].inputTextColor}
            heading={item?.university?.institutionType}
          />
          <View
            style={[
              styles.priorityContainer,
              { marginVertical: 4, marginTop: 16 },
            ]}
          >
            <CustomText
              // headingColor="white"
              heading="Priority"
              headingFontSize={14}
            />
            {isEditing ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={[
                    styles.priorityInput,

                    {
                      height: 30,
                      fontFamily: "Regular",
                      fontSize: RFValue(12),
                      width: 60,
                      borderColor: THEME[theme].inputTextFieldBorderColor,
                      borderWidth: 1,
                    },
                  ]}
                  value={editingPriority}
                  onChangeText={setEditingPriority} // Use the parent state setter here
                  keyboardType="numeric"
                  placeholder="Enter priority"
                  placeholderTextColor="#CCCCCC"
                />
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    { backgroundColor: THEME[theme].primary },
                  ]}
                  onPress={
                    () =>
                      handlePrioritySet(item.cricosCourseCode, editingPriority)
                    // console.log("item", item)
                  } // Save the priority
                >
                  <CustomText subHeadingColor="white" subHeading="Save" />
                </TouchableOpacity>
                {item.priority &&
                <TouchableOpacity
                style={[
                  styles.saveButton,
                  { backgroundColor: "red", marginLeft: 4 },
                ]}
                  onPress={
                    () => handlePriorityDelete(item.cricosCourseCode)
                    // console.log("item", item)
                  } // Save the priority
                >
                  <MaterialCommunityIcons
                    name="delete"
                    size={20}
                    color={"white"}
                    />
                  {/* <CustomText subHeadingColor="white" subHeading="Delete" /> */}
                </TouchableOpacity>
              }
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    {
                      marginLeft: 4,
                      backgroundColor: THEME[theme].inputTextFieldBorderColor,
                    },
                  ]}
                  onPress={() => {
                    setEditingId(null); // Close editing
                    setEditingPriority(""); // Reset the input
                  }}
                >
                  <CustomText subHeadingColor="white" subHeading="Cancel" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.priorityDisplay}>
                <CustomText
                  subHeading={item.priority || "Not set"}
                  // subHeadingColor="white"
                  style={{ marginRight: 16 }}
                />
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setEditingId(index);
                    setEditingPriority(
                      item.priority ? item.priority.toString() : ""
                    ); // Set the priority to edit
                  }}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={16}
                    // color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    if(pageNo!=1){

      setPageNo(1);
    }
    else{
      fetchCourseList("",1);
    }
    setSearchQuery("");
    setRefreshing(false)
    // fetchCourseList("", 1);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white", gap: 16, padding: 16 }}>
      <Search
        placeholderColor={THEME[theme].inputTextColor}
        textColor={THEME[theme].text.secondary}
        value={searchQuery}
        onSearchChange={handleInputChange}
        backgroundColor={"white"}
        borderColor={THEME[theme].disabled}
        icon={"magnify"}
        placeholder={"Find your course"}
        iconColor={THEME[theme].text.secondary}
      />

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 2, flexGrow: 1 }}
        data={courseList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={THEME[theme].primary} />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CustomText
                style={{ color: THEME[theme].text.secondary, fontSize:RFValue(16) }}
                subHeading="No courses found."
              />
            </View>
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default CoursesScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  instructor: {
    fontSize:RFValue(14),
    color: "#666",
    marginBottom: 8,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    marginLeft: 4,
    fontSize: RFValue(12),
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontSize:RFValue(14),
    fontWeight: "bold",
    color: "#333",
  },
  priorityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priorityText: {
    fontSize:RFValue(16),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  priorityDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityValue: {
    fontSize:RFValue(16),
    color: "#FFFFFF",
    marginRight: 8,
  },
  editButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    padding: 6,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityInput: {
    height: 36,
    // width: 60,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
    paddingHorizontal: 8,
    // color: "#FFFFFF",
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
