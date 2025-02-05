import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  Calendar,
  Clock,
  GraduationCap,
  ChevronRight,
} from "lucide-react-native";
import CustomText from "./CustomText";
import { RFValue } from "react-native-responsive-fontsize";


export default function AppliedCourseCard({ application }) {
  console.log('shf',application)
  return (
    <TouchableOpacity style={styles.card} disabled>
      <View style={styles.header}>
        <View style={styles.statusBadge}>
          <CustomText style={styles.statusText} heading={application.status} />
        </View>
        {/* <ChevronRight size={20} color="#666" /> */}
      </View>
      <CustomText
        style={styles.courseName}
        heading={application?.course?.courseName}
      />
      <CustomText
        style={styles.universityName}
        subHeading={application?.university?.institutionName}
      />
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Calendar size={16} color="#666" />
          <CustomText
            style={styles.detailText}
            subHeading={new Date(application?.applicationDate).toLocaleString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                //   second: "2-digit",
              }
            )}
          />
        </View>
        {/* <View style={styles.detailItem}>
          <Clock size={16} color="#666" />
          <CustomText style={styles.detailText} subHeading={course.duration} />
        </View> */}
      </View>
      {/* <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <GraduationCap size={24} color="#13478b" />
        </View>
        <Text style={styles.footerText}>Track your application status</Text>
      </View> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#FF9800",
    fontSize: RFValue(12),
    fontWeight: "600",
  },
  courseName: {
    fontSize: RFValue(18),
    color: "#333",
    marginBottom: 4,
  },
  universityName: {
    fontSize:RFValue(14),
    color: "#666",
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    fontSize:RFValue(14),
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  iconContainer: {
    backgroundColor: "#E6F7F5",
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  footerText: {
    fontSize:RFValue(14),
    color: "#13478b",
    fontWeight: "600",
  },
});
