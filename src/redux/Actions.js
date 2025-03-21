// Authentication/Account Management
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const FETCH_PROFILE = 'FETCH_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const LOGOUT = 'LOGOUT';

// Temporary Itinerary Actions
export const SET_TRIP_DETAILS = 'SET_TRIP_DETAILS';
export const ADD_TRIP_DAY_ITEM = 'ADD_TRIP_DAY_ITEM';
export const CLEAR_TRIP_DETAILS = 'CLEAR_TRIP_DETAILS';
export const DELETE_TRIP_DAY_ITEM = 'DELETE_TRIP_DAY_ITEM';

//Itineraries
export const FETCH_ITINERARIES = 'FETCH_ITINERARIES';
export const DELETE_ITINERARY = "DELETE_ITINERARY";
export const CREATE_ITINERARY = "CREATE_ITINERARY";
export const UPDATE_ITINERARY = "UPDATE_ITINERARY";

// Authentication/Account Management
export const signup = (userData) => ({
    type: SIGNUP_SUCCESS,
    payload: { userData },
});

export const loginUser = (userData) => ({
    type: LOGIN_SUCCESS,
    payload: { userData },
});

export const forgotPassword = (email) => ({
    type: FORGOT_PASSWORD,
    payload: { email },
});

export const resetPassword = (token, newPassword) => ({
    type: RESET_PASSWORD,
    payload: { token, newPassword },
});

export const fetchProfile = (userData) => ({
    type: FETCH_PROFILE,
    payload: { userData }
})

export const updateProfile = (updatedData) => ({
    type: UPDATE_PROFILE,
    payload: { updatedData },
});

export const logout = () => ({
    type: LOGOUT,
});


// Temporary Itinerary Actions
export const setTripDetails = (tripDetails) => ({
    type: SET_TRIP_DETAILS,
    payload: { tripDetails },
});

export const addTripDayItem = (dayIndex, item) => ({
    type: ADD_TRIP_DAY_ITEM,
    payload: { dayIndex, item },
});

export const clearTripDetails = () => ({
    type: CLEAR_TRIP_DETAILS
})

export const deleteTripDayItem = (dayIndex, itemId) => ({
    type: DELETE_TRIP_DAY_ITEM,
    payload: { dayIndex, itemId },
});


// Itineraries

export const createItineraries = (newItinerary) => ({
    type: CREATE_ITINERARY,
    payload: { newItinerary }
})

export const getItineraries = (Itineraries) => ({
    type: FETCH_ITINERARIES,
    payload: { Itineraries }
})

export const deleteItinerary = (itineraryId) => ({
    type: DELETE_ITINERARY,
    payload: itineraryId,
});