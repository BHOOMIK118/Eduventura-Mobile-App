import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { useUI } from '@context/UIContext';
import { API_BASE_URL, SYSTEM_TOKEN } from '@utils/constant';
import CustomText from './CustomText';
import UniversityCard from './UniversityCard';
import { RFValue } from "react-native-responsive-fontsize";
import { prettier } from '@utils/helpers';


interface University {
  cricosProviderCode: string;
  institutionName: string;
  postalAddressCity: string;
  website: string;
  image:string;
  postalAddressState:string;
}

const PopularUniversities:FC = () => {
  const [universityList, setUniversityList] = useState<University[]>([]);
  const { theme, setNotification, setFullscreenLoading } = useUI();
  const [search, setSearch] = useState("");

  

    const fetchUniversityList = async (search) => {
        setFullscreenLoading(true);
        try {
          const url = `${API_BASE_URL}/api/v1/getInstitution${
            search !== ""
              ? `?institutionName=${encodeURIComponent(search)}&page=1&pageSize=5`
              : ""
          }`;
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "content-type": "application/json",
              "x-jwt-assertion": SYSTEM_TOKEN,
            },
          });
    
          const data = await response.json();
          if (response.ok) {
            // prettier("fetched data success",data.data);
            setUniversityList(data.data);
          } else {
            console.log("error", data);
            setNotification({
              title: "University Fetching",
              message: "Failed to fetch university list",
              duration : 1800,
              visible: true,
              success: false,
            });
          }
        } catch (error) {
          console.log("err", error);
          setNotification({
            title: "University Fetching",
            message: "Failed to fetch university list",
            duration : 1800,
            visible: true,
            success: false,
          });
        } finally {
          setFullscreenLoading(false);
        }
      };

      useEffect(()=>{
    fetchUniversityList(search);

      },[])

      const handleInputChange = (text) => {
        setSearch(text);
        debouncedFetchData(text);
      };

      const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => func(...args), delay);
        };
      };
    
      const debouncedFetchData = useCallback(
        debounce(fetchUniversityList, 300),
        []
      );
  return (
    <FlatList
    data={universityList}
    keyExtractor={(item) => item.cricosProviderCode}
    renderItem={({ item }) => (
      <UniversityCard item={item} width={200} height={120}/>
    )}
    horizontal
    showsHorizontalScrollIndicator={false}
  />

  )
}

export default PopularUniversities

const styles = StyleSheet.create({
    courseCard: {
        width: 200,
        marginRight: 15,
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        overflow: "hidden",
      },
      courseSubtitle: {
        fontSize:RFValue(14),
        color: "#666",
        paddingHorizontal: 10,
        paddingBottom: 10,
      },
      courseTitle: {
        fontSize:RFValue(16),
        padding: 10,
      },
      courseImage: {
        width: "100%",
        height: 120,
        backgroundColor: "#DDD",
      },
})