import { useState, useCallback } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import { GOOGLE_API_KEY } from "@env";

const usePlaceSearch = () => {
    const [destination, setDestination] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Fetch Place Suggestions from Google Places API
    const fetchPlaces = async (input) => {
        if (!input.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
                {
                    params: {
                        input,
                        key: GOOGLE_API_KEY,
                        language: "en",
                    },
                }
            );

            if (response.data.status === "OK") {
                setSuggestions(response.data.predictions);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            console.error("Error fetching places:", error);
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Optimize API Calls with Debounce
    const debouncedFetchPlaces = useCallback(debounce(fetchPlaces, 500), []);

    // Handle Destination Input Change
    const handleDestinationChange = (text) => {
        setDestination(text);
        debouncedFetchPlaces(text);
    };

    // Handle Place Selection
    const handlePlaceSelect = async (place) => {
        setDestination(place.description);
        setSuggestions([]);
        setShowSuggestions(false);

        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/details/json`,
                {
                    params: {
                        place_id: place.place_id,
                        key: GOOGLE_API_KEY,
                    },
                }
            );

            if (response.data.status === "OK") {
                const { lat, lng } = response.data.result.geometry.location;
                setSelectedLocation([lat, lng]);
            }
        } catch (error) {
            console.error("Error fetching place details:", error);
        }
    };

    return {
        destination,
        suggestions,
        showSuggestions,
        selectedLocation,
        handleDestinationChange,
        handlePlaceSelect,
    };
};

export default usePlaceSearch;
