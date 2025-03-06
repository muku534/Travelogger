import api from './Api';

export const login = async (email, password) => {
    try {
        const response = await api.post("/user/login", { email, password });

        return response.data;  // Return user data or other relevant information
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const googleLogin = async (userData) => {
    try {
        const response = await api.post("/google", userData);

        return response.data;  // Return user data or other relevant information
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};

// Similar logic for signUp
export const signUp = async (userData) => {
    try {
        const response = await api.post("/user/signup", userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const getProfile = async (userId) => {
    try {
        const response = await api.get(`/getProfile/${userId}`); // Added `/` before userId
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const updateProfile = async (userId, updatedData) => {
    try {
        const response = await api.post(`/createProfile/${userId}`, updatedData);
        return response.data; // Return updated profile data
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};


export const deleteAccount = async (userId) => {
    try {
        const response = await api.delete(`/user/hard/delete/${userId}`);
        return response.data; // Return updated profile data
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};