import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useUI } from "@context/UIContext";
import { API_BASE_URL, SYSTEM_TOKEN } from "@utils/constant";
import Search from "@components/Search";
import { THEME } from "@utils/ui";
import UniversityCard from "@components/UniversityCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";


interface University {
  cricosProviderCode: string;
  institutionName: string;
  postalAddressCity: string;
  website: string;
  institutionType:string;
}

const UniversityList: FC = () => {
  const { theme, setFullscreenLoading, setNotification } = useUI();
  const [search, setSearch] = useState("");
  const [loading,setLoading] = useState(false);
  const {setOptions} = useNavigation();
  const navigation = useNavigation()
  const [universityList, setUniversityList] = useState<University[]>([]);

  const fetchUniversityList = async (search: string) => {
    setLoading(true);
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
        console.log("fetched data success");
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
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(()=>{
    setOptions({

      headerTitle:'University List',
      headerTitleStyle:{
        fontFamily:'Medium'
      },
      headerLeft:()=>
      <TouchableOpacity onPress={()=>navigation.goBack()}>

      <MaterialCommunityIcons name="chevron-left" size={30} color={THEME[theme].primary} style={{marginLeft:10}}/>
      </TouchableOpacity>

    }
  )

  fetchUniversityList(search);

  },[]))

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

  // useEffect(() => {
  // }, []);

  const handleInputChange = (text) => {
    setSearch(text);
    debouncedFetchData(text);
  };
  return (
    <View style={{ flex: 1, padding: 16,backgroundColor:THEME[theme].background }}>
      <Search
        placeholderColor={THEME[theme].inputTextColor}
        textColor={THEME[theme].text.secondary}
        value={search}
        onSearchChange={handleInputChange} 
        backgroundColor={'white'}
        borderColor={THEME[theme].disabled}
        icon={"magnify"}
        placeholder={"Find your university"}
        iconColor={THEME[theme].text.secondary}
      />

      <FlatList
          data={universityList}
          contentContainerStyle={{flexGrow:1  }} showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <UniversityCard item={item} key={index} />
          )}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            loading ? ( 
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={THEME[theme].primary} />
              </View>
            ) : (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: THEME[theme].text.secondary, fontSize:RFValue(16) }}>
                  No universities found.
                </Text>
              </View>
            )
          }
          />
          
    </View>
  );
};

export default UniversityList;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    trendingSection: {
      marginVertical: 16,
    },
    sectionTitle: {
      fontSize: RFValue(20),
      fontWeight: "bold",
      marginBottom: 15,
    },
    courseCard: {
      width: 200,
      marginRight: 15,
      backgroundColor: "#F5F5F5",
      borderRadius: 12,
      overflow: "hidden",
    },
    courseImage: {
      width: "100%",
      height: 120,
      backgroundColor: "#DDD",
    },
    courseTitle: {
      fontSize:RFValue(16),
      fontWeight: "bold",
      padding: 10,
    },
    courseSubtitle: {
      fontSize:RFValue(14),
      color: "#666",
      paddingHorizontal: 10,
      paddingBottom: 10,
    },
    noResults: {
      textAlign: "center",
      fontSize:RFValue(16),
      color: "#666",
      marginTop: 20,
    },
  });