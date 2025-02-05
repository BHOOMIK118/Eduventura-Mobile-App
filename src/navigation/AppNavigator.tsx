import React, { FC } from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "@features/auth/SplashScreen";
import LoginScreen from "@screens/no-auth/LoginScreen";
import RegisterScreen from "@screens/no-auth/RegisterScreen";
import { useAuth } from "@context/AuthContext";
import BottomTabNavigator from "@navigation/BottomTabNavigator";
import ForgetPassword from "@screens/no-auth/ForgetPassword";
import EnterOTP from "@screens/no-auth/EnterOTP";
import PendingProfile from "@screens/no-auth/PendingProfile";
import CourseList from "@screens/CourseList";
import VerifyOTP from "@screens/no-auth/VerifyOTP";
import UniversityList from "@screens/UniversityList";
import Onboarding from "@screens/onboarding/Onboarding";
import EditProfile from "@screens/details/EditProfile";
import UniversityDetails from "@screens/details/UniversityDetails";
import CourseDetails from "@screens/details/CourseDetails";
import CompleteKYC from "@screens/details/CompleteKYC";
import AppliedCourses from "@screens/details/AppliedCourses";
import AdminDashboard from "@screens/admin/admin-bottom-tabs/AdminDashboard";
import ExploreCourses from "@screens/details/ExploreCourses";
import CoursesFilter from "@screens/details/CoursesFilter";
import ApplicationDetails from "@screens/admin/ApplicationDetails";
import EditProfileNew from "@screens/details/EditProfileNew";
import AdminBottomTabNavigator from "./AdminBottomTabNavigator";
import CreateUniversity from "@screens/admin/CreateUniversity";
import CreateCourse from "@screens/admin/CreateCourse";
import { RFValue } from "react-native-responsive-fontsize";
import AdminProfile from "@screens/admin/AdminProfile";

export type RootStackParamList = {
  SPLASHSCREEN: undefined;
  AUTHENTICATED: undefined;
  COURSELIST: undefined;
  UNIVERSITYLIST: undefined;
  LOGINSCREEN: undefined;
  REGISTERSCREEN: undefined;
  FORGOTPASSWORD: undefined;
  ENTEROTP: undefined;
  PENDINGPROFILE: undefined;
  VERIFYOTP: undefined;
};
const Stack = createStackNavigator();

const AppNavigator = () => {
  const { token, isLoading, profile } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
            headerTitleAlign:'left',
            headerTitleStyle: {
              fontFamily: "Medium",
              fontSize:RFValue(18)
            },
        }}
      >
        {isLoading && (
          <Stack.Screen
            name="SPLASHSCREEN"
            options={{ headerShown: false }}
            component={SplashScreen}
          />
        )}
        {token && profile ? (
          profile.user.role === "REGULAR_USER" ? (
            <Stack.Group>
              <Stack.Screen
                name="AUTHENTICATED"
                options={{ headerShown: false }}
                component={BottomTabNavigator}
              />
              <Stack.Group
                screenOptions={{
                  gestureEnabled: true,
                  gestureDirection: "vertical",
                  cardStyleInterpolator:
                    CardStyleInterpolators.forModalPresentationIOS,
                }}
              >
                <Stack.Screen
                  name="COURSELIST"
                  component={CourseList}
                  options={{
                    headerTitleAlign: "left",
                    headerTitle: "Course List",
                  }}
                />
                <Stack.Screen
                  name="UNIVERSITYLIST"
                  component={UniversityList}
                  options={{
                    headerTitleAlign: "left",
                    headerTitle: "University List",
                  }}
                />
                <Stack.Screen
                  name="APPLIEDCOURSE"
                  component={AppliedCourses}
                  options={{
                    headerTitleAlign: "left",
                    headerTitle: "Applied Courses",
                  }}
                />
                <Stack.Screen
                  name="EDITPROFILE"
                  component={EditProfileNew}
                  options={{
                    headerTitleAlign: "left",
                    headerTitle: "Edit Profile",
                    
                  }}
                />
                <Stack.Screen
                  name="UNIVERSITYDETAILS"
                  component={UniversityDetails}
                  options={{
                    headerTitleAlign: "left",
                    headerTitle: "University details",
                   
                    
                  }}
                />
                <Stack.Screen
                  name="EXPLORECOURSES"
                  component={ExploreCourses}
                  options={{
                    headerTitleAlign: "left",
                    headerTitle: "Explore Courses",
                    
                  }}
                />
                <Stack.Screen
                  name="COURSESFILTER"
                  component={CoursesFilter}
                  options={{
                    headerTitleAlign: "left",
                    headerTitle: "Courses",
                    
                  }}
                />
                <Stack.Screen
                  name="COURSEDETAILS"
                  component={CourseDetails}
                  options={{
                    headerTitleAlign: "left",
                    headerTitle: "Course details",
                   
                  }}
                />
                <Stack.Screen
                  name="COMPLETEKYC"
                  component={CompleteKYC}
                  options={{
                    headerTitleAlign: "left",
                    headerTitle: "Complete Kyc",
                    
                  }}
                />
              </Stack.Group>
            </Stack.Group>
          ) : (
            <Stack.Group screenOptions={{
              gestureEnabled:true,
              gestureDirection:'vertical',
              cardStyleInterpolator:CardStyleInterpolators.forModalPresentationIOS
            }}>
              <Stack.Screen
                name="ADMINDASHBOARD"
                component={AdminBottomTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="APPLICATIONDETAILS"
                component={ApplicationDetails}
                options={{
                  headerTitleAlign: "left",
                  headerTitle: "Application Details",
                  
                }}
              />
              <Stack.Screen
                name="ADMINPROFILE"
                component={AdminProfile}
                options={{
                  headerTitleAlign: "left",
                  headerTitle: "Admin Profile",
                  
                }}
              />
              <Stack.Screen
                name="CREATEUNIVERSITY"
                component={CreateUniversity}
                options={{
                  headerTitleAlign: "left",
                  headerTitle: "Create University",
                  
                }}
              />
              <Stack.Screen
                name="CREATECOURSE"
                component={CreateCourse}
                options={{
                  headerTitleAlign: "left",
                  headerTitle: "Create Course",
                 
                }}
              />
            </Stack.Group>
          )
        ) : (
          <Stack.Group screenOptions={{ headerShown: false,
            gestureEnabled:true,
            gestureDirection:'vertical',
            cardStyleInterpolator:CardStyleInterpolators.forModalPresentationIOS
           }}>
            <Stack.Screen name="ONBOARDING" component={Onboarding} />
            <Stack.Screen name="LOGINSCREEN" component={LoginScreen} />
            <Stack.Screen name="REGISTERSCREEN" component={RegisterScreen} />
            <Stack.Screen name="FORGOTPASSWORD" component={ForgetPassword} />
            <Stack.Screen name="ENTEROTP" component={EnterOTP} />
            <Stack.Screen name="PENDINGPROFILE" component={PendingProfile} />
            <Stack.Screen name="VERIFYOTP" component={VerifyOTP} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
