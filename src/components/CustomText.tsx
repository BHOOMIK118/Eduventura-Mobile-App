import React from "react";
import { Text, View, TextStyle, ViewStyle, TextInputProps, StyleSheet } from "react-native";
import {RFValue} from 'react-native-responsive-fontsize'

interface CustomTextProps {
  heading?: string;
  subHeading?: string;
  headingColor?: string;
  subHeadingColor?: string;
  headingFontSize?: number;
  subHeadingFontSize?: number;
  headingFontFamily?: string;
  subHeadingFontFamily?: string;
  headingFontWeight?: TextStyle["fontWeight"];
  subHeadingFontWeight?: TextStyle["fontWeight"];
  style?: ViewStyle | TextStyle | TextInputProps;
  
}

const CustomText: React.FC<CustomTextProps &TextInputProps> = ({
  style = {},
  heading,
  subHeading,
  headingColor = "#000",
  subHeadingColor = "#000",
  headingFontSize = RFValue(20),
  subHeadingFontSize = RFValue(14),
  headingFontFamily = "Medium",
  subHeadingFontFamily = "Regular",
  headingFontWeight,
  subHeadingFontWeight,
  ...rest
}) => {
  return (
    <View>
      {heading && (
        <View style={{ justifyContent: "center", alignItems: "flex-start" }}>
          <Text
            style={[{

              fontFamily: headingFontFamily,
              fontSize: headingFontSize,
              color: headingColor,
              fontWeight: headingFontWeight,
            },
            ...(Array.isArray(style) ? style : [style]),
            ]
          }
          {...rest}
          >
            {heading}
          </Text>
        </View>
      )}
      {subHeading && (
        <View style={{ justifyContent: "center", alignItems: "flex-start" }}>
          <Text
            style={[{
              fontFamily: subHeadingFontFamily,
              fontSize: subHeadingFontSize,
              color: subHeadingColor,
              fontWeight: subHeadingFontWeight,
            },
            ...(Array.isArray(style) ? style : [style]),
          ]}
          {...rest}
          >
            {subHeading}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CustomText;
