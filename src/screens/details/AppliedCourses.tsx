import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { FC, useCallback, useEffect, useState } from "react";
import { THEME } from "@utils/ui";
import { useAuth } from "@context/AuthContext";
import { prettier } from "@utils/helpers";
import AppliedCourseCard from "@components/AppliedCourseCard";
import { API_BASE_URL } from "@utils/constant";
import { useUI } from "@context/UIContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const renderItem = ({ item }) => {
  return <AppliedCourseCard application={item} />;
};

const AppliedCourses: FC = () => {
  const { profile, token } = useAuth();
  const { setFullscreenLoading, setNotification } = useUI();
  const [applied, setApplied] = useState([]);
  const { setOptions } = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setOptions({
        headerTitleStyle: {
          fontFamily: "Medium",
        },
      });
    }, [])
  );

  useEffect(() => {
    const fetchApplied = async () => {
      try {
        setFullscreenLoading(true);
        const response = await fetch(API_BASE_URL + "/api/v1/myApplication", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          prettier("data.data.applications", data.applications);
          setApplied(data.applications);
        } else {
          // setNotification({
          //   message: "Error fetching applied courses",
          //   title: "Action Status",
          //   duration : 1800,
          //   success: false,
          //   visible: true,
          // });
          console.log("ghj", data);
        }
      } catch (error) {
        setNotification({
          message: "Error fetching applied courses",
          title: "Network request failed",
          duration: 1800,
          success: false,
          visible: true,
        });
        console.error("Error", error);
      } finally {
        setFullscreenLoading(false);
      }
    };

    fetchApplied();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        data={applied}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1 }}
        keyExtractor={(item, index) =>
          item?.applicationId?.toString() || `${index}`
        }
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>No applications found</Text>
          </View>
        }
      />
    </View>
  );
};

export default AppliedCourses;

const styles = StyleSheet.create({});
