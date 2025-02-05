import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import CustomText from "@components/CustomText";
import { useAuth } from "@context/AuthContext";
import Logout from "@components/Logout";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { GraduationCap, LogOut, User } from "lucide-react-native";
import { getUserProfileAPI } from "@utils/services";
import BottomSheetComponent from "@screens/details/EditProfileNew";
import { RFValue } from "react-native-responsive-fontsize";


const Account = ({ route }) => {
  const { theme, setNotification } = useUI();
  const { profile, clearToken, token, setProfile } = useAuth();
  const [show, setShow] = useState(false);
  const { navigate } = useNavigation<any>();
  const navigation = useNavigation();
  const bottomSheetRef = useRef<any>();
  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.open();
  };
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

  // useEffect(()=>{
  //   if(route?.params?.open){
  //     handleOpenBottomSheet();
  //   }
  // },[route.params?.open])

  useFocusEffect(
    useCallback(() => {
      console.log(route)
      if (route?.params?.open) {
        handleOpenBottomSheet();
      }

      return () => {
        navigation.setParams({ open: false }as never);
      };
    }, [route.params?.open])
  );

  return (
    <>
      <Logout
        visible={show}
        hide={() => setShow(false)}
        handleLogout={() => handleLogout()}
      />
      <View style={[{}]}>
        <View style={[styles.profileSection, { backgroundColor: "white" }]}>
          {profile?.user?.profile?.profilePictureUrl ? (
            <Image
              source={{ uri: profile?.user?.profile?.profilePictureUrl }}
              style={styles.profileImage}
            />
          ) : (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={100}
              color={THEME[theme].disabled}
            />
          )}
          <CustomText
            style={styles.name}
            heading={profile?.user?.name}
            headingColor={THEME[theme].primary}
          />
          <CustomText
            subHeadingColor={THEME[theme].text.secondary}
            subHeadingFontSize={14}
            subHeading={profile?.user?.email}
          />
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView
        contentContainerStyle={[
          styles.menuContainer,
          { backgroundColor: THEME[theme].background, flex: 1, paddingTop: 48 },
        ]}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigate('EDITPROFILE')}
        >
          {/* <View style={[styles.iconContainer, { backgroundColor: "#FEC8D8" }]}> */}
          <User color={THEME[theme].primary} style={{ marginRight: 16 }} />
          {/* </View> */}
          <CustomText style={styles.menuText} heading={"Edit Profile"} />
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            style={{ marginLeft: "auto" }}
            color="#6F6B7D"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigate("APPLIEDCOURSE" as never)}
        >
          {/* <View style={[styles.iconContainer, { backgroundColor: "#FEC8D8" }]}> */}
          <GraduationCap
            color={THEME[theme].primary}
            style={{ marginRight: 16 }}
          />
          {/* </View> */}
          <CustomText style={styles.menuText} heading={"Applied Courses"} />
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            style={{ marginLeft: "auto" }}
            color="#6F6B7D"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => setShow(true)}>
          {/* <View style={[styles.iconContainer, { backgroundColor: "#D4A5A5" }]}> */}
          <LogOut color={THEME[theme].primary} style={{ marginRight: 16 }} />
          {/* </View> */}
          <CustomText style={styles.menuText} heading={"Log out"} />
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color="#6F6B7D"
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={handleOpenBottomSheet}>
          <Text style={styles.buttonText}>Open Bottom Sheet</Text>
        </TouchableOpacity> */}
      </ScrollView>
      {/* <BottomSheetComponent ref={bottomSheetRef} /> */}
    </>
  );
};
export default Account;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    position: "relative",
  },
  gradient: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  svgCurve: {
    position: "absolute",
    bottom: 0,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingTop: 20,
    paddingBottom: 60,
  },
  backButton: {
    padding: 8,
    position: "absolute",
    left: 0,
  },
  headerTitle: {
    color: "#fff",
    fontSize: RFValue(20),
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: RFValue(22),
    fontWeight: "600",
    marginTop: 10,
  },
  email: {
    color: "#ddd",
    fontSize:RFValue(14),
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    // justifyContent:'space-between',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuText: {
    fontSize:RFValue(16),
    color: "#333",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize:RFValue(16),
    fontWeight: "bold",
  },
});
