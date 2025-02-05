import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useUI } from "@context/UIContext";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";
import { Search } from "lucide-react-native";
import { THEME } from "@utils/ui";
import CourseCard from "@components/CourseCard";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import { FlatList } from "react-native-gesture-handler";

const CoursesFilter: FC = () => {
  const [courseList, setCourseList] = useState<any>([]);
  const { params } = useRoute<any>();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<any>(params.courseName || "");
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { theme, setNotification } = useUI();
  const { setOptions } = useNavigation();

  const fetchCourseList = async (search: string, pageNo: Number) => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/api/v1/getAllCourses${
        search !== ""
          ? `?courseName=${encodeURIComponent(
              search
            )}&page=${pageNo}&pageSize=10`
          : `?page=${pageNo}&pageSize=10`
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-jwt-assertion": SYSTEM_TOKEN,
        },
      });
      const data = await response.json();
      if (response.ok) {
        // setCourseList(data.data);
        setCourseList((prev) =>
          pageNo === 1 ? data.data : [...prev, ...data.data]
        );
        setHasMore(data.data.length > 0);
        console.log("fetched successfully");
      } else {
        console.log("error", data);
        setNotification({
          title: "Fetch Status",
          message: "Failed to fetch course list",
          duration : 1800,
          visible: true,
          success: false,
        });
      }
    } catch (error) {
      console.error("err", error);
      setNotification({
        title: "Fetch Status",
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
      fetchCourseList(searchText, 1);
    }, 300),
    []
  );

  useEffect(() => {
    fetchCourseList(search, pageNo);
  }, [pageNo]);

  useFocusEffect(
    useCallback(() => {
      setOptions({
        headerTitle: `${params.courseName} Course List`,
      });
    }, [])
  );

  const handleInputChange = (text) => {
    setSearch(text);
    debouncedFetchData(text);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPageNo((prev) => prev + 1);
    }
  };

  return (
    <View
      style={{ flex: 1, padding: 16, backgroundColor: THEME[theme].background }}
    >
      {/* <Search
        placeholderColor={THEME[theme].inputTextColor}
        textColor={THEME[theme].text.secondary}
        value={search}
        onSearchChange={handleInputChange}
        backgroundColor={"white"}
        borderColor={THEME[theme].disabled}
        icon={"magnify"}
        placeholder={"Find your course"}
        iconColor={THEME[theme].text.secondary}
      /> */}
      <FlatList
        data={courseList}
        contentContainerStyle={{
          gap: 16,
          paddingLeft: 16,
          paddingTop: 16,
          flexGrow: 1,
        }}
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
                No Courses found.
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

export default CoursesFilter;
