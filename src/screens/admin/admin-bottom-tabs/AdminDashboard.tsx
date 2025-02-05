import CustomText from "@components/CustomText";
import Logout from "@components/Logout";
import Search from "@components/Search";
import Separator from "@components/Separator";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "@utils/constant";
import { prettier } from "@utils/helpers";
import { THEME } from "@utils/ui";
import {
  Activity,
  Book,
  Calendar,
  File,
  LogOut,
  MoveRight,
  PersonStanding,
  University,
  User,
  UserCheck2,
  UserCheck2Icon,
  UserCircle,
  UserCircle2,
} from "lucide-react-native";
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";


// Types
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

type PaginationInfo = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type AdminDashboardProps = {
  data: {
    data: Application[];
    pagination?: PaginationInfo;
  };
  searchQuery?: string;
};

const AdminDashboard: React.FC<any> = ({
  data,
  searchQuery,
  setSearchQuery,
}) => {
  const { theme } = useUI();
  const { navigate } = useNavigation<any>();

  const filteredData = data.filter(
    (item) =>
      item?.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.university?.institutionName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item?.course?.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = useCallback(
    ({ item }: { item: Application }) => (
      <TouchableOpacity
        style={[
          styles.applicationCard,
          { marginHorizontal: 2, marginTop: 2, gap: 16 },
        ]}
        onPress={() => navigate("APPLICATIONDETAILS", { userId: item.userId,applicationId:item?.applicationId })}
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
    ),
    []
  );

  return (
    <>
      <View style={[styles.applicationContainer]}>
        {/* <View
          style={[
            styles.header,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]} */}
        {/* > */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomText
            heading="List of applications"
            headingColor={THEME[theme].primary}
          />
          <TouchableOpacity
            onPress={() => navigate('Applications')}
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <CustomText
              subHeading="View All"
              subHeadingFontSize={12}
              subHeadingColor={THEME[theme].text.secondary}
              subHeadingFontFamily="Medium"
            />
            <MoveRight size={16} color={THEME[theme].text.secondary} />
          </TouchableOpacity>
        </View>
        {/* <TextInput
          style={styles.searchInput}
          placeholder="Search applications..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          /> */}

        {/* </View> */}
        {/* <Search
          placeholderColor={THEME[theme].inputTextColor}
          textColor={THEME[theme].text.secondary}
          value={searchQuery}
          onSearchChange={setSearchQuery}
          backgroundColor={"white"}
          borderColor={THEME[theme].disabled}
          icon={"magnify"}
          placeholder={"Find you application by student name"}
          iconColor={THEME[theme].text.secondary}
        /> */}
        {filteredData.length > 0 ? (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.applicationId.toString()}
            style={{ marginTop: 16 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <CustomText
              style={styles.noDataText}
              subHeading="No applications found"
            />
          </View>
        )}
        {/* <View style={styles.paginationInfo}>
          <Text>
            Page {data?.pagination?.page} of {data?.pagination?.totalPages} |
            Total Applications: {data?.pagination?.total}
          </Text>
        </View> */}
      </View>
    </>
  );
};

// const styles = StyleSheet.create({
//
// });

// Dummy data

// Example usage
export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState([]);
  const { setFullscreenLoading, setNotification } = useUI();
  const { profile, clearToken, token, setProfile } = useAuth();
  const [cardsData, setCardsData] = useState<any>(null);
  const { theme } = useUI();
  const { navigate } = useNavigation<any>();
  const [show, setShow] = useState(false);

  const { setOptions } = useNavigation();

  const handleLogout = async () => {
    setShow(false);
    await clearToken();
    setNotification({
      visible: true,
      success: true,
      title: "Successfully logged out",
      message: "You have successfully logged out of Pioneer.",
      duration: 1800,
    });
  };

  useFocusEffect(
    useCallback(() => {
      setOptions({
        headerShown: false,
      });
    }, [])
  );

  const fetchDashboardInfo = async () => {
    try {
      setFullscreenLoading(true);
      const response = await fetch(API_BASE_URL + "/api/v1/getAllInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log("success", data);
        setCardsData(data.data);
      } else {
        console.warn("error", data);
        setNotification({
          title: "Failed",
          success: false,
          visible: true,
          duration: 1200,
          message: "Failed to fetch dashboard information",
        });
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed",
        success: false,
        visible: true,
        duration: 1200,
        message: "Failed to fetch dashboard information",
      });
    }
  };

  const fetchApplications = async () => {
    try {
      setFullscreenLoading(true);
      const response = await fetch(
        API_BASE_URL + `/api/v1/getApplication?name=${searchQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setApplications(data.data);
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
      setFullscreenLoading(false);
    }
  };

  
  useFocusEffect(useCallback(()=>{
    fetchApplications();
    fetchDashboardInfo();
  },[]))
  return (
    <>
      <Logout
        visible={show}
        hide={() => setShow(false)}
        handleLogout={() => handleLogout()}
      />

      <View style={[styles.container, { padding: 16, gap: 16 }]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomText
            heading="Admin Dashboard"
            headingColor={THEME[theme].primary}
          />
          <MaterialCommunityIcons name="account" size={30} color={THEME[theme].primary} onPress={()=>navigate('ADMINPROFILE')}/>
          <TouchableOpacity onPress={() => setShow(true)} style={{ gap: 2 }}>
            <View style={{ flexDirection: "row", gap: 4 }}>
              <CustomText
                heading="Logout"
                headingColor={THEME[theme].primary}
                headingFontSize={16}
              />
              <LogOut
                color={THEME[theme].primary}
                style={{ marginRight: 4, alignSelf: "flex-end", bottom: 2 }}
                size={16}
              />
            </View>
            <Separator color={THEME[theme].primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={[
              styles.applicationCard,
              { padding: 16, backgroundColor: THEME[theme].primary, gap: 16 },
            ]}
            onPress={() => navigate("Universities")}
          >
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <University size={25} color={"white"} />
              <CustomText
                heading="Universities"
                headingFontSize={16}
                headingColor={THEME[theme].background}
                subHeading={`Total: ${cardsData?.totalUniversities}`}
                subHeadingFontSize={12}
                subHeadingColor={"#F4EBD0"}
              />
            </View>
            {/* <Card.Content> */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText
                subHeadingFontSize={12}
                subHeading={`Manage universities \nand their priorities`}
                subHeadingColor={"#F4EBD0"}
              />
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color={"white"}
              />
            </View>
            {/* </Card.Content> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.card,
              { padding: 16, backgroundColor: THEME[theme].primary },
            ]}
            onPress={() => navigate("Users")}
          >
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <User size={25} color={"white"} />
              <CustomText
                heading="Users"
                headingFontSize={16}
                headingColor={THEME[theme].background}
                subHeading={`Total: ${cardsData?.totalUsers}`}
                subHeadingFontSize={12}
                subHeadingColor={"#F4EBD0"}
              />
            </View>
            {/* <Card.Content> */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText
                subHeadingFontSize={12}
                subHeading={`View and manage \nuser accounts`}
                subHeadingColor={"#F4EBD0"}
              />
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color={"white"}
              />
            </View>
            {/* </Card.Content> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.card,
              { padding: 16, backgroundColor: THEME[theme].primary },
            ]}
            onPress={() => navigate("Applications")}
          >
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <File size={25} color={"white"} />
              <CustomText
                heading="Applications"
                headingFontSize={16}
                headingColor={THEME[theme].background}
                subHeading={`Total: ${cardsData?.totalApplications}`}
                subHeadingFontSize={12}
                subHeadingColor={"#F4EBD0"}
              />
            </View>
            {/* <Card.Content> */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText
                subHeadingFontSize={12}
                subHeading="Review and process student applications"
                subHeadingColor={"#F4EBD0"}
              />
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color={"white"}
              />
            </View>
            {/* </Card.Content> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.card,
              { padding: 16, backgroundColor: THEME[theme].primary },
            ]}
            onPress={() => navigate("Courses")}
          >
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <Book size={25} color={"white"} />
              <CustomText
                heading="Courses"
                headingFontSize={16}
                headingColor={THEME[theme].background}
                subHeading={`Total: ${cardsData?.totalCourses}`}
                subHeadingFontSize={12}
                subHeadingColor={"#F4EBD0"}
              />
            </View>
            {/* <Card.Content> */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText
                subHeadingFontSize={12}
                subHeading={`Manage courses \nand set priorities`}
                subHeadingColor={"#F4EBD0"}
              />
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color={"white"}
              />
            </View>
            {/* </Card.Content> */}
          </TouchableOpacity>
        </View>
        {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
        <AdminDashboard
          data={applications}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        {/* </ScrollView> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  applicationContainer: {
    flex: 1,
    backgroundColor: "white",
    // marginTop: 40,
  },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  applicationTitle: {
    fontSize: RFValue(24),
    // marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  list: {
    padding: 16,
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
  name: {
    fontSize: RFValue(18),
  },
  email: {
    fontSize:RFValue(14),
    color: "#666",
    marginBottom: 8,
  },
  university: {
    fontSize:RFValue(16),
    fontWeight: "500",
  },
  course: {
    fontSize:RFValue(14),
    color: "#333",
    marginBottom: 8,
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
  status: {
    fontSize:RFValue(14),
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
  paginationInfo: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: RFValue(24),
    fontWeight: "bold",
    margin: 16,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // padding: 8,
  },
  card: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 12,
    gap: 16,
    elevation: 10, // Increased for a denser shadow on Android
    shadowColor: "#000", // Black shadow
    shadowOffset: { width: 0, height: 6 }, // Shadow positioned below the card
    shadowOpacity: 0.3, // Opacity of the shadow
    shadowRadius: 8, // Blur radius for the shadow
  },
});
