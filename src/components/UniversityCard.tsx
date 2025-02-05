import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { FC } from "react";
import CustomText from "./CustomText";
import { useNavigation } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";


// Define the prop types for UniversityCard
interface University {
  cricosProviderCode: string;
  institutionName: string;
  postalAddressCity: string;
  website: string;
  image:string;
  postalAddressState:string;
}

interface UniversityCardProps {
  university: University;
}

const UniversityCard: FC<{ item: University,width?:any,height?:any }> = ({ item,width,height }) => {
  const {navigate} = useNavigation<any>();
  return (
    <TouchableOpacity style={[styles.courseCard,{width:width}]} onPress={()=>navigate('UNIVERSITYDETAILS',{universityDetails:item})}>
        <Image
          source={{
            uri: item?.image,
          }}
        // source={require('@assets/images/university.jpg')}
          style={[styles.courseImage,{height:height}]}
          resizeMode='stretch'
        />
        <CustomText style={styles.courseTitle} heading={item?.institutionName}/>
        <View style={{flexDirection:'row',alignItems:'center',gap:4,paddingHorizontal:10}}>

        <CustomText style={styles.courseSubtitle}
          subHeading={item?.postalAddressCity+','}
          />
        <CustomText style={styles.courseSubtitle}
          subHeading={item?.postalAddressState}
          />
          </View>
          <View style={{paddingHorizontal:10}}>

        <CustomText style={styles.courseSubtitle} subHeading={item?.website}/>
          </View>
      </TouchableOpacity>
  );
};

export default UniversityCard;


  const styles = StyleSheet.create({
    courseCard: {
      
        marginRight: 15,
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        overflow: "hidden",
      },
      courseSubtitle: {
        fontSize:RFValue(12),
        color: "#666",
        // paddingHorizontal: 10,
        paddingBottom: 10,
      },
      courseTitle: {
        fontSize:RFValue(14),
        padding: 10,
      },
      courseImage: {
        width: "100%",
        backgroundColor: "#DDD",
      },
})

