import  { FC } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useUI } from "@context/UIContext";
import Dashboard from "@screens/bottom-tabs/Dashboard";
import Courses from "@screens/bottom-tabs/Courses";
import Account from "@screens/bottom-tabs/Account";
import University from "@screens/bottom-tabs/University";
import { THEME } from "@utils/ui";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { screenHeight } from "@utils/Scaling";
import CustomText from "@components/CustomText";
import { CardStyleInterpolators } from "@react-navigation/stack";
import { Easing } from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";

const Tab = createBottomTabNavigator();

const BottomTabNavigator: FC = () => {
  const { theme } = useUI();

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: THEME[theme].primary,
        tabBarInactiveTintColor: THEME[theme].inputTextField,
        animation:'shift',
        headerTitleStyle: {
          fontFamily: "Medium",
          fontSize:RFValue(18)
        },
        tabBarLabel: ({ focused, color }) => (
          <CustomText
            style={{
              fontFamily: focused ? "Bold" : "Regular",
              color: color,
              fontSize: RFValue(12),
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
        name="Dashboard"
        component={Dashboard}
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
        name="Courses"
        component={Courses}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="book"
              size={24}
              color={
                focused
                  ? THEME[theme].primary
                  : THEME[theme].inputPlaceholderColor
              }
            />
          ),
          headerTitle: "Courses List",
          headerTitleAlign: "center",
          
        }}
      />
      <Tab.Screen
        name="Universities"
        component={University}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="school"
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
        name="Profile"
        component={Account}
        options={{
          headerTitleAlign: "center",
          
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
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
