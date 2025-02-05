import { View, Text, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "@utils/ui";
import { useUI } from "@context/UIContext";
import CustomText from "@components/CustomText";
import DocumentPicker from 'react-native-document-picker';
import { API_BASE_URL } from "@utils/constant";
import { useNavigation } from "@react-navigation/native";

const AdminProfile: FC = () => {
  const { theme, setFullscreenLoading, setNotification } = useUI();
  const navigation = useNavigation<any>();




  const handleExcelUpload = async (excel) => {
    try {
      setFullscreenLoading(true);
      const file: any = new FormData();
      file.append("file", {
        uri: excel.uri,
        name: 'myExcel.xlsx',
        type: excel.type,
      });

      const response = await fetch(API_BASE_URL + "/api/v1/upload/excel", {
        method: "POST",
        body: file,
      });

      const data = await response.json();
      if (response.ok) {
        console.log("success", data);
        setNotification({
          title: "Upload Status",
          message: "Excel file uploaded successfully",
          duration: 2000,
          visible: true,
          success: true,
        })
        navigation.goBack();
      } else {
        console.log("error", data);
        setNotification({
          title: "Upload Status",
          message: "Failed to upload excel file",
          duration: 1800,
          visible: true,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error", error);
      setNotification({
        title: "Network request failed",
        message: "Internal server error",
        duration: 1800,
        visible: true,
        success: false,
      });
    }
    finally{
      setFullscreenLoading(false)
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.xlsx],
       allowMultiSelection: false,
       copyTo: "cachesDirectory",
      });
      console.log("result", result);
      if (result.uri) {
        handleExcelUpload(result)
      } else {
        console.log("Document picking canceled");
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        backgroundColor: THEME[theme].background,
      }}
    >
      <TouchableOpacity
        onPress={pickDocument}
        style={{
          borderRadius: 100,
          padding: 60,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: THEME[theme].primary,
        }}
      >
        <MaterialCommunityIcons
          name="file-upload"
          size={40}
          color={THEME[theme].background}
        />
      </TouchableOpacity>
      <CustomText heading="Update courses" />
    </View>
  );
};

export default AdminProfile;
