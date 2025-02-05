import { SafeAreaView } from "react-native";
import React, { FC, ReactNode } from "react";

interface SafeAreaWrapperProps {
  children: ReactNode;
}

const SafeAreaWrapper: FC<SafeAreaWrapperProps> = ({ children }) => {
  return <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>;
};

export default SafeAreaWrapper;
