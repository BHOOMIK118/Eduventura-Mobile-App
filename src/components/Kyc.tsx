// import { StyleSheet, Text, View } from 'react-native'
// import React, { useState } from 'react'

// const KYC = () => {

//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [fromDate, setFromDate] = useState(""); // To store the "From" date
//   const [toDate, setToDate] = useState(""); // To store the "To" date
//   const [showFromDatePicker, setShowFromDatePicker] = useState(false); // To control the visibility of the "From" date picker
//   const [showToDatePicker, setShowToDatePicker] = useState(false);


//     const [dependentsOptions] = useState([
//         { label: "Yes", value: "Yes" },
//         { label: "No", value: "No" },
//       ]);
//       const [dependentsOpen, setDependentOpen] = useState(false);

//       const [visaOpen, setVisaOpen] = useState(false);
//   const [visaOptions] = useState([
//     { label: "Yes", value: true },
//     { label: "No", value: false },
//   ]);
//   const [disqualificationOpen, setdisqualificationOpen] = useState(false);
//   const [disqualificationOptions] = useState([
//     { label: "Yes", value: true },
//     { label: "No", value: false },
//   ]);
//   const [degreeOpen, setDegreeOpen] = useState(false);
//   const [degreeOptions] = useState([
//     { label: "Bachelors", value: "BACHELOR" },
//     { label: "Masters", value: "MASTERS" },
//   ]);

//   const [workExperience, setWorkExperience] = useState([
//     {
//       workplaceName: "",
//       from: "",
//       to: "",
//       jobProfile: "",
//     },
//   ]);

//   const addWorkExperience = () => {
//     setWorkExperience([
//       ...workExperience,
//       {
//         workplaceName: "",
//         from: "",
//         to: "",
//         jobProfile: "",
//       },
//     ]);
//   };

//   const removeWorkExperience = (index) => {
//     const updatedExperience = workExperience.filter((_, i) => i !== index);
//     setWorkExperience(updatedExperience);
//   };

//   const handleFromDateChange = (event: any, selectedDate: Date | undefined) => {
//     const currentDate = selectedDate || new Date();
//     setShowFromDatePicker(false);
//     setFromDate(formatDate(currentDate)); // Set the formatted "From" date
//   };

//   const handleToDateChange = (event: any, selectedDate: Date | undefined) => {
//     const currentDate = selectedDate || new Date();
//     setShowToDatePicker(false);
//     setToDate(formatDate(currentDate)); // Set the formatted "To" date
//   };

//   const handleChangeWork = (index, key, value) => {
//     const updatedExperience = [...workExperience];
//     updatedExperience[index][key] = value;
//     setWorkExperience(updatedExperience);
//   };

//   const [languageProficiency, setLanguageProficiency] = useState([
//     {
//       testName: "",
//       dateOfTest: "",
//       individualBand: "",
//       overallBand: "",
//     },
//   ]);

//   const [showLanguageDatePicker, setShowLanguageDatePicker] = useState(false);
//   const [currentLanguageIndex, setCurrentLanguageIndex] = useState<
//     number | null
//   >(null);
//   const [currentIndex, setCurrentIndex] = useState<number | null>(null);
//   const handleLanguageDateChange = (
//     event: any,
//     selectedDate: Date | undefined
//   ) => {
//     const currentDate = selectedDate || new Date();
//     if (currentLanguageIndex !== null) {
//       const updatedProficiency = [...languageProficiency];
//       updatedProficiency[currentLanguageIndex].dateOfTest =
//         currentDate.toLocaleDateString();
//       setLanguageProficiency(updatedProficiency);
//     }
//     setShowLanguageDatePicker(false);
//   };

//   const handleLanguageInputChange = (
//     value: string,
//     field: string,
//     index: number
//   ) => {
//     const updatedProficiency = [...languageProficiency];
//     updatedProficiency[index][field] = value;
//     setLanguageProficiency(updatedProficiency);
//   };

//   const addLanguageTest = () => {
//     setLanguageProficiency([
//       ...languageProficiency,
//       {
//         testName: "",
//         dateOfTest: "",
//         individualBand: "",
//         overallBand: "",
//       },
//     ]);
//   };

//   const [educationHistory, setEducationHistory] = useState([
//     {
//       certification: "",
//       degree: "MASTERS",
//       percentage: "",
//       yearOfPassing: "",
//       majorSubjects: "",
//       backlogs: 0,
//     },
//   ]);

//   const addEducation = () => {
//     setEducationHistory([
//       ...educationHistory,
//       {
//         certification: "",
//         degree: "",
//         percentage: "",
//         yearOfPassing: "",
//         majorSubjects: "",
//         backlogs: 0,
//       },
//     ]);
//   };

//   const removeEducation = (index) => {
//     const updatedHistory = educationHistory.filter((_, i) => i !== index);
//     setEducationHistory(updatedHistory);
//   };

//   const handleChangeEducation = (index, key, value) => {
//     const updatedHistory = [...educationHistory];
//     updatedHistory[index][key] = value;
//     setEducationHistory(updatedHistory);
//   };
//   const handleDateChange = (event: any, selectedDate: Date | undefined) => {
//     const currentDate = selectedDate || new Date();
//     setShowDatePicker(false);
//     setDate(formatDate(currentDate)); // Set the formatted date in the state
//   };

//   const formatDate = (date: Date) => {
//     return date.toLocaleDateString();
//   };
    
//   return (
//     <View>
//       <Text>Kyc</Text>
//     </View>
//   )
// }

// export default KYC

// const styles = StyleSheet.create({})