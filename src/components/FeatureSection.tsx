import { View, Text, TouchableOpacity,  StyleSheet } from "react-native";
import React, { FC } from "react";
import {
  GraduationCap,
  Headphones,
  BookOpen,
  Award,
} from "lucide-react-native";
import CustomText from "./CustomText";
import { useNavigation } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";


const FeatureSection: FC = () => {
  const {navigate} = useNavigation<any>();
  return (
    <View style={styles.grid}>
      <TouchableOpacity style={styles.gridItem} onPress={()=>navigate("Universities")
}>
        <View style={[styles.iconCircle, { backgroundColor: "#E8F5FF" }]}>
          <GraduationCap size={24} color="#0066CC" />
        </View>
        <CustomText style={styles.gridItemText} heading={`Explore \nUniversities`} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.gridItem} >
        <View style={[styles.iconCircle, { backgroundColor: "#FFF3E8" }]}>
          <Headphones size={24} color="#FF9933" />
        </View>
        <CustomText style={styles.gridItemText} heading={`Get \nConsultation`} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.gridItem} onPress={()=>navigate("COURSESFILTER",{courseName:'Bachelor'})}>
        <View style={[styles.iconCircle, { backgroundColor: "#FFE8E8" }]}>
          <BookOpen size={24} color="#CC0000" />
        </View>
        <CustomText style={styles.gridItemText} heading={`Bachelors \nCourse`}/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.gridItem} onPress={()=>navigate("COURSESFILTER",{courseName:'Masters'})}>
        <View style={[styles.iconCircle, { backgroundColor: "#E8FFE8" }]}>
          <Award size={24} color="#00CC00" />
        </View>
        <CustomText style={styles.gridItemText} heading={`Masters \nCourse`}/>
      </TouchableOpacity>
    </View>
  );
};

export default FeatureSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: RFValue(28),
    fontWeight: "bold",
    color: "#333",
    lineHeight: 36,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize:RFValue(16),
  },
  filterButton: {
    width: 45,
    height: 45,
    backgroundColor: "#13478b",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  featuredCard: {
    backgroundColor: "#F0FDFA",
    margin: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  featuredSubtitle: {
    fontSize:RFValue(14),
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  featuredImage: {
    width: 120,
    height: 120,
  },
  exploreButton: {
    backgroundColor: "#13478b",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  exploreButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
  },
  activeDot: {
    backgroundColor: "#13478b",
    width: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:'center',
    gap: 10,
  },
  gridItem: {
    width: "47%",
    padding: 10,
    paddingTop:20,
    flexDirection:'row',
    gap:16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  gridItemText: {
    fontSize: RFValue(13),
    fontWeight: "600",
    color: "#333",
    lineHeight: 20,
  },
  popularSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#333",
  },
  viewAllText: {
    color: "#13478b",
    fontSize:RFValue(14),
  },
  popularScroll: {
    flexDirection: "row",
  },
  universityImage: {
    width: 200,
    height: 150,
    borderRadius: 16,
    marginRight: 16,
  },
});
