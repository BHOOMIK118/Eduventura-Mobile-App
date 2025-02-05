import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { TabView, SceneMap, } from "react-native-tab-view";
import BasicInformation from "@components/BasicInformation";
import Qualification from "@components/Qualification";
import Preferences from "@components/Preferences";
import WorkExperience from "@components/WorkExperience";
import { ScrollView } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
// Define the scenes for each tab

const renderScene = SceneMap({
  basic: BasicInformation,
  qualification: Qualification,
  preferences: Preferences,
  work_experience: WorkExperience,
});

// Forward the ref to control the modal externally
const BottomSheetComponent = forwardRef((_, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [index, setIndex] = useState(0); // Current tab index
  const [routes] = useState([
    { key: "basic", title: "Basic Information" },
    { key: "qualification", title: "Qualification" },
    { key: "work_experience", title: "Work Experience" },
    { key: "preferences", title: "Preferences" },
  ]);

  // Provide imperative methods for external control
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetModalRef.current?.present(),
    close: () => bottomSheetModalRef.current?.dismiss(),
  }));

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderTabBarItem = ({ route, focused }) => {
    return (
      <TouchableOpacity
        key={route.key}
        style={[
          styles.customTabItem,
          focused && styles.customTabItemFocused,
          { paddingHorizontal: 2, marginTop: 16, borderRadius: 24 },
        ]}
        onPress={() => setIndex(routes.findIndex((r) => r.key === route.key))}
      >
        <Text
          style={[styles.customTabText, focused && styles.customTabTextFocused,{paddingHorizontal:8}]}
        >
          {route.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTabBar = (props) => (
    <View style={{ backgroundColor: "white" }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
          flexGrow:1,
          gap:8,
          paddingHorizontal: 10,
        }}
      >
        {props.navigationState.routes.map((route, idx) =>
          renderTabBarItem({
            route,
            focused: idx === props.navigationState.index,
          })
        )}
      </ScrollView>
    </View>
  );
  

  return (
    // <BottomSheetModalProvider>
    //   <BottomSheetModal
    //   enableDynamicSizing={false}
    //     stackBehavior="push"
    //     activeOffsetX={[-999, 999]}
    //     keyboardBehavior="interactive"
    //     android_keyboardInputMode="adjustResize"
    //     activeOffsetY={[-50, 50]}
    //     ref={bottomSheetModalRef}
    //     snapPoints={["95%"]}
    //     onChange={handleSheetChanges}
    //     handleStyle={{
    //       borderTopLeftRadius: 24,
    //       borderTopRightRadius: 24,
    //     }}
    //     backdropComponent={({ style }) => (
    //       <View style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]} />
    //     )}
    //     style={{ flex: 1 }}
    //   >
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          lazy
          lazyPreloadDistance={0}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get("window").width }}
          renderTabBar={renderTabBar}
          swipeEnabled
        />
      // </BottomSheetModal>
    // </BottomSheetModalProvider>
  );
});

export default BottomSheetComponent;

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    //   justifyContent: "center",
    padding: 16,
    // alignItems: "center",
    backgroundColor: "white",
  },
  contentText: {
    fontSize: RFValue(18),
    textAlign: "center",
    marginVertical: 10,
    color: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  label: {
    fontSize:RFValue(16),
    fontWeight: "bold",
    marginBottom: 8,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize:RFValue(16),
    color: "#333",
  },
  profileImageSection: {
    alignItems: "center",
    marginVertical: 16,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
  },
  dropdown: {
    borderColor: "#ccc",
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  customTabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    // borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingHorizontal: 10,
  },
  customTabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  customTabItemFocused: {
    backgroundColor: "#13478b",
  },
  customTabText: {
    fontSize: RFValue(12),
    fontWeight: "600",
    color: "gray",
  },
  customTabTextFocused: {
    color: "white",
  },
});
