import axios from "axios";
const BACKEND_URL = "http://localhost:5000";
const API_URL = `${BACKEND_URL}/api/users`;

export const RegisterUser = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/register`, payload);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const LoginUser = async (payload) => {
  console.log(payload);
  try {
    const response = await axios.post(`${API_URL}/login`, payload);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const GetUser = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const CheckLoginStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/loginStatus`);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const GetUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/getUsers`);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const UpdateProfilePic = async (payload) => {
  try {
    const response = await axios.patch(`${API_URL}/update-pic`, payload);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const UpdateUser = async (payload) => {
  try {
    const response = await axios.patch(`${API_URL}/updateUser`, payload);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const ChangePassword = async (payload) => {
  try {
    const response = await axios.patch(`${API_URL}/changePass`, payload);
    console.log("call api", response.data);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const Logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};
