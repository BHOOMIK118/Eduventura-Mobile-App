import { ScrollView, StyleSheet, View } from "react-native";
import React, { FC, useCallback, useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import { useAuth } from "@context/AuthContext";
import { API_BASE_URL } from "@utils/constant";
import InputTextField from "@components/InputTextField";
import CustomText from "@components/CustomText";
import CustomButton from "@components/CustomButton";
import { RFValue } from "react-native-responsive-fontsize";

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

const institutionTypes = [
  { label: "Central", value: "Central" },
  { label: "State", value: "State" },
  { label: "Private", value: "Private" },
  { label: "Deemed", value: "Deemed" },
];

const CreateUniversity: FC = () => {
  const { theme, setNotification, setFullscreenLoading } = useUI();
  const { token } = useAuth();
  const { params } = useRoute<any>();
  const { setOptions } = useNavigation<any>();
  const [formData, setformData] = useState<any>({
    cricosProviderCode: "",
    institutionName: "",
    institutionType: "", // Default empty to indicate no selection
    institutionCapacity: "",
    website: "",
    postalAddressCity: "",
    postalAddressLine1: "",
    postalAddressPostcode: "",
    postalAddressState: "",
    // priority: "", // New field for priority
  });
  const navigation = useNavigation<any>();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(institutionTypes);

  useFocusEffect(
    useCallback(() => {
      if (params?.edit) {
        const updatedFields = {
          institutionCapacity:
            params?.data?.institutionCapacity?.toString() || "",
          postalAddressPostcode:
            params?.data?.postalAddressPostcode?.toString() || "",
        };
        setformData({ ...params.data, ...updatedFields });
        setValue(params?.data?.institutionType || null);
        setOptions({
          headerTitle: "Update University",
        });
      }
    }, [params])
  );

  const handleUpdateUniversity = async () => {
    try {
      setFullscreenLoading(true);
      const response = await fetch(
        API_BASE_URL +
          `/api/v1/updateUniversity/${params?.data?.cricosProviderCode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            institutionType: value,
            institutionCapacity: Number(formData.institutionCapacity),
            postalAddressPostcode: Number(formData.postalAddressPostcode),
            //   priority: Number(formData.priority),
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setNotification({
          title: "Success",
          message: "Successfully updated university",
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
          message: data.message || "Could not update university",
          duration: 1200,
          visible: true,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed",
        message: "Could not update university",
        duration: 1200,
        visible: true,
        success: false,
      });
    } finally {
      setFullscreenLoading(false);
    }
  };

  const handleCreateUniversity = async () => {
    try {
      setFullscreenLoading(true);
      const response = await fetch(API_BASE_URL + "/api/v1/createUni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          institutionType: value,
          institutionCapacity: Number(formData.institutionCapacity),
          postalAddressPostcode: Number(formData.postalAddressPostcode),
          //   priority: Number(formData.priority),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({
          title: "Success",
          message: "Successfully created university",
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
          message: data.message || "Could not create university",
          duration: 1200,
          visible: true,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Failed",
        message: "Could not create university",
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
        <InputTextField
          label="Cricos Provider Code"
          value={formData?.cricosProviderCode}
          placeholder="Enter cricos provider code"
          onChangeText={(text) =>
            setformData({ ...formData, cricosProviderCode: text })
          }
        />
        <InputTextField
          label="Institution Name"
          value={formData?.institutionName}
          placeholder="Enter institution name"
          onChangeText={(text) =>
            setformData({ ...formData, institutionName: text })
          }
        />

        {/* Dropdown for Institution Type */}
        <CustomText
          headingColor={THEME[theme].inputTextColor}
          subHeading="Institution Type"
          style={{
            color: THEME[theme].inputTextColor,
            fontFamily: "Regular",
            fontSize:RFValue(14),
            lineHeight: 22,
          }}
        />
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Select Institution Type"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        <InputTextField
          label="Institution Capacity"
          value={formData?.institutionCapacity}
          placeholder="Enter institution capacity"
          keyboardType="numeric"
          onChangeText={(text) =>
            setformData({ ...formData, institutionCapacity: text })
          }
        />
        <InputTextField
          label="Website"
          value={formData?.website}
          placeholder="Enter website"
          onChangeText={(text) => setformData({ ...formData, website: text })}
        />
        <InputTextField
          label="Postal Address City"
          placeholder="Enter postal address city"
          value={formData?.postalAddressCity}
          onChangeText={(text) =>
            setformData({ ...formData, postalAddressCity: text })
          }
        />
        <InputTextField
          label="Postal Address Line 1"
          value={formData?.postalAddressLine1}
          placeholder="Enter postal address line 1"
          onChangeText={(text) =>
            setformData({ ...formData, postalAddressLine1: text })
          }
        />
        <InputTextField
          label="Postal Address Postcode"
          value={formData?.postalAddressPostcode}
          placeholder="Enter postal address postcode"
          keyboardType="numeric"
          onChangeText={(text) =>
            setformData({ ...formData, postalAddressPostcode: text })
          }
        />
        <InputTextField
          label="Postal Address State"
          value={formData?.postalAddressState}
          placeholder="Enter postal address state"
          onChangeText={(text) =>
            setformData({ ...formData, postalAddressState: text })
          }
        />
        {/* <InputTextField
          label="Priority"
          value={formData?.priority}
          placeholder="Enter priority"
          keyboardType="numeric"
          onChangeText={(text) => setformData({ ...formData, priority: text })}
        /> */}

        {/* <View style={styles.buttonContainer}>
          <Text style={styles.button} onPress={handleCreateUniversity}>
            Create University
          </Text>
        </View> */}
        <CustomButton
          title={params?.edit ? "Update University" : "Create University"}
          background={THEME[theme].primary}
          onPress={
            params?.edit ? handleUpdateUniversity : handleCreateUniversity
          }
        />
      </ScrollView>
    </View>
  );
};

export default CreateUniversity;

const styles = StyleSheet.create({
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
