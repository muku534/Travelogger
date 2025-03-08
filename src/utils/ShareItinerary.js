import Toast from "react-native-toast-message";
import { ShareItinerary } from "../services/planTripService";

export const handleShareItinerary = async (tripDetails, recipientEmail) => {
    if (!tripDetails || !tripDetails.tripDays || tripDetails.tripDays.length === 0) {
        Toast.show({
            type: "error",
            text1: "Error",
            text2: "Trip details are missing.",
        });
        return;
    }

    // Format itinerary data for API
    const itineraryData = {
        startDate: tripDetails.startDate,
        endDate: tripDetails.endDate,
        recipientEmail: recipientEmail,
        dayPlans: tripDetails.tripDays.map((day) => ({
            date: day.day, // Ensure correct format
            locations: day.items.map((item) => ({
                name: item.title || item.name,
                category: item.type || "",
                address: item.location?.address || "No Address",
            })),
        })),
    };

    console.log("Sending Itinerary:", itineraryData);

    try {
        const result = await ShareItinerary(itineraryData);
        Toast.show({
            type: "success",
            text1: "Success",
            text2: "Itinerary sent successfully!",
        });
    } catch (error) {
        Toast.show({
            type: "error",
            text1: "Error",
            text2: error.message || "Failed to send itinerary.",
        });
        console.error("Email send error:", error);
    }
};
