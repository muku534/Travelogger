import { useState, useCallback } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import { GOOGLE_API_KEY } from "@env";

const usePlaceSearch = () => {
    const [destination, setDestination] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [placeImages, setPlaceImages] = useState([]);

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
                        fields: "geometry,photos",
                    },
                }
            );

            if (response.data.status === "OK") {
                const { lat, lng } = response.data.result.geometry.location;
                // Convert photo references to URLs
                const images = response.data.result.photos
                    ? response.data.result.photos.map(photo =>
                        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
                    )
                    : []; // If no images, return an empty array

                setPlaceImages(images)
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
        placeImages,
        handleDestinationChange,
        handlePlaceSelect,
    };
};

export default usePlaceSearch;
