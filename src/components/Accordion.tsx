import React, { useState,FC } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheetProperties,
  ViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomText from "./CustomText";
import { THEME } from "../utils/ui";
import { useUI } from "../context/UIContext";
import { Play, Plus } from "lucide-react-native";
import { RFValue } from "react-native-responsive-fontsize";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title:string;
  children:React.ReactNode;
  isExpanded?:boolean;
  setIsExpanded:(prop)=>void;
  style?:StyleProp<ViewStyle>;
  Icon?:any


}

const Accordion:FC<AccordionProps> = ({
  title,
  children,
  isExpanded,
  setIsExpanded,
  style,
  Icon,
}) => {
  // const [expanded, setExpanded] = useState(isExpanded);
  const { theme } = useUI();

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={[styles.container, {}]}>
      <TouchableOpacity
        style={[styles.addButton, style]}
        onPress={toggleExpand}
      >
        {Icon ? (
          <>
          <MaterialCommunityIcons stroke="white" size={20} name={Icon} />
        <CustomText style={[styles.addButtonText,{color:'black'}]}  heading={title} />
          </>

        ) : (
          <>
          <Plus stroke="white" size={20} />
        <CustomText style={[styles.addButtonText,{color:'white'}]}  heading={title} />
          </>
        )}
      </TouchableOpacity>
      {isExpanded && <View style={styles.body}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    // borderWidth: 1,
    borderBottomWidth: 0,

    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#13478b",
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: "white",
    fontSize:RFValue(14),
    fontWeight: "500",
  },
  titleContainer: {
    backgroundColor: "#f7f7f7",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize:RFValue(16),
    fontWeight: "bold",
  },
  body: {
    // padding: 15,
    backgroundColor: "#fff",
    // flexGrow: 1,
  },
});

export default Accordion;
