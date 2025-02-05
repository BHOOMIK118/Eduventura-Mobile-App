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
import React, { useCallback, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomText from "@components/CustomText";
import Search from "@components/Search";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";
import { useAuth } from "@context/AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";


const initialUniversities = [
  {
    id: "1",
    name: "Harvard University",
    location: "Cambridge, MA",
    ranking: 1,
    priority: 0,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Harvard_Medical_School_HDR.jpg/640px-Harvard_Medical_School_HDR.jpg",
    acceptanceRate: "4.6%",
    tuition: "$51,925",
  },
  {
    id: "2",
    name: "Stanford University",
    location: "Stanford, CA",
    ranking: 2,
    priority: 0,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Harvard_Medical_School_HDR.jpg/640px-Harvard_Medical_School_HDR.jpg",
    acceptanceRate: "4.3%",
    tuition: "$56,169",
  },
  {
    id: "3",
    name: "MIT",
    location: "Cambridge, MA",
    ranking: 3,
    priority: 0,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Harvard_Medical_School_HDR.jpg/640px-Harvard_Medical_School_HDR.jpg",
    acceptanceRate: "6.7%",
    tuition: "$53,790",
  },
  {
    id: "4",
    name: "University of California, Berkeley",
    location: "Berkeley, CA",
    ranking: 4,
    priority: 0,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Harvard_Medical_School_HDR.jpg/640px-Harvard_Medical_School_HDR.jpg",
    acceptanceRate: "17.5%",
    tuition: "$14,312",
  },
  {
    id: "5",
    name: "University of Michigan",
    location: "Ann Arbor, MI",
    ranking: 5,
    priority: 0,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Harvard_Medical_School_HDR.jpg/640px-Harvard_Medical_School_HDR.jpg",
    acceptanceRate: "26.1%",
    tuition: "$15,558",
  },
];

const UniversitiesScreen = () => {
  const [editingId, setEditingId] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [editingPriority, setEditingPriority] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setNotification, setFullscreenLoading } = useUI();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useAuth();
  const { setOptions, navigate } = useNavigation<any>();

  useFocusEffect(
    useCallback(() => {
      setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigate("CREATEUNIVERSITY")}>
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
      fetchUniversityList(searchQuery, pageNo);
      return () => {
        // setPageNo(1);
        // setHasMore(true);
        // setUniversities([]);
        // setSearchQuery("")
      };
    }, [pageNo])
  );

  const handlePrioritySet = async (universityId, priority) => {
    try {
      const payload = {
        universityId,
        priority: Number(priority),
      };
      console.log("hellosfsaf", payload);
      setFullscreenLoading(true);
      const response = await fetch(API_BASE_URL + "/api/v1/updatePriority", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        setEditingId(null);
        setEditingPriority("");
        console.log("successfully changed the priority ", data);
        fetchUniversityList("", 1);
        setNotification({
          title: "Success",
          message: "You have successfully changed the priority",
          success: true,
          visible: true,
          duration: 1200,
        });
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

  const handlePriorityDelete = async (universityId) => {
    try {
      const payload = {
        universityId,
      };
      console.log("fs", payload);
      setFullscreenLoading(true);
      const response = await fetch(API_BASE_URL + "/api/v1/clearPriority", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
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
        fetchUniversityList("", 1);
        setEditingId(null);
        setEditingPriority("");
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
  const fetchUniversityList = async (search, pageNo) => {
    console.warn("search & page", search, pageNo);
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/api/v1/getInstitution${
        search !== ""
          ? `?institutionName=${encodeURIComponent(
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
        setUniversities((prev) =>
          pageNo === 1 ? data.data : [...prev, ...data.data]
        );
        setHasMore(data.data.length > 0);
      } else {
        console.warn("error", data);
        setNotification({
          title: "Failed to fetch university list",
          duration: 1200,
          message: "Could not fetch universities at this moment",
          success: false,
          visible: true,
        });
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed to fetch university list",
        duration: 1200,
        message: "Could not fetch universities at this moment",
        success: false,
        visible: true,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderUniversityCard = ({ item, index }) => {
    const isEditing = editingId === index;
    // console.log('hello',editingId,index)
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigate("CREATEUNIVERSITY", { edit: true, data: item })}
      >
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Harvard_Medical_School_HDR.jpg/640px-Harvard_Medical_School_HDR.jpg",
            // Use item-specific image
          }}
          style={styles.cardImage}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <CustomText
                heading={item.institutionName}
                style={{ width: 200 }}
                headingColor="white"
              />
              <View style={styles.rankingContainer}>
                <MaterialCommunityIcons
                  name="school"
                  size={16}
                  color="#FFD700"
                />
                <CustomText
                  style={styles.rankingText}
                  subHeading={`${item.institutionCapacity}`}
                />
              </View>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.infoContainer}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={16}
                  color="#FFFFFF"
                />
                <CustomText
                  subHeading={
                    item.postalAddressCity + ", " + item?.postalAddressState
                  }
                  subHeadingColor="white"
                />
              </View>
            </View>
            <View style={[styles.priorityContainer, { marginTop: 24 }]}>
              <CustomText
                headingColor="white"
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
                      },
                    ]}
                    value={editingPriority}
                    onChangeText={setEditingPriority} // Use the parent state setter here
                    keyboardType="numeric"
                    placeholder="Enter priority"
                    placeholderTextColor="#CCCCCC"
                  />
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() =>
                      handlePrioritySet(
                        item.cricosProviderCode,
                        editingPriority
                      )
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
                  onPress={() =>
                    handlePriorityDelete(item.cricosProviderCode)
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
                      { marginLeft: 4, backgroundColor: "red" },
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
                    subHeadingColor="white"
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
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
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
      fetchUniversityList(searchText, 1);
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

  const onRefresh = () => {
    setRefreshing(true);
    if(pageNo!=1){

      setPageNo(1);
    }
    else{
      fetchUniversityList("",1);
    }
    setSearchQuery("");
    setRefreshing(false);
    // fetchUniversityList("", 1);
  };

  return (
    <View style={[styles.container, { gap: 16, padding: 16 }]}>
      <Search
        placeholderColor={THEME[theme].inputTextColor}
        textColor={THEME[theme].text.secondary}
        value={searchQuery}
        onSearchChange={handleInputChange}
        backgroundColor={"white"}
        borderColor={THEME[theme].disabled}
        icon={"magnify"}
        placeholder={"Find your university"}
        iconColor={THEME[theme].text.secondary}
      />
      <View style={{ flex: 1 }}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{ flexGrow: 1 }}
          data={universities}
          renderItem={renderUniversityCard}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item, index) => index.toString()}
          // contentContainerStyle={styles.listContainer}
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
                  subHeading="No universities found."
                />
              </View>
            )
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
      </View>
    </View>
  );
};

export default UniversitiesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  listContainer: {
    paddingHorizontal: 2,
  },
  card: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    padding: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  universityName: {
    fontSize: RFValue(24),
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 8,
  },
  rankingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rankingText: {
    marginLeft: 4,
    fontSize:RFValue(14),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardBody: {
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize:RFValue(14),
    color: "#FFFFFF",
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
    color: "#FFFFFF",
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
