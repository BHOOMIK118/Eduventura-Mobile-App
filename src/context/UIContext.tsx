import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { THEME } from "@utils/ui";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

interface NotificationProps {
  theme: string;
  visible: boolean;
  success: boolean;
  title: string;
  message: string;
  duration: number;
  onClose: () => void;
}

const UIContext = createContext<any>(undefined);

const FullViewLoader: React.FC<{ show: boolean }> = ({ show }) => {
  return show ? (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(80, 88, 104, 0.92)",
      }}
    >
      <ActivityIndicator size="large" color="white" />
    </View>
  ) : null;
};

const Notification: React.FC<NotificationProps> = ({
  theme,
  visible,
  success,
  title,
  message,
  duration,
  onClose,
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.68)",
        }}
      >
        <TouchableOpacity onPress={onClose}>
          <View
            style={{
              width: 340,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#ffffff",
              paddingVertical: 12,
              paddingHorizontal: 12,
              borderRadius: 5,
              marginHorizontal: 40,
              marginBottom: 40,
              borderLeftWidth: 6,
              borderLeftColor: THEME[theme].primary,
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                backgroundColor: "#F0F0F0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={
                  success ? "checkmark-done-circle-outline" : "warning-outline"
                }
                size={16}
                color={success ? THEME[theme].primary : "#FF6C00"}
              />
            </View>
            <View style={{ paddingLeft: 12, width: 240 }}>
              <Text
                style={{
                  color: THEME[theme].primary,
                  fontFamily: "Regular",
                  fontSize: RFValue(18),
                  marginBottom: 2,
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  color: THEME[theme].SubHeadingTextColor,
                  fontFamily: "Light",
                  fontSize: RFValue(12),
                  lineHeight: 14,
                }}
              >
                {message}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<string>("LIGHT");
  const [fullscreenLoading, setFullscreenLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    visible: boolean;
    success: boolean;
    title: string;
    message: string;
    duration: number;
    onClose: () => void;
  }>({
    visible: false,
    success: true,
    title: "",
    message: "",
    duration: 0,
    onClose: () => {},
  });

  const loadTheme = async () => {
    const userTheme = await AsyncStorage.getItem("theme");
    if (userTheme) {
      setTheme(userTheme);
    }
  };

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <UIContext.Provider
      value={{
        theme,
        setTheme,
        fullscreenLoading,
        setFullscreenLoading,
        setNotification,
      }}
    >
      {children}
      <FullViewLoader show={fullscreenLoading} />
      <Notification
        theme={theme}
        visible={notification.visible}
        success={notification.success}
        title={notification.title}
        message={notification.message}
        duration={notification.duration}
        onClose={() => {
          setNotification((prev) => ({
            ...prev,
            visible: false,
          }));
          notification.onClose && notification.onClose();
        }}
      />
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
