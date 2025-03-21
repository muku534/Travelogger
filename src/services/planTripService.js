import api from './Api';

export const getItineraries = async (userId) => {
    try {
        const response = await api.get(`/getItinerary/user/${userId}`);
        return response.data; // Return updated profile data
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const createItineraries = async (itineraryData) => {
    try {
        const response = await api.post('/itinerary/create', itineraryData);
        return response.data; // Return updated profile data
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const getItineraryById = async (itineraryId) => {
    try {
        const response = await api.get(`/getItinerary/${itineraryId}`);
        return response.data; // Return updated profile data
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const updateItineraryById = async (itineraryId, itineraryData) => {
    try {
        const response = await api.post(`/itinerary/update/${itineraryId}`, itineraryData);
        return response.data; // Return updated profile data
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const ShareItinerary = async (itineraryData) => {
    try {
        const response = await api.post('/email/send-itinerary', itineraryData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Somthing went wrong during share itinerary" };
    }
};

export const deleteItineraryById = async (itineraryId) => {
    try {
        const response = await api.delete(`/deleteItinerary/${itineraryId}`);
        return response.data; // Return updated profile data
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};
