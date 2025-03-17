import api from './Api';

export const login = async (email, password) => {
    try {
        const response = await api.post("/user/login", { email, password });
        return response.data;  // Return user data or other relevant information
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const googleLogin = async ({ idToken }) => {
    try {
        const response = await api.post("/google", { idToken });
        return {
            status: response.status, // Extract HTTP status from headers
            ...response.data         // Spread response data
        };
    } catch (error) {
        return {
            status: error.response?.status || 500, // Get status from headers, fallback to 500
            message: error.response?.data?.message || "Something went wrong"
        };
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

export const sendOTP = async (email) => {
    try {
        const response = await api.post(`/email/send-otp?email=${email}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "somthing went wrong to send otp" };
    }
};

export const verifyOTP = async (email, OTP) => {
    try {
        const response = await api.post(`/email/verify-otp?email=${email}&otp=${OTP}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong while verifying OTP." };
    }
};

export const updatePassword = async (requestedData) => {
    try {
        const response = await api.put('/password/update', requestedData);
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