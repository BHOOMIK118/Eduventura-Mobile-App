import { View, Text, TouchableOpacity } from "react-native";
import React, { FC, ReactNode } from "react";
import CustomText from "./CustomText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useCustomBottomSheet } from "@context/CustomBottomSheetProvider";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import WheelPicker from "@quidone/react-native-wheel-picker";
import WheelPickerFeedback from "@quidone/react-native-wheel-picker-feedback";

interface CustomDropdownProps {
  label: string; 
  value?: any; 
  required?: boolean;
  data: { label: string; value: string }[]; 
  onChange: React.Dispatch<React.SetStateAction<any>>; 
}

const CustomDropdown: FC<CustomDropdownProps> = ({
  label,
  value,
  required,
  onChange,
  data,
}) => {
  const { showBottomSheet, hideBottomSheet } = useCustomBottomSheet();


  return (
    <>
      {required && (
        <CustomText
          subHeading="*"
          subHeadingColor="red"
          style={{
            alignSelf: "flex-end",
            top: 10,
            right: 8,
            fontSize: RFValue(16),
          }}
        />
      )}
      <TouchableOpacity
        onPress={() =>
          showBottomSheet(
            <BottomSheetView>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginHorizontal: 12,
                  zIndex: 300,
                }}
                onPress={hideBottomSheet}
              >
                <CustomText heading="Done" headingFontSize={RFValue(16)} />
              </TouchableOpacity>
              <WheelPicker
                data={data}
                value={value}
                onValueChanged={({ item: { value } }) => {
                  WheelPickerFeedback.triggerSoundAndImpact();
                  onChange(value);
                }}
                itemTextStyle={{ fontFamily: "Regular" }}
              />
            </BottomSheetView>
          )
        }
        style={{
          borderRadius: 12,
          borderColor: "#ddd",
          borderWidth: 1,
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ gap: 4 }}>
          <CustomText subHeading={label} subHeadingColor="gray" />
          <CustomText subHeading={value} />
        </View>
        <MaterialCommunityIcons name="chevron-down" size={24} color="#ccc" />
      </TouchableOpacity>
    </>
  );
};

export default CustomDropdown;
