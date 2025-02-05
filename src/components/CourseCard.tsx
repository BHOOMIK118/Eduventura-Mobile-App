import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import { screenHeight, screenWidth } from "@utils/Scaling";
import CustomText from "./CustomText";
import { useNavigation } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";


interface University {
  institutionName: string;
}

interface Course {
  id: string;
  courseName: string;
  totalFee: string;
  imageUrl?: string;
  university: University;
  width?:any;
  height?:any;
}

interface CourseCardProps {
  item?: Course;
  course?:any;
  width?: any; // Explicitly added width and height as optional props
  height?: any;
}

const CourseCard: React.FC<CourseCardProps> = ({ item,width,height }) => {
  const { theme } = useUI();
  const {navigate} = useNavigation<any>();
  
  return (
    <TouchableOpacity style={[styles.courseCard,{width:width}]} onPress={()=>navigate('COURSEDETAILS',{course:item})}>
      <Image
        // source={{
        //   uri: "https://via.placeholder.com/300x200.png?text=Course+Image",
        // }}
        source={require("@assets/images/course.jpg")}
        resizeMode="stretch"
        style={[styles.courseImage,{height:height}]}
      />
      <CustomText style={styles.courseTitle} heading={item?.courseName} />
      <CustomText
        style={styles.courseSubtitle}
        subHeading={"$" + item?.totalFee}
      />
      <CustomText
        style={styles.courseSubtitle}
        subHeading={item?.university?.institutionName}
      />
    </TouchableOpacity>
  );
};

export default CourseCard;

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  courseCard: {
    width: 200,
    marginRight: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    overflow: "hidden",
  },
  courseImage: {
    width: "100%",
    // height: 120,
    backgroundColor: "#DDD",
  },
  courseTitle: {
    fontSize:RFValue(14),
    padding: 10,
  },
  courseSubtitle: {
    fontSize:RFValue(12),
    color: "#666",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 2,
    marginTop: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize:RFValue(14),
    fontWeight: "600",
    color: "#333",
  },
  subtitle: {
    fontSize:RFValue(12),
    color: "#666",
    marginTop: 4,
  },
});
