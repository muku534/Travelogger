import { SIGNUP_SUCCESS, LOGIN_SUCCESS, LOGOUT, UPDATE_PROFILE, FORGOT_PASSWORD, RESET_PASSWORD, FETCH_PROFILE, FETCH_ITINERARIES, DELETE_ITINERARY, CREATE_ITINERARY, SET_TRIP_DETAILS, ADD_TRIP_DAY_ITEM, DELETE_TRIP_DAY_ITEM, CLEAR_TRIP_DETAILS, } from './Actions'


const initialState = {
    userData: null,
    tripDetails: {
        destination: '',
        startDate: null,
        endDate: null,
        selectedLocation: [],
        tripDays: [],
    },
    Itineraries: [],

};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        // Authentication/Account Management
        case SIGNUP_SUCCESS:
        case LOGIN_SUCCESS:
            return {
                ...state,
                userData: action.payload.userData,
                error: null,
            };
        case FORGOT_PASSWORD:
        case RESET_PASSWORD:
            return {
                ...state,
                error: null, // Assuming error handling can be done if needed
            };
        case FETCH_PROFILE:
            return {
                ...state,
                userData: { ...state.userData, ...action.payload.userData }
            }
        case UPDATE_PROFILE:
            return {
                ...state,
                userData: { ...state.userData, ...action.payload.updatedData },
            };
        case LOGOUT:
            return {
                ...state,
                userData: null,
                Itineraries: [],
            };

        // 🔹 Temporary Itinerary Handling
        case SET_TRIP_DETAILS:
            return {
                ...state,
                tripDetails: {
                    ...state.tripDetails, // ✅ Preserve existing details
                    ...action.payload.tripDetails, // ✅ Update details with payload
                },
            };


        case ADD_TRIP_DAY_ITEM:
            return {
                ...state,
                tripDetails: {
                    ...state.tripDetails,
                    tripDays: state.tripDetails.tripDays.map((day, index) =>
                        index === action.payload.dayIndex
                            ? { ...day, items: [...day.items, action.payload.item] } // ✅ Properly update items immutably
                            : day
                    ),
                },
            };

        case CLEAR_TRIP_DETAILS:
            return {
                ...state,
                tripDetails: initialState.tripDetails, // Reset tripDetails to initial state
            };


        // 🔹 Itineraries Handling
        case CREATE_ITINERARY:
            return {
                ...state,
                Itineraries: [...state.Itineraries, action.payload.Itinerary], // ✅ Add new itinerary
            };
        case FETCH_ITINERARIES:
            return {
                ...state,
                Itineraries: Array.isArray(action.payload.Itineraries)
                    ? action.payload.Itineraries
                    : [],
            };
        case DELETE_ITINERARY:
            return {
                ...state,
                Itineraries: state.Itineraries.filter(itinerary => itinerary.id !== action.payload),
            };
        default:
            return state;
    }
};

export default rootReducer;