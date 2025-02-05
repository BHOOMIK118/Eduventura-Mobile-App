import React, { FC } from "react";
import { View } from "react-native";
import { LoginScreenStyles } from "@styles/login-screen";
import { LinearGradient } from "expo-linear-gradient";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";

export const NoAuthLayout: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useUI();

  return (
    <View style={LoginScreenStyles.Container}>
      <LinearGradient
        colors={["white", 'white']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Background circles */}
        {/* {[
          { size: 92, top: -20, right: 148 },
          { size: 160, top: -40, right: -40 },
          { size: 92, top: 148, right: -40 },
        ].map((circle, index) => (
          <View
            key={index}
            style={{
              height: circle.size,
              width: circle.size,
              borderRadius: circle.size,
              backgroundColor: THEME[theme].HeadingTextColor,
              position: "absolute",
              top: circle.top,
              right: circle.right,
            }}
          />
        ))} */}

        <View
          style={{
            position: "relative",
            zIndex: 2,
            flex: 1,
            justifyContent: "flex-end",
            overflow: "hidden",
          }}
        >
          {children}
        </View>
      </LinearGradient>
    </View>
  );
};
