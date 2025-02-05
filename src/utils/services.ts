import { API_BASE_URL } from "./constant";
import * as SecureStore from "expo-secure-store";
import { prettier } from "./helpers";

export const getUserProfileAPI = async (token: string) => {
  try {
    const req = await fetch(API_BASE_URL + "/api/v1/auth/getProfile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (req.ok) {
      const res = await req.json();
      if (res) {
        return res;
      } else {
        return null;
      }
    }
  } catch (e) {
    return null;
  }
};

export const getKycDetails = async (token, userId) => {
  
  try {
    const req = await fetch(
      API_BASE_URL + `/api/v1/getKycDetails?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      }
    );
    const res = await req.json();
    
    if(req.ok){
      if(res){
        return res;
      }
      else{
        return null;
      }
    }
  } catch (error) {
    console.error('Error',error);
    return null;
    
  }
};
