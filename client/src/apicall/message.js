import axios from "axios";
const BACKEND_URL = "http://localhost:5000";
const API_URL = `${BACKEND_URL}/api/messages`;

export const NewMessage = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/createMessage`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const GetAllMessages = async (payload) => {
  try {
    const response = await axios.get(`${API_URL}/getMessages/${payload}`);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};
