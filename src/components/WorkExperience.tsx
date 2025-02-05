import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import CustomText from "./CustomText";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import HeightGap from "./HeightGap";
import Accordion from "./Accordion";
import InputTextField from "./InputTextField";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "./CustomButton";
import { useAuth } from "@context/AuthContext";
import { prettier } from "@utils/helpers";
import { API_BASE_URL } from "@utils/constant";
import { getKycDetails, getUserProfileAPI } from "@utils/services";
import { RFValue } from "react-native-responsive-fontsize";


const WorkExperienceItem = ({ formData, title }) => {
  const [expand, setExpand] = useState(false);
  const { theme, setNotification, setFullscreenLoading } = useUI();
  const [showToDatePicker, setToDatePicker] = useState(false);
  const [showFromDatePicker, setFromDatePicker] = useState(false);
  const [workExperience, setWorkExperience] = useState(formData);
  const { kycDetails, setKycDetails, profile, token,setProfile } = useAuth();

  useEffect(()=>{
    setWorkExperience(formData)
  },[formData])


  const handleFromDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setFromDatePicker(false);
      return};
    const current = selectedDate || new Date();
    setFromDatePicker(false);

    setWorkExperience((prev) => ({ ...prev, from: current }));
  };

  const handleToDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setToDatePicker(false);
      return};
    const current = selectedDate || new Date();
    setToDatePicker(false);
    setWorkExperience((prev) => ({ ...prev, to: current }));
  };

  const handleUpdate = async (isDelete = false) => {
    console.log("Work experience to be updated or deleted:", workExperience);
  
    // If deleting, filter out the work experience from the list
    let updatedWorkExperience = kycDetails?.user?.profile?.workExperience;
  
    if (isDelete) {
      updatedWorkExperience = updatedWorkExperience.filter(
        (item) => item.id !== workExperience.id
      );
    } else {
      // If updating, replace the item with the updated work experience
      updatedWorkExperience = updatedWorkExperience.map((item) =>
        item.id === workExperience.id ? workExperience : item
      );
    }
  
    // Prepare updated formData
    const updatedFormData = {
      ...(kycDetails?.user?.Application?.length > 0 && {
        applicationId: kycDetails?.user?.Application[0]?.applicationId,
      }),
      workExperience: updatedWorkExperience,
    };
  
    console.log("Updated formData:", updatedFormData);
  
    try {
      setFullscreenLoading(true);
  
      // Determine the endpoint based on whether it's an update or delete
      const response = await fetch(API_BASE_URL + "/api/v1/updateKyc", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFormData),
      });
      const data = await response.json();
  
      if (response.status === 200) {
        console.log("Success:", data);
        // const kycDetails = await getKycDetails(null, profile?.user?.userId);
        // const profileDetails = await getUserProfileAPI(token);
        // setProfile(profileDetails);
        // if (kycDetails) {
          setKycDetails(data);
          setNotification({
            title:'Work experience updated',
            message:'Your information has been updated',
            duration:1200,
            success:true,
            visible:true
          })
          setExpand(false);
        // } else {
        //   console.warn("Error fetching KYC details");
        //   setNotification({
        //     title:'Failed to update work experience',
        //     message:'Your information could not be updated',
        //     duration:1200,
        //     success:false,
        //     visible:true
        //   })
        // }
      } else {
        console.info("Failed to update:", data);
        setNotification({
          title:'Failed to work experience',
          message:'Your information could not be updated',
          duration:1200,
          success:false,
          visible:true
        })
      }
    } catch (error) {
      console.error("Error:", error);
      setNotification({
        title:'Failed to update work experience',
        message:'Your information could not be updated',
        duration:1200,
        success:false,
        visible:true
      })
    } finally {
      setFullscreenLoading(false);
      setExpand(false);
    }
  };

  return (
    <Accordion
      title={title}
      isExpanded={expand}
      setIsExpanded={setExpand}
      style={{
        justifyContent: "space-between",
        flexDirection: "row-reverse",
        backgroundColor: "white",
        borderColor: "#ddd",
        borderWidth: 1,
      }}
      Icon={"pencil"}
    >
      <View style={{ padding: 8, borderColor: "#ddd",borderWidth:1, gap: 8 }}>
        <View style={{ gap: 16, marginTop: 4 }}>
          <InputTextField
            label="Work Place Name"
            isRequired={true}
            backgroundColor={THEME[theme].background}
            value={workExperience?.workplaceName}
            placeholder="Enter work place name"
            onChangeText={(place) => {
              setWorkExperience((prev) => {
                return { ...prev, workplaceName: place };
              });
            }}
          />
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

          <CustomText
            subHeading="From Date"
            style={{
              color: THEME[theme].inputTextColor,
              fontFamily: "Regular",
              fontSize:RFValue(16),
              lineHeight: 22,
            }}
          />
          <CustomText
            subHeading="*"
            style={{
              color: 'red',
              fontFamily: "Regular",
              fontSize:RFValue(16),
              lineHeight: 22,
            }}
          />
          </View>
          <TouchableOpacity
            onPress={() => setFromDatePicker(true)}
            style={[
              styles.datePickerButton,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <CustomText
              style={{
                color: THEME[theme].inputTextColor,
                fontFamily: "Regular",
                fontSize:RFValue(14),
                lineHeight: 22,
              }}
              subHeading={
                workExperience.from !== ""
                  ? new Date(workExperience?.from)?.toDateString()
                  : "Select From Date"
              }
            />
            <MaterialCommunityIcons
              name="calendar"
              size={20}
              color={THEME[theme].primary}
            />
          </TouchableOpacity>
          {showFromDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={handleFromDateChange}
              maximumDate={new Date()}
            />
          )}
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          
          <CustomText
            subHeading="To Date"
            style={{
              color: THEME[theme].inputTextColor,
              fontFamily: "Regular",
              fontSize:RFValue(16),
              lineHeight: 22,
            }}
          />
          <CustomText
            subHeading="*"
            style={{
              color: 'red',
              fontFamily: "Regular",
              fontSize:RFValue(16),
              lineHeight: 22,
            }}
          />
          </View>
          <TouchableOpacity
            onPress={() => setToDatePicker(true)}
            style={[
              styles.datePickerButton,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <CustomText
              style={{
                color: THEME[theme].inputTextColor,
                fontFamily: "Regular",
                fontSize:RFValue(14),
                lineHeight: 22,
              }}
              subHeading={
                workExperience?.to !== ""
                  ? new Date(workExperience?.to)?.toDateString()
                  : "Select To Date"
              }
            />
            <MaterialCommunityIcons
              name="calendar"
              size={20}
              color={THEME[theme].primary}
            />
          </TouchableOpacity>
          {showToDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={handleToDateChange}
              maximumDate={new Date()}
            />
          )}

          <InputTextField
            label="Job Profile"
            isRequired={true}
            backgroundColor={THEME[theme].background}
            value={workExperience?.jobProfile}
            placeholder="Enter job profile"
            onChangeText={(jobProfile) => {
              setWorkExperience((prev) => {
                return { ...prev, jobProfile };
              });
            }}
          />

          <View
            style={{
              flexDirection: "row",
              // flex:1,
              justifyContent: "space-between",
              // gap:4,
              alignItems: "center",
            }}
          >
            <CustomButton
              title="Discard"
              background="red"
              style={{paddingHorizontal:32}}
              onPress={() => handleUpdate(true)}
            />
            <CustomButton
              title="Update"
              style={{paddingHorizontal:32}}

              background={THEME[theme].primary}
              onPress={() => {
                handleUpdate();
              }}
            />
          </View>
        </View>
      </View>
    </Accordion>
  );
};

const WorkExperience = () => {
  const { theme, setFullscreenLoading,setNotification } = useUI();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToDatePicker, setToDatePicker] = useState(false);
  const { profile, token, setKycDetails, kycDetails, setProfile } = useAuth();
  const [showFromDatePicker, setFromDatePicker] = useState(false);

  useEffect(() => {}, [kycDetails]);

  const [workExperience, setWorkExperience] = useState<any>({
    workplaceName: "",
    from: "",
    to: "",
    jobProfile: "",
  });

  const addWorkExperience = async (workExperience) => {
    try {
      setFullscreenLoading(true);
      const requestBody = {
        ...(kycDetails?.user?.Application?.length > 0 && {
          applicationId: kycDetails?.user?.Application[0]?.applicationId,
        }),
        workExperience: [
          ...kycDetails?.user?.profile?.workExperience,
          workExperience,
        ],
      };

      console.log("my final re", requestBody);
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
        console.log("success", data);
       
      
        // if (kycDetails) {
          setKycDetails(data);
          setNotification({
            title:'Work experience updated',
            message:'Your information has been updated',
            duration:1200,
            success:true,
            visible:true
          })
          setIsExpanded(false);
        // } else {
        //   console.warn("error fetching kyc details");
        //   setNotification({
        //     title:'Failed to update work experience',
        //     message:'Your information could not be updated',
        //     duration:1200,
        //     success:false,
        //     visible:true
        //   })
        // }
      } else {
        console.info("failed to update", data);
        setNotification({
          title:'Failed to update work experience',
          message:'Your information could not be updated',
          duration:1200,
          success:false,
          visible:true
        })
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title:'Failed to update work experience',
        message:'Your information could not be updated',
        duration:1200,
        success:false,
        visible:true
      })
    } finally {
      setFullscreenLoading(false);
    }
  };

  const handleFromDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setFromDatePicker(false);
      return};
    const current = selectedDate || new Date();
    setFromDatePicker(false);

    setWorkExperience((prev) => ({ ...prev, from: current }));
  };

  const handleToDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setToDatePicker(false);
      return};
    const current = selectedDate || new Date();
    setToDatePicker(false);
    setWorkExperience((prev) => ({ ...prev, to: current }));
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16,backgroundColor:'#ffffff' }}>
      
      <View style={styles.section}>
        <CustomText
          subHeading="Work Experience Details"
          subHeadingFontSize={14}
          subHeadingColor={THEME[theme].text.primary}
        />
        <HeightGap height={10} />
        {kycDetails?.user?.profile?.workExperience?.map((item, index) => {
        return (
          <WorkExperienceItem
            formData={item}
            key={index}
            title={item.jobProfile}
          />
        );
      })}
        <Accordion
          title={"Add Work Experience"}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        >
          <View style={{ gap: 16, marginTop: 4 }}>
            <InputTextField
              label="Work Place Name"
              isRequired={true}
              backgroundColor={THEME[theme].background}
              value={workExperience?.workplaceName}
              placeholder="Enter work place name"
              onChangeText={(place) => {
                setWorkExperience((prev) => {
                  return { ...prev, workplaceName: place };
                });
              }}
            />
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
  
            <CustomText
              subHeading="From Date"
              style={{
                color: THEME[theme].inputTextColor,
                fontFamily: "Regular",
                fontSize:RFValue(16),
                lineHeight: 22,
              }}
            />
            <CustomText
              subHeading="*"
              style={{
                color: 'red',
                fontFamily: "Regular",
                fontSize:RFValue(16),
                lineHeight: 22,
              }}
            />
            </View>
            <TouchableOpacity
              onPress={() => setFromDatePicker(true)}
              style={[
                styles.datePickerButton,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              <CustomText
                style={{
                  color: THEME[theme].inputTextColor,
                  fontFamily: "Regular",
                  fontSize:RFValue(14),
                  lineHeight: 22,
                }}
                subHeading={
                  workExperience.from !== ""
                    ? new Date(workExperience?.from)?.toDateString()
                    : "Select From Date"
                }
              />
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={THEME[theme].primary}
              />
            </TouchableOpacity>
            {showFromDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={handleFromDateChange}
                maximumDate={new Date()}
              />
            )}
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            
            <CustomText
              subHeading="To Date"
              style={{
                color: THEME[theme].inputTextColor,
                fontFamily: "Regular",
                fontSize:RFValue(16),
                lineHeight: 22,
              }}
            />
            <CustomText
              subHeading="*"
              style={{
                color: 'red',
                fontFamily: "Regular",
                fontSize:RFValue(16),
                lineHeight: 22,
              }}
            />
            </View>
            <TouchableOpacity
              onPress={() => setToDatePicker(true)}
              style={[
                styles.datePickerButton,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              <CustomText
                style={{
                  color: THEME[theme].inputTextColor,
                  fontFamily: "Regular",
                  fontSize:RFValue(14),
                  lineHeight: 22,
                }}
                subHeading={
                  workExperience?.to !== ""
                    ? new Date(workExperience?.to)?.toDateString()
                    : "Select To Date"
                }
              />
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={THEME[theme].primary}
              />
            </TouchableOpacity>
            {showToDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={handleToDateChange}
                maximumDate={new Date()}
              />
            )}

            <InputTextField
              label="Job Profile"
              isRequired={true}
              backgroundColor={THEME[theme].background}
              value={workExperience?.jobProfile}
              placeholder="Enter job profile"
              onChangeText={(jobProfile) => {
                setWorkExperience((prev) => {
                  return { ...prev, jobProfile };
                });
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomButton
                title="Cancel"
                background="#ddd"
                onPress={() => setIsExpanded(false)}
              />
              <CustomButton
                title="Save"
                background={THEME[theme].primary}
                onPress={() => {
                  console.log("work experience is", workExperience);
                  addWorkExperience(workExperience);
                  setIsExpanded(false);
                }}
              />
            </View>
          </View>
        </Accordion>
      </View>
    </ScrollView>
  );
};

export default WorkExperience;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  headerText: {
    fontSize: RFValue(24),
    fontWeight: "bold",
    marginBottom: 20,
  },
  dropdown: {
    borderColor: "#ccc",
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeTab: {
    backgroundColor: "#f0e6ff",
  },
  tabText: {
    color: "#666",
  },
  activeTabText: {
    color: "#6200ee",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontWeight: "500",
    marginBottom: 12,
    color: "#333",
  },
  qualificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 8,
  },
  qualificationText: {
    fontSize:RFValue(16),
    color: "#333",
  },
  editButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f0e6ff",
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: "#6200ee",
    fontSize:RFValue(16),
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  modalTitle: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize:RFValue(16),
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#6200ee",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});
