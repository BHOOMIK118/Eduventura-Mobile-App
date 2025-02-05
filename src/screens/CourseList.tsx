import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { THEME } from '@utils/ui'
import { useUI } from '@context/UIContext'
import CustomText from '@components/CustomText'
import CourseCard from '@components/CourseCard'
import { API_BASE_URL, SYSTEM_TOKEN } from '@utils/constant'


interface Course {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
  }

  const courses: Course[] = [
    {
      id: '1',
      title: 'UI/UX Design',
      subtitle: 'Digital Marketing',
      imageUrl: 'https://via.placeholder.com/80?text=UI/UX',
    },
    {
      id: '2',
      title: 'Digital Marketing',
      subtitle: 'Business & Marketing',
      imageUrl: 'https://via.placeholder.com/80?text=Marketing',
    },
    {
      id: '3',
      title: 'Video Editing',
      subtitle: 'Content Creation',
      imageUrl: 'https://via.placeholder.com/80?text=Editing',
    },
    {
      id: '4',
      title: 'App Development',
      subtitle: 'Software Engineering',
      imageUrl: 'https://via.placeholder.com/80?text=App+Dev',
    },
  ];

  
  

const CourseList = () => {
    const {theme,setFullscreenLoading,setNotification} = useUI();
    const [courseList,setCourseList] = useState(null);


    const fetchCourseList = async ()=>{
      try {
        setFullscreenLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/getAllCourses?page=2&pageSize=10`,{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'x-jwt-assertion':SYSTEM_TOKEN
        }});
        const data = await response.json();
        if(response.ok){
          setCourseList(data.data);
          console.log('fetched successfully');
          
        }
        else{
          console.log('error',data);
          setNotification({
            title:'Fetch Status',
            message:'Failed to fetch course list',
            duration:1200,
            visible:true,
            success:false
          })
        }
      } catch (error) {
        console.error('err',error);
        setNotification({
          title:'Fetch Status',
          message:'Failed to fetch course list',
          duration:1200,
          visible:true,
          success:false
        })
        
      }
      finally{
        setFullscreenLoading(false)
      }
    }

    useEffect(()=>{
      fetchCourseList();
    },[])

  return (
    <View style={{flex:1,padding:16,backgroundColor:THEME[theme].background}}>

    <FlatList
      data={courseList}
      renderItem={({ item,index }) => <CourseCard course={item} key={index} />}
      keyExtractor={(item,index) => index.toString()}
      />
      </View>
  )
}

export default CourseList