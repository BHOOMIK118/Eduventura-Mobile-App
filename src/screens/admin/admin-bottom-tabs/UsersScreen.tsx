import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import Search from "@components/Search";
import { useFocusEffect } from "@react-navigation/native";
import CustomText from "@components/CustomText";
import { API_BASE_URL } from "@utils/constant";
import { useAuth } from "@context/AuthContext";
import { Calendar } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";


const UsersScreen = () => {
  const { theme, setNotification } = useUI();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const [userList, setUserList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false); // State for showing the date picker
  const [selectedDate, setSelectedDate] = useState("");

  useFocusEffect(
    useCallback(() => {
      fetchUserList(searchQuery, selectedDate, pageNo);
      return () => {
        // setUsersList([]);
        // setSearchQuery("");
      };
    }, [pageNo])
  );

  const handleFromDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    const current = selectedDate || new Date();
    setShowDatePicker(false);
    setSelectedDate(current);
    setPageNo(1);
    fetchUserList(searchQuery, selectedDate, 1);
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
      fetchUserList(searchText, selectedDate, 1);
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
    fetchUserList("", "", 1);
  };

  // const handleSave = () => {
  //   // setUser({
  //   //   ...user,
  //   //   name: editedName,
  //   //   email: editedEmail,
  //   //   role: editedRole,
  //   // });
  //   // setIsEditing(false);
  // };

  // const handleDelete = () => {
  //   // In a real app, you would typically call an API to delete the user
  //   // console.log("User deleted:", user[0].id);
  // };

  const fetchUserList = async (search = "", date = "", pageNo = 1) => {
    console.warn("Search, Date & Page:", search, date, pageNo);
    try {
      setLoading(true);
      const formattedDate = date
        ? new Date(date).toISOString().split("T")[0]
        : "";
      const queryParams: any = new URLSearchParams();
      if (search) queryParams.append("name", search); // Remove encodeURIComponent here
      if (formattedDate) queryParams.append("creationDate", formattedDate); // Correct key
      queryParams.append("page", pageNo);
      queryParams.append("pageSize", 10);
      const url = `${API_BASE_URL}/api/v1/getAllUsers?${queryParams.toString()}`;
      console.log("Generated URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        // console.log("success", data);
        // prettier("success", data);
        setUserList((prev) =>
          pageNo === 1 ? data.data : [...prev, ...data.data]
        );
        setHasMore(data.data.length > 0);
      } else {
        console.warn("error", data);
        setNotification({
          title: "Failed to fetch users list",
          duration: 1200,
          message: "Could not fetch users list at this moment",
          success: false,
          visible: true,
        });
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed to fetch users list",
        duration: 1200,
        message: "Could not fetch users list at this moment",
        success: false,
        visible: true,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.card, { marginHorizontal: 2 }]}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
          style={styles.avatar}
        />
        <View style={styles.infoContainer}>
          {isEditing ? null : ( // </> //   /> //     placeholder="Role" //     onChangeText={setEditedRole} //     value={editedRole} //     style={styles.input} //   <TextInput //   /> //     keyboardType="email-address" //     placeholder="Email" //     onChangeText={setEditedEmail} //     value={editedEmail} //     style={styles.input} //   <TextInput //   /> //     placeholder="Name" //     onChangeText={setEditedName} //     value={editedName} //     style={styles.input} //   <TextInput // <>
            <>
              {/* <Text style={styles.role}>{item.role}</Text> */}
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <CustomText heading="Name: " headingFontSize={14} />
                <CustomText
                  subHeading={item.name || "Not provided"}
                  subHeadingColor={THEME[theme].inputTextColor}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <CustomText heading="Email: " headingFontSize={14} />
                <CustomText
                  subHeading={item.email || "Not provided"}
                  subHeadingColor={THEME[theme].inputTextColor}
                />
              </View>
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <CustomText heading="Contact Number: " headingFontSize={14} />
                <CustomText
                  subHeading={item.mobileNumber || "Not provided"}
                  subHeadingColor={THEME[theme].inputTextColor}
                />
              </View>
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <CustomText heading="Country: " headingFontSize={14} />
                <CustomText
                  subHeading={item.country || "Not provided"}
                  subHeadingColor={THEME[theme].inputTextColor}
                />
              </View>
            </>
          )}
        </View>
        {/* <View style={styles.actionsContainer}>
          {isEditing ? (
            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <MaterialCommunityIcons
                name="content-save"
                size={24}
                color="#4A90E2"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsEditing(true)}
            >
              <MaterialCommunityIcons name="pencil" size={24} color="#4A90E2" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <MaterialCommunityIcons name="delete" size={24} color="#E74C3C" />
          </TouchableOpacity>
        </View> */}
      </View>
    );
  };

  return (
    <View style={[styles.container, { gap: 16, padding: 16, }]}>
      <Search
        placeholderColor={THEME[theme].inputTextColor}
        textColor={THEME[theme].text.secondary}
        value={searchQuery}
        onSearchChange={handleInputChange}
        backgroundColor={"white"}
        borderColor={THEME[theme].disabled}
        icon={"magnify"}
        placeholder={"Find your user"}
        iconColor={THEME[theme].text.secondary}
      />
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {selectedDate && (
          <TouchableOpacity
            onPress={() => {
              if(pageNo!==1){
                setPageNo(1);
              }
              else{
                
                fetchUserList(searchQuery,"",pageNo);
              }
              setSelectedDate("")
              // setPageNo(1);
            }}
            style={{
              backgroundColor: THEME[theme].inputTextFieldBorderColor,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 4,
            }}
          >
            <MaterialCommunityIcons name="close" size={12}  style={{position:'absolute',right:1,top:1}}/>
            <CustomText
           
              subHeading={new Date(selectedDate).toLocaleDateString()}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: THEME[theme].primary,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
          onPress={() => setShowDatePicker(true)}
        >
          <Calendar size={12} color="white" />
          <CustomText subHeading="Filter By Date" subHeadingColor="white" />
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleFromDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* {userList.length > 0 ? ( */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={userList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{ flexGrow: 1 }}
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
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
                  subHeading="No User found."
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

export default UsersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize:RFValue(16),
    color: "#666",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize:RFValue(14),
    color: "#666",
    marginBottom: 2,
  },
  role: {
    fontSize:RFValue(14),
    color: "#999",
  },
  input: {
    fontSize:RFValue(16),
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    marginBottom: 8,
    paddingVertical: 4,
  },
  actionsContainer: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
  },
});
