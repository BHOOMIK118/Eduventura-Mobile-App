import React from "react";
import { View } from "react-native";

interface HeightGapProps {
  height: number;
}

const HeightGap: React.FC<HeightGapProps> = ({ height }) => {
  return (
    <View
      style={{
        height: height,
      }}
    />
  );
};

export default HeightGap;
