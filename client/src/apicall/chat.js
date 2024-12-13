import axios from "axios";
const BACKEND_URL = "http://localhost:5000";
const API_URL = `${BACKEND_URL}/api/chats`;

export const CreateNewChat = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/createChat`, payload);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const GetAllChats = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const ClearUnreadMessage = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/clearUnreadMsg/${payload}`);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};
