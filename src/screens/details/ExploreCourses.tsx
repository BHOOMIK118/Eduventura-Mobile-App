import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { FC, useCallback, useEffect, useState } from "react";
import Search from "@components/Search";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";
import CourseCard from "@components/CourseCard";
import { useRoute } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import { FlatList } from "react-native-gesture-handler";

const ExploreCourses: FC = () => {
  const { theme, setNotification } = useUI();
  const { params } = useRoute();
  const {id}:any = params
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  

  const [exploreCourseList, setExploreCourseList] = useState<any>([]);

  const fetchExplorCourses = async (search: string, pageNo: Number) => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/api/v1/getCourseByUniversity/${id}/courses${
        search !== ""
          ? `?courseName=${encodeURIComponent(
              search
            )}&page=${pageNo}&pageSize=10`
          : `?page=${pageNo}&pageSize=10`
      }`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "x-jwt-assertion": SYSTEM_TOKEN,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("fetched data success", pageNo);
        setExploreCourseList((prev) =>
          pageNo === 1 ? data.data : [...prev, ...data.data]
        );
        setHasMore(data.data.length > 0);
        console.log(data.data[0]);
        
        // setUniversityList(data.data);
      } else {
        console.log("error", data);
        setNotification({
          title: "Course Fetching",
          message: "Failed to fetch course list",
          duration : 1800,
          visible: true,
          success: false,
        });
      }
    } catch (error) {
      console.log("err", error);
      setNotification({
        title: "Course Fetching",
        message: "Failed to fetch course list",
        duration : 1800,
        visible: true,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const debounce = (func: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetchData = useCallback(
    debounce((searchText: string) => {
      setPageNo(1); // Reset page number on new search
      fetchExplorCourses(searchText, 1);
    }, 300),
    []
  );
  useEffect(() => {
    fetchExplorCourses(search, pageNo);
  }, [pageNo]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPageNo((prev) => prev + 1);
    }
  };

  const handleInputChange = (text) => {
    setSearch(text);
    debouncedFetchData(text);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
      <Search
        placeholderColor={THEME[theme].inputTextColor}
        textColor={THEME[theme].text.secondary}
        value={search}
        onSearchChange={handleInputChange}
        backgroundColor={"white"}
        borderColor={THEME[theme].disabled}
        icon={"magnify"}
        placeholder={"Find your course"}
        iconColor={THEME[theme].text.secondary}
      />
      <FlatList
        data={exploreCourseList}
        contentContainerStyle={{ flexGrow: 1, gap: 16, paddingLeft: 16 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CourseCard item={item} key={index} height={200} />
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={THEME[theme].primary} />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: THEME[theme].text.secondary, fontSize:RFValue(16) }}
              >
                No course found.
              </Text>
            </View>
          )
        }
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
      />
    </View>
  );
};

export default ExploreCourses;

const styles = StyleSheet.create({});
