import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import UniversityCard from '@components/UniversityCard';
import { THEME } from '@utils/ui';
import Search from '@components/Search';
import { API_BASE_URL, SYSTEM_TOKEN } from '@utils/constant';
import { useUI } from '@context/UIContext';
import { prettier } from '@utils/helpers';
import { RFValue } from 'react-native-responsive-fontsize';

interface University {
  cricosProviderCode: string;
  institutionName: string;
  postalAddressCity: string;
  website: string;
  institutionType:string;
}

const University = () => {
  const { theme, setFullscreenLoading, setNotification } = useUI();
  const [loading,setLoading] = useState(false)
  const [search, setSearch] = useState("");
  const [pageNo,setPageNo] = useState(1);
  const [hasMore,setHasMore] = useState(true);
  const [universityList, setUniversityList] = useState<University[]>([]);
  

  const fetchUniversityList = async (search: string,pageNo:Number) => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/api/v1/getInstitution${
        search !== ""
          ? `?institutionName=${encodeURIComponent(search)}&page=${pageNo}&pageSize=10`
          : `?page=${pageNo}&pageSize=10`
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
        console.log("fetched data success",pageNo);
        setUniversityList((prev) => (pageNo === 1 ? data.data : [...prev, ...data.data]));
        setHasMore(data.data.length > 0);
        // setUniversityList(data.data);
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

  // const debounce = (func, delay) => {
  //   let timeout;
  //   return (...args) => {
  //     clearTimeout(timeout);
  //     timeout = setTimeout(() => func(...args), delay);
  //   };
  // };

  const debounce = (func: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // const debouncedFetchData = useCallback(
  //   debounce(()=>fetchUniversityList(search,0), 300),
  //   []
  // );

  const debouncedFetchData = useCallback(
    debounce((searchText: string) => {
      setPageNo(1); // Reset page number on new search
      fetchUniversityList(searchText, 1);
    }, 300),
    []
  );

  useEffect(() => {
    fetchUniversityList(search,pageNo);
  }, [pageNo]);


  const loadMore = () => {
    if (!loading && hasMore) {
      setPageNo((prev) => prev + 1);
    }
  };

  const handleInputChange = (text) => {
    setSearch(text);
    debouncedFetchData(text);
  };
  return (
    <View style={{ flex: 1, padding: 16,backgroundColor:THEME[theme].background,gap:16 }}>
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
          contentContainerStyle={{ flexGrow:1,gap:16,paddingLeft:16 }} showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <UniversityCard item={item} key={index} height={200}/>
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
          onEndReachedThreshold={0.7}
          onEndReached={loadMore}
          />
    </View>
  );
}

export default University