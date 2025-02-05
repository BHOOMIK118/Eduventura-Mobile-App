import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useCallback, useRef, useState } from "react";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import { useAuth } from "@context/AuthContext";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";
import InputTextField from "@components/InputTextField";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import CustomText from "@components/CustomText";
import Search from "@components/Search";
import { FlatList } from "react-native-gesture-handler";
import Separator from "@components/Separator";
import CustomButton from "@components/CustomButton";
import { RFValue } from "react-native-responsive-fontsize";

const CreateCourse: FC = () => {
  const { theme, setNotification, setFullscreenLoading } = useUI();
  const { token } = useAuth();
  const { params } = useRoute<any>();
  const { setOptions } = useNavigation<any>();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [sheetIndex, setSheetIndex] = useState(-1);
  const [hasMore, setHasMore] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState("");
  const [universityList, setUniversityList] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setformData] = useState<any>({
    cricosProviderCode: "",
    courseName: "",
    courseLevel: "",
    courseDuration: "",
    totalFee: "",
    cricosCourseCode: "",
  });

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setformData((prev) => ({
            ...prev,
            cricosProviderCode: {
              id: item.cricosProviderCode,
              universityName: item.institutionName,
            },
          }));

          handleSheetChanges(-1);
        }}
      >
        <View style={{ marginVertical: 4 }}>
          <CustomText subHeading={item.institutionName} />
        </View>
      </TouchableOpacity>
    );
  };

  const handleInputChange = (text) => {
    setSearch(text);
    debouncedFetchData(text);
  };

  const handleSheetChanges = useCallback((index: number) => {
    setSheetIndex(index); // Update sheet index when it changes
    console.log("Bottom sheet index changed to", index);
    if (index === -1) {
      setUniversityList([]);
      setSearch("");
      setPageNo(1);
      handleCloseBottomSheet(bottomSheetRef);
    }
  }, []);

  const handleOpenBottomSheet = (ref, func) => {
    ref.current?.present();
    func(search, 1); // Expands the bottom sheet
  };

  const handleCloseBottomSheet = (ref) => {
    ref.current?.close(); // Closes the bottom sheet
  };

  const fetchUniversityList = async (search, page) => {
    console.log("running", page, search);
    const requestBody = `${API_BASE_URL}/api/v1/getInstitution${
      search !== ""
        ? `?institutionName=${encodeURIComponent(
            search
          )}&page=${pageNo}&pageSize=20`
        : `?page=${pageNo}&pageSize=20`
    }`;
    console.log(requestBody);

    try {
      setLoading(true);
      const response = await fetch(requestBody, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-jwt-assertion": SYSTEM_TOKEN,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        // console.log("success", data);
        setUniversityList((prev) =>
          pageNo === 1 ? data.data : [...prev, ...data.data]
        );
        setHasMore(data.data.length > 0);
      } else {
        console.warn("error", data);
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

//   console.log("formDta from params", params?.data);
//   console.log("formDta", formData);
  const loadMore = (func) => {
    console.log("sfasfa", loading, hasMore);
    if (!loading && hasMore) {
      setPageNo(pageNo + 1);
      func(search, pageNo + 1);
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
      fetchUniversityList(searchText, 1);
    }, 300),
    []
  );

  useFocusEffect(
    useCallback(() => {
      if (params?.edit) {
        const updatedFields = {
          courseDuration: params?.data?.courseDuration?.toString() || "",
          totalFee: params?.data?.totalFee?.toString() || "",
        };
        setformData({ ...params?.data, ...updatedFields });
        // setValue(params?.data?.courseLevel || null);
        setOptions({
          headerTitle: "Update Course",
        });
      }
    }, [params])
  );
  const navigation = useNavigation<any>();

  const handleCreateCourse = async () => {
    try {
      setFullscreenLoading(true);
      const url = API_BASE_URL + "/api/v1/createCourse";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          cricosProviderCode:
            formData?.cricosProviderCode?.id || formData?.cricosProviderCode,
          courseDuration: Number(formData.courseDuration),
          totalFee: Number(formData.totalFee),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setNotification({
          title: "Success",
          message: "Successfully created course",
          duration: 1200,
          visible: true,
          success: true,
        });
        console.log("success", data);
        navigation.goBack();
      } else {
        console.warn("error", data);
        setNotification({
          title: "Failed",
          message: data.message || "Could not create course",
          duration: 1200,
          visible: true,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed",
        message: "Could not create course",
        duration: 1200,
        visible: true,
        success: false,
      });
    } finally {
      setFullscreenLoading(false);
    }
  };

  const handleUpdateCourse = async () => {
    try {
      setFullscreenLoading(true);
      const url =
        API_BASE_URL + `/api/v1/updateCourse/${params?.data?.cricosCourseCode}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          cricosProviderCode:
            formData?.cricosProviderCode?.id || formData?.cricosProviderCode,
          courseDuration: Number(formData.courseDuration),
          totalFee: Number(formData.totalFee),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setNotification({
          title: "Success",
          message: "Successfully updated course",
          duration: 1200,
          visible: true,
          success: true,
        });
        console.log("success", data);
        navigation.goBack();
      } else {
        console.warn("error", data);
        setNotification({
          title: "Failed",
          message: data.message || "Could not update course",
          duration: 1200,
          visible: true,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed",
        message: "Could not update course",
        duration: 1200,
        visible: true,
        success: false,
      });
    } finally {
      setFullscreenLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEME[theme].background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16 }}>
        <View style={{ gap: 8 }}>
          <CustomText
            heading="University"
            headingFontSize={14}
            headingFontFamily="Regular"
            headingColor={THEME[theme].inputTextColor}
          />
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: THEME[theme].inputTextFieldBorderColor,
              borderRadius: 4,
              padding: 16,
              height: 50,
              gap: 8,
            }}
            onPress={() =>
              handleOpenBottomSheet(bottomSheetRef, fetchUniversityList)
            }
          >
            <CustomText
              subHeading={
                formData?.cricosProviderCode?.universityName ||
                formData?.university?.cricosProviderCode?.universityName ||
                formData?.university?.institutionName ||
                "Select your university"
              }
              subHeadingColor={THEME[theme].inputTextColor}
            />
          </TouchableOpacity>
        </View>
        <InputTextField
          label="Course Code"
          placeholder="Enter course code"
          value={formData?.cricosCourseCode}
          onChangeText={(text) =>
            setformData({ ...formData, cricosCourseCode: text })
          }
        />
        <InputTextField
          label="Course Name"
          placeholder="Enter course name"
          value={formData?.courseName}
          onChangeText={(text) =>
            setformData({ ...formData, courseName: text })
          }
        />

        <InputTextField
          label="Course Level"
          placeholder="Enter course level"
          value={formData?.courseLevel}
          onChangeText={(text) =>
            setformData({ ...formData, courseLevel: text })
          }
        />

        <InputTextField
          label="Course Duration (In Year)"
          placeholder="Enter course duration"
          value={formData?.courseDuration}
          keyboardType="numeric"
          onChangeText={(text) =>
            setformData({ ...formData, courseDuration: text })
          }
        />
        <InputTextField
          label="Course Fee"
          placeholder="Enter tuition fee"
          value={formData?.totalFee}
          keyboardType="numeric"
          onChangeText={(text) =>
            setformData({ ...formData, totalFee: text })
          }
        />

        <CustomButton
          title={params?.edit ? "Update Course" : "Create Course"}
          background={THEME[theme].primary}
          style={{marginTop:'auto'}}
            onPress={
              params?.edit ? handleUpdateCourse : handleCreateCourse
            }
       
        />
      </ScrollView>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          // enableContentPanningGesture={false}
          index={2}
          stackBehavior="push"
          snapPoints={["50%", "90%"]}
          onChange={handleSheetChanges}
          backdropComponent={({ style }) =>
            sheetIndex !== -1 ? (
              <View
                style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
              />
            ) : null
          }
          // style={{marginTop:20}}
          enablePanDownToClose
        >
          <View style={{ padding: 16, paddingBottom: 0 }}>
            <Search
              placeholderColor={THEME[theme].inputTextColor}
              textColor={THEME[theme].text.secondary}
              value={search}
              onSearchChange={handleInputChange}
              backgroundColor={"white"}
              borderColor={THEME[theme].disabled}
              icon={"magnify"}
              placeholder={"Find your university"}
              iconColor={THEME[theme].text.secondary}
            />
          </View>
          {/* <ScrollView style={[styles.contentContainer, { flexGrow: 1 }]}> */}
          <BottomSheetView style={{ flex: 1 }}>
            <FlatList
              data={universityList}
              renderItem={renderItem}
              contentContainerStyle={[
                styles.contentContainer,
                {
                  gap: 16,
                  //   padding: 4,
                  //   paddingTop: 0,
                  // backgroundColor:'red',
                  flexGrow: 1,
                  marginBottom: 20,
                },
              ]}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={Separator}
              onEndReached={() => loadMore(fetchUniversityList)}
              onEndReachedThreshold={0.5}
            />
          </BottomSheetView>
          {/* </ScrollView> */}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

export default CreateCourse;

const styles = StyleSheet.create({
  contentContainer: {
    // flexGrow: 1,
    // flex:1,
    padding: 16,
    // padding: 36,
    // alignItems: "center",
    // backgroundColor: "red",
  },
  label: {
    fontSize:RFValue(16),
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    fontSize:RFValue(16),
    fontWeight: "600",
    textAlign: "center",
  },
});
