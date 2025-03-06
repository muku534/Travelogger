import api from './Api';

export const createAIItineraries = async (itineraryData) => {
    try {
        const response = await api.post('/ai-itiernary/generate', itineraryData);
        return response.data; // Return updated profile data
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};