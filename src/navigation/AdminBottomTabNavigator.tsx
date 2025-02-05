import { View, Text } from "react-native";
import React, { FC } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useUI } from "@context/UIContext";
import { THEME } from "@utils/ui";
import CustomText from "@components/CustomText";
import { screenHeight } from "@utils/Scaling";
import AdminDashboard from "@screens/admin/admin-bottom-tabs/AdminDashboard";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import UniversitiesScreen from "@screens/admin/admin-bottom-tabs/UniversitiesScreen";
import UsersScreen from "@screens/admin/admin-bottom-tabs/UsersScreen";
import ApplicationScreen from "@screens/admin/admin-bottom-tabs/ApplicationScreen";
import CoursesScreen from "@screens/admin/admin-bottom-tabs/CoursesScreen";
import { Book, University } from "lucide-react-native";
import { RFValue } from "react-native-responsive-fontsize";

const Tab = createBottomTabNavigator();
const AdminBottomTabNavigator: FC = () => {
  const { theme } = useUI();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: THEME[theme].primary,
        tabBarInactiveTintColor: THEME[theme].inputTextField,
        animation: "shift",
        headerTitleStyle: {
          fontFamily: "Medium",
          fontSize: RFValue(18),
        },
        tabBarLabel: ({ focused, color }) => (
          <CustomText
            style={{
              fontFamily: focused ? "Bold" : "Regular",
              color: color,
              fontSize: RFValue(10),
            }}
            heading={route.name}
          />
        ),
        tabBarStyle: {
          height: screenHeight * 0.08,
          paddingBottom: 10,
          justifyContent: "center",
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name="Home"
        component={AdminDashboard}
        options={{
          headerShown: false,
          headerShadowVisible: false,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="home"
              size={24}
              color={
                focused
                  ? THEME[theme].primary
                  : THEME[theme].inputPlaceholderColor
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Universities"
        component={UniversitiesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <University
              size={24}
              color={
                focused
                  ? THEME[theme].primary
                  : THEME[theme].inputPlaceholderColor
              }
            />
          ),
          headerTitle: "University List",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="Users"
        component={UsersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person"
              size={24}
              color={
                focused
                  ? THEME[theme].primary
                  : THEME[theme].inputPlaceholderColor
              }
            />
          ),
          headerTitle: "Users List",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationScreen}
        options={{
          headerTitleAlign: "center",

          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="document"
              size={24}
              color={
                focused
                  ? THEME[theme].primary
                  : THEME[theme].inputPlaceholderColor
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{
          headerTitleAlign: "center",

          tabBarIcon: ({ focused }) => (
            <Book
              size={24}
              color={
                focused
                  ? THEME[theme].primary
                  : THEME[theme].inputPlaceholderColor
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminBottomTabNavigator;
