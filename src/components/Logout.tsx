import { Modal, View, TouchableOpacity, Text } from "react-native";
import React,{FC} from 'react'
import { THEME } from "../utils/ui";
import { useUI } from "../context/UIContext";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";


interface LogoutProps{
  visible:boolean;
  hide:()=>void;
  handleLogout:()=>void;

}

const Logout:FC<LogoutProps> = ({ visible, hide, handleLogout }) => {
  const { theme } = useUI();

  return (
    <React.Fragment>
      {visible && (
        <Modal animationType="fade" transparent={true}>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.68)",
            }}
          >
            <View
              style={{
                width: 340,
                flexDirection: "row",
                alignItems: "flex-start",
                backgroundColor: "#ffffff",
                paddingVertical: 16,
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
                <Ionicons name="warning-outline" size={16} color="#FF6C00" />
              </View>
              <View
                style={{
                  paddingLeft: 16,
                  width: 260,
                }}
              >
                <View>
                  <Text
                    style={{
                      color: THEME[theme].primary,
                      fontFamily: "Regular",
                      fontSize: RFValue(18),
                      marginBottom: 2,
                    }}
                  >
                    Log out?
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: THEME[theme].SubHeadingTextColor,
                      fontFamily: "Light",
                      fontSize: RFValue(12),
                      lineHeight: 14,
                    }}
                  >
                    Are you sure you want to log out of the application? You
                    will need to re-login to continue using the app.
                  </Text>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: "row-reverse",
                      marginTop: 6,
                      gap: 8,
                    }}
                  >
                    <TouchableOpacity onPress={() => handleLogout()}>
                      <View
                        style={{
                          height: 40,
                          borderRadius: 6,
                          paddingHorizontal: 18,
                          backgroundColor: "#FAFAFA",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Regular",
                            fontSize:RFValue(14),
                            textAlign: "center",
                            color: "red",
                          }}
                        >
                          Log out
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        hide();
                      }}
                    >
                      <View
                        style={{
                          height: 40,
                          borderRadius: 6,
                          paddingHorizontal: 18,
                          backgroundColor: "#FAFAFA",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Regular",
                            fontSize:RFValue(14),
                            textAlign: "center",
                            color: THEME[theme].HeadingTextColor,
                          }}
                        >
                          Cancel
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default Logout;
