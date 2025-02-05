import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { decodeRolesFromToken, sleep } from "@utils/helpers";
import { getKycDetails, getUserProfileAPI } from "@utils/services";
// import { getUserProfileAPI } from '../utils/services';
// import { sleep } from "../utils/helpers";
// import messaging from "@react-native-firebase/messaging";
// import * as Notifications from "expo-notifications";
// import { Platform } from "react-native";
// import DeviceInfo from 'react-native-device-info';

// async function requestPermissions() {
//   const { status } = await Notifications.getPermissionsAsync();
//   if (status !== 'granted') {
//     const { status: newStatus } = await Notifications.requestPermissionsAsync();
//     if (newStatus !== 'granted') {
//       alert('Permission to show notifications denied!');
//     }
//   }
// }

// async function setupNotificationChannel() {
//   if (Platform.OS === 'android' || Platform.OS === 'ios') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }
// }

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

const AuthContext = createContext<any>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [kycDetails,setKycDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    // const initialize = async () => {
    //   try {
    //     const id = await DeviceInfo.getUniqueId();
    //     setDeviceId(id);
    //     console.log('Device ID:', id);
    //     await requestPermissions();
    //     await setupNotificationChannel();
    //     const fcm = await messaging().getAPNSToken();
    //     console.log('APN FCM Token:', fcm);
    //     messaging().getAPNSToken().then(async (apnsToken) => {
    //       const token = await messaging().getToken();
    //                // updating token to firestore or database
    //                setFcmToken(token);
    //                console.log('FCM Token:', token);
    //       })
    //     await retrieveToken();
    //     setIsLoading(false);
    //   } catch (error) {
    //     console.log('Error during initialization:', error);
    //   }
    // };
    // initialize();
    // Handle foreground messages and show notifications
    // const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    //   console.log('A new FCM message arrived!', remoteMessage);
    //   const { title, body } = remoteMessage.notification || {
    //     title: remoteMessage.data.title || 'New Notification',
    //     body: remoteMessage.data.body || 'You have a new message!',
    //   };
    //   await Notifications.scheduleNotificationAsync({
    //     content: {
    //       title: title,
    //       body: body,
    //     },
    //     trigger: null,
    //   });
    // });
    // return () => {
    //   unsubscribe();
    // };

    retrieveToken();
  }, []);

  const retrieveToken = async () => {
    try {
      // setIsLoading(true);
      const storedToken = await SecureStore.getItemAsync("token");
      const role = decodeRolesFromToken(storedToken);
      if (storedToken) {
        const data = await getUserProfileAPI(storedToken);
        if (data?.user?.mobileNumber) {
          const kyc = await getKycDetails(null,data?.user?.userId);          
          if(kyc){
             setProfile(data);
             setKycDetails(kyc);
             setToken(storedToken);
            }
        }
        else if (role==='ADMIN'){
          setProfile(data);
          setToken(storedToken)
        }
        // await sleep(500);
      } else {
        clearToken();
      }
    } catch (error) {
      console.log("Error retrieving token:", error);
    }
    finally{
      setIsLoading(false);

    }
    return;
  };

  const storeToken = async (token: string) => {
    try {
      await SecureStore.setItemAsync("token", token);
      setToken(token);
      console.log("Token stored successfully");
    } catch (error) {
      console.log("Error storing token:", error);
    }
  };

  const clearToken = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setToken(null);
      setProfile(null);
      setFcmToken(null);
      setDeviceId(null);
      setKycDetails(null);
      setUserDetail(null);
      console.log("Token cleared successfully");
    } catch (error) {
      console.log("Error clearing token:", error);
    }
  };

  const setUserDetail = async (d: any) => {
    setProfile(d);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        storeToken,
        clearToken,
        profile,
        setProfile,
        setUserDetail,
        isLoading,
        kycDetails,
        setKycDetails,
        fcmToken,
        deviceId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
