import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Activity,
  Book,
  Calendar,
  University,
  UserCircle2,
} from "lucide-react-native";
import CustomText from "@components/CustomText";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import { API_BASE_URL } from "@utils/constant";
import { useAuth } from "@context/AuthContext";
import { prettier } from "@utils/helpers";
import DateTimePicker from "@react-native-community/datetimepicker";
import Search from "@components/Search";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

type Application = {
  applicationId: number;
  userId: number;
  universityId: string;
  courseId: string;
  status: string;
  applicationDate: string;
  lastUpdated: string;
  user: {
    name: string;
    email: string;
  };
  university: {
    institutionName: string;
  };
  course: {
    courseName: string;
  };
};

const ApplicationScreen = () => {
  const { theme, setFullscreenLoading, setNotification } = useUI();
  const [applicationList, setApplicationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { profile, clearToken, token, setProfile } = useAuth();
  const { navigate } = useNavigation<any>();
  const [showDatePicker, setShowDatePicker] = useState(false); // State for showing the date picker
  const [selectedDate, setSelectedDate] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageNo, setPageNo] = useState(1);

  const renderItem = ({ item }: { item: Application }) => {
    return (
      <TouchableOpacity
        style={[
          styles.applicationCard,
          { marginHorizontal: 2, marginTop: 2, gap: 16 },
        ]}
        onPress={() =>
          navigate("APPLICATIONDETAILS", {
            userId: item.userId,
            applicationId: item.applicationId,
          })
        }
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          <UserCircle2 color={THEME[theme].primary} />
          <CustomText
            heading={item.user.name}
            headingFontSize={14}
            subHeading={item?.user?.email}
            subHeadingFontSize={12}
            subHeadingColor={THEME[theme].text.secondary}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <University color={THEME[theme].primary} />
          <CustomText
            heading="University"
            headingFontSize={14}
            subHeading={item?.university?.institutionName}
            subHeadingFontSize={12}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Book color={THEME[theme].primary} />
          <CustomText
            heading="Course"
            headingFontSize={14}
            subHeadingFontSize={12}
            subHeading={item?.course?.courseName}
          />
        </View>

        <View style={styles.footer}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Calendar color={THEME[theme].primary} size={12} />
            <CustomText
              style={styles.date}
              subHeading={`Applied: ${new Date(
                item.applicationDate
              ).toLocaleDateString()}`}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Activity
              size={12}
              color={item.status === "PENDING" ? "#FFA500" : "#4CAF50"}
            />
            <CustomText
              style={[
                { color: item.status === "PENDING" ? "#FFA500" : "#4CAF50" },
              ]}
              headingFontSize={12}
              heading={item.status}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const fetchApplications = async (search = "", date = "", pageNo = 1) => {
    console.warn("Search, Date & Page:", search, date, pageNo);

    try {
      setLoading(true);
      const formattedDate = date
        ? new Date(date).toISOString().split("T")[0]
        : "";
      const queryParams: any = new URLSearchParams();
      if (search) queryParams.append("name", search); // Remove encodeURIComponent here
      if (formattedDate) queryParams.append("applicationDate", formattedDate); // Correct key
      queryParams.append("page", pageNo);
      queryParams.append("pageSize", 10);
      const url = `${API_BASE_URL}/api/v1/getApplication?${queryParams.toString()}`;
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
        setApplicationList((prev) =>
          pageNo === 1 ? data.data : [...prev, ...data.data]
        );
        setHasMore(data.data.length > 0);

        // prettier("wallah", data);
      } else {
        setNotification({
          message: "Error fetching applications",
          visible: true,
          success: false,
          duration: 1800,
          title: "Error fetching",
        });
        console.warn("error", data);
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchApplications(searchQuery, selectedDate, pageNo);
      return () => {
        // setSearchQuery("")
      };
    }, [pageNo])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplications("", "", 1);
  };

  // console.log('sjfkasfjkhjfkhaksjfhjksahfk',selectedDate)

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
      fetchApplications(searchText, selectedDate, 1);
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

  const handleFromDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    const current = selectedDate || new Date();
    setShowDatePicker(false);
    setSelectedDate(current);
    setPageNo(1);
    fetchApplications(searchQuery, selectedDate, 1);
  };
  return (
    <View
      style={{
        padding: 16,
        paddingTop: 0,
        backgroundColor: THEME[theme].background,
        flex: 1,
      }}
    >
      <Search
        placeholderColor={THEME[theme].inputTextColor}
        textColor={THEME[theme].text.secondary}
        value={searchQuery}
        onSearchChange={handleInputChange}
        backgroundColor={"white"}
        borderColor={THEME[theme].disabled}
        icon={"magnify"}
        placeholder={"Find your application"}
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
              console.log("hello");
              if (pageNo !== 1) {
                console.log("a", pageNo);
                setPageNo(1);
              } else {
                fetchApplications(searchQuery, "", pageNo);
                console.log("b", pageNo);
              }
              setSelectedDate("");
              // setPageNo(1);
            }}
            style={{
              backgroundColor: THEME[theme].inputTextFieldBorderColor,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 4,
            }}
          >
            <MaterialCommunityIcons
              name="close"
              size={12}
              style={{ position: "absolute", right: 1, top: 1 }}
            />
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
      <View style={{ flex: 1,marginTop:16 }}>
        <FlatList
          data={applicationList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={renderItem}
          keyExtractor={(item) => item.applicationId.toString()}
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
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
                  subHeading="No Application found."
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

export default ApplicationScreen;

const styles = StyleSheet.create({
  applicationContainer: {
    flex: 1,
    backgroundColor: "white",
    // marginTop: 40,
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
  applicationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: RFValue(12),
    color: "#999",
  },
});
