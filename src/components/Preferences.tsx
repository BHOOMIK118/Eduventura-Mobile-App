import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import CustomText from "./CustomText";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import { useAuth } from "@context/AuthContext";
import CountryPicker from "react-native-country-picker-modal";
import { RFValue } from "react-native-responsive-fontsize";


import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Search from "./Search";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";
import Separator from "./Separator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, FlatList } from "react-native-gesture-handler";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { prettier } from "@utils/helpers";
import CustomButton from "./CustomButton";
import { getKycDetails } from "@utils/services";

const Preferences = () => {
  const { theme } = useUI();
  const { profile, token, kycDetails, setKycDetails } = useAuth();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  // const [formData, setFormData] = useState<any>({
  //   preferredCountry: profile?.user?.country || "IN",
  //   preferredUniversity: null,
  //   preferredCollege: null,
  //   coursePreference: null,
  // });
  const [formData, setFormData] = useState<any>(
    kycDetails?.user?.profile?.studyPreferences[0]
  );
  const [search, setSearch] = useState("");
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [universityList, setUniversityList] = useState<any>([]);
  const [sheetIndex, setSheetIndex] = useState(-1);
  const bottomSheetCollegeRef = useRef<BottomSheetModal>(null);
  const [collegeList, setCollegeList] = useState([]);
  const [sheetIndexCollege, setSheetIndexCollege] = useState(-1);
  const [hasMore, setHasMore] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const { setNotification, setFullscreenLoading } = useUI();


  const handleInputChange = (text) => {
    setSearch(text);
    debouncedFetchData(text);
  };

  const handleInputCourseChange =(text)=>{
    setSearch(text);
    debouncedFetchCollege(text);
  }

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    // setSheetIndex(index); // Update sheet index when it changes
    console.log("Bottom sheet index changed to", index);
    if (index === -1) {
      handleCloseBottomSheet(bottomSheetRef);
      setUniversityList([]);
      setSearch("");
      setPageNo(1);
    }
  }, []);
  const handleSheetCollegeChanges = useCallback((index: number) => {
    console.log("Bottom sheet college index changed to", index);
    if (index === -1) {
      handleCloseBottomSheet(bottomSheetCollegeRef);
      setCollegeList([]);
      setSearch("");
      setPageNo(1);
    }
    // setSheetIndexCollege(index); // Update sheet index when it changes
  }, []);

  // Open Bottom Sheet
  const handleOpenBottomSheet = (ref, func) => {
    ref.current?.present();
    func(search, 1); // Expands the bottom sheet
  };

  // Close Bottom Sheet
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

  const fetchCollegeList = async (search, page) => {
    try {
      setLoading(true);
      const requestBody = `${API_BASE_URL}/api/v1/getCourseByUniversity/${
        formData?.preferredUniversity?.id || formData?.university?.cricosProviderCode
      }/courses?page=${page}&pageSize=20${
        search ? `&courseName=${search}` : ''
      }`;
      
      console.warn('re',requestBody)
      const response = await fetch(
        requestBody,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-jwt-assertion": SYSTEM_TOKEN,
          },
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        // console.log("success", data);
        setCollegeList(data.data);
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

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        {...props}
      />
    ),
    []
  );

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setFormData((prev) => ({
            ...prev,
            preferredUniversity: {
              id: item.cricosProviderCode,
              universityName: item.institutionName,
            },
            coursePreference: null,
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
  const renderCollegeItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setFormData((prev) => ({
            ...prev,
            coursePreference: {
              id: item.cricosCourseCode,
              courseName: item.courseName,
            },
          }));
          handleSheetCollegeChanges(-1);
        }}
      >
        <View style={{ marginVertical: 4 }}>
          <CustomText subHeading={item.courseName} />
        </View>
      </TouchableOpacity>
    );
  };

  const loadMore = (func) => {
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
  const debouncedFetchCollege = useCallback(
    debounce((searchText: string) => {
      setPageNo(1); // Reset page number on new search
      fetchCollegeList(searchText, 1);
    }, 300),
    []
  );

  const handleSubmit = async () => {
    const requestBody = {
      ...(kycDetails?.user?.Application?.length > 0 && {
        applicationId: kycDetails?.user?.Application[0]?.applicationId,
      }),
      studyPreferences: [
        {
          coursePreference:
            formData?.coursePreference?.id ||
            formData?.course?.cricosCourseCode,
          preferredUniversity:
            formData?.preferredUniversity?.id ||
            formData?.university?.cricosProviderCode,
          preferredCountry: formData?.preferredCountry,
        },
      ],
    };
    console.log("request body", requestBody);

    try {
      setFullscreenLoading(true);
      const response = await fetch(API_BASE_URL + "/api/v1/updateKyc", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (response.status === 200) {
        // console.log("success", data);
        // const kyc = await getKycDetails(null, profile?.user?.userId);
        // if (kyc) {
          setKycDetails(data);
          setNotification({
            title: "Preferences updated",
            message: "Your information has been updated",
            duration: 1200,
            success: true,
            visible: true,
          });
        }
      // } else {
      //   console.info("failed to update", data);
      //   setNotification({
      //     title: "Failed to update preferences",
      //     message: "Your information could not be updated",
      //     duration: 1200,
      //     success: false,
      //     visible: true,
      //   });
      // }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed to update preferences",
        message: "Your information could not be updated",
        duration: 1200,
        success: false,
        visible: true,
      });
    } finally {
      setFullscreenLoading(false);
    }
  };

  return (
    <>
      <View style={{ padding: 16, gap: 16,backgroundColor:'#ffffff' }}>
        <View style={{ gap: 6 }}>
          <CustomText
            subHeading="Preferred Country"
            style={{
              color: THEME[theme].inputTextColor,
              fontFamily: "Regular",
              fontSize:RFValue(14),
              lineHeight: 22,
            }}
          />
          <CountryPicker
            withFilter
            withFlag
            countryCode={formData?.preferredCountry || "US"}
            withCountryNameButton
            withCloseButton
            containerButtonStyle={[styles.countryPickerButton]}
            withCallingCode={false}
            theme={{
              fontFamily: "Regular",
              fontSize:RFValue(16),
              onBackgroundTextColor: THEME[theme].inputTextColor,
            }}
            withCallingCodeButton={false}
            withCurrency={false}
            withCurrencyButton={false}
            onSelect={(country) => {
              console.log(country);
              setFormData((prev) => ({
                ...prev,
                preferredCountry: country.cca2, // Store only the country code
              }));
            }}
          />
        </View>
        {/* <InputTextField
          label="Preferred Course"
          value={formData?.coursePreference}
          onChangeText={(course) =>
            setFormData((prev) => ({ ...prev, coursePreference: course }))
          }
        /> */}

        <CustomText
          heading="Preferred University"
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
            // height: 50,
            gap: 8,
          }}
          onPress={() =>
            handleOpenBottomSheet(bottomSheetRef, fetchUniversityList)
          }
        >
          <CustomText
            subHeading={
              formData?.preferredUniversity?.universityName ||
              formData?.university?.institutionName ||
              formData?.preferredUniversity ||
              "Select your preferred university"
            }
            subHeadingColor={THEME[theme].inputTextColor}
          />
        </TouchableOpacity>

        <CustomText
          heading="Preferred Course"
          headingFontSize={14}
          headingFontFamily="Regular"
          headingColor={THEME[theme].inputTextColor}
        />
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: THEME[theme].inputTextFieldBorderColor,
            borderRadius: 4,
            // backgroundColor:(Object.keys(formData?.preferredUniversity ?? {}).length === 0 && 
            // Object.keys(formData?.university ?? {}).length === 0) &&'#E5E5E5',
            padding: 16,
            // height: 52,
            gap: 8,
          }}
          disabled={
            (Object.keys(formData?.preferredUniversity ?? {}).length === 0 && 
            Object.keys(formData?.university ?? {}).length === 0)
          }
          onPress={() =>
            handleOpenBottomSheet(bottomSheetCollegeRef, fetchCollegeList)
          }
        >
          <CustomText
            subHeading={
              formData?.coursePreference?.courseName ||
              formData?.course?.courseName ||
              formData?.coursePreference ||
              "Select your preferred course"
            }
            subHeadingColor={THEME[theme].inputTextColor}
          />
        </TouchableOpacity>

        <CustomButton
          title="Save Preferences"
          background={THEME[theme].primary}
          onPress={handleSubmit}
        />
      </View>

      {/* BottomSheet University*/}
      <BottomSheetModalProvider>

      <BottomSheetModal
        ref={bottomSheetRef}
        // enableDynamicSizing={false}
        // enableContentPanningGesture={false}
        index={2}
        stackBehavior="push"
        snapPoints={["50%", "90%"]}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
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
            ListEmptyComponent={
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>

            <CustomText subHeading="No university found"/>
            </View>
          }
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


      {/* BottomSheet College*/}
      <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetCollegeRef}
        index={1}
        stackBehavior="push"
        snapPoints={["90%", "90%"]}
        onChange={handleSheetCollegeChanges}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
      >
        <View style={{ padding: 16, paddingBottom: 0 }}>
          <Search
            placeholderColor={THEME[theme].inputTextColor}
            textColor={THEME[theme].text.secondary}
            value={search}
            onSearchChange={handleInputCourseChange}
            backgroundColor={"white"}
            borderColor={THEME[theme].disabled}
            icon={"magnify"}
            placeholder={"Find your course"}
            iconColor={THEME[theme].text.secondary}
          />
        </View>
        {/* <ScrollView
          contentContainerStyle={[styles.contentContainer, { flexGrow: 1 }]}
        > */}
        <BottomSheetView style={{ flex: 1 }}>

          <FlatList
            data={collegeList}
            ListEmptyComponent={<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <CustomText subHeading="No course found"/>
            </View>}
            renderItem={renderCollegeItem}
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
          />
        {/* </ScrollView> */}
        </BottomSheetView>
      </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};

export default Preferences;

const styles = StyleSheet.create({
  contentContainer: {
    // flexGrow: 1,
    // flex:1,
    padding: 16,
    // padding: 36,
    // alignItems: "center",
    // backgroundColor: "red",
  },
  countryPickerButton: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
