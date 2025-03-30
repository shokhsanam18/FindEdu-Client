// utils/api.js
import axios from "axios";

const API_BASE = "http://18.141.233.37:4000";

export const fetchComments = async (centerId) => {
  try {
    const response = await axios.get(`${API_BASE}/api/comments`, {
      params: { centerId }
    });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const postComment = async (commentData) => {
  try {
    const response = await axios.post(`${API_BASE}/api/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    await axios.delete(`${API_BASE}/api/comments/${commentId}`);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};