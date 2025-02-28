// Authentication/Account Management
export const LOGIN = 'LOGIN';
export const SIGNUP = 'SIGNUP';
export const LOGOUT = 'LOGOUT';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const RESET_PASSWORD = 'RESET_PASSWORD';

// Product Management
export const FETCH_PRODUCTS = 'FETCH_PRODUCTS';
export const SEARCH_PRODUCTS = 'SEARCH_PRODUCTS';
export const FILTER_PRODUCTS = 'FILTER_PRODUCTS';
export const FETCH_PRODUCT_DETAILS = 'FETCH_PRODUCT_DETAILS';

// User Activity
export const RECENTLY_VIEWED = 'RECENTLY_VIEWED';
export const REMOVE_RECENTLY_VIEWED = 'REMOVE_RECENTLY_VIEWED';

// Cart Management
export const ADD_TO_CART = 'ADD_TO_CART';
export const FETCH_CART_DATA = 'FETCH_CART_DATA';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY';
export const CLEAR_CART = 'CLEAR_CART';

// Wishlist Management
export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
export const FETCH_WISHLIST_DATA = 'FETCH_WISHLIST_DATA';
export const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST';

// Order Management
export const PLACE_ORDER = 'PLACE_ORDER';
export const FETCH_ORDERS = 'FETCH_ORDERS';
export const CANCEL_ORDER = 'CANCEL_ORDER';
export const TRACK_ORDER = 'TRACK_ORDER';

// Error Handling
export const SET_ERROR = 'SET_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

// General State Management
export const SET_LOADING = 'SET_LOADING';
export const CLEAR_LOADING = 'CLEAR_LOADING';

export const SET_THEME = 'SET_THEME';

// Authentication/Account Management
export const signup = (userData) => ({
    type: SIGNUP,
    payload: { userData },
});

export const loginUser = (userData) => ({
    type: LOGIN,
    payload: { userData },
});

export const logout = () => ({
    type: LOGOUT,
});

export const updateProfile = (updatedData) => ({
    type: UPDATE_PROFILE,
    payload: { updatedData },
});

export const forgotPassword = (email) => ({
    type: FORGOT_PASSWORD,
    payload: { email },
});

export const resetPassword = (token, newPassword) => ({
    type: RESET_PASSWORD,
    payload: { token, newPassword },
});

// Product Management
export const fetchProducts = (products) => ({
    type: FETCH_PRODUCTS,
    payload: { products },
});

export const searchProducts = (searchQuery) => ({
    type: SEARCH_PRODUCTS,
    payload: { searchQuery },
});

export const filterProducts = (filterCriteria) => ({
    type: FILTER_PRODUCTS,
    payload: { filterCriteria },
});

export const fetchProductDetails = (productId) => ({
    type: FETCH_PRODUCT_DETAILS,
    payload: { productId },
});

// User Activity
export const fetchRecentView = (recentlyViewed) => ({
    type: RECENTLY_VIEWED,
    payload: { recentlyViewed },
});

export const removeRecentlyViewed = (productId) => ({
    type: REMOVE_RECENTLY_VIEWED,
    payload: { productId },
});

// Cart Management
export const addToCart = (cartsData) => ({
    type: ADD_TO_CART,
    payload: { cartsData }, // Send the entire updated cart data
});

export const fetchCartsData = (cartsData) => ({
    type: FETCH_CART_DATA,
    payload: { cartsData },
});

export const removeFromCart = (productId) => ({
    type: REMOVE_FROM_CART,
    payload: { productId },
});

export const updateCartQuantity = (productId, quantity) => ({
    type: UPDATE_CART_QUANTITY,
    payload: { productId, quantity },
});

export const clearCart = () => ({
    type: CLEAR_CART,
});

// Wishlist Management
export const addToWishlist = (product) => ({
    type: ADD_TO_WISHLIST,
    payload: { product },
});

export const fetchWishlistData = (wishlistData) => ({
    type: FETCH_WISHLIST_DATA,
    payload: { wishlistData },
});

export const removeFromWishlist = (productId) => ({
    type: REMOVE_FROM_WISHLIST,
    payload: { productId },
});

// Order Management
export const placeOrder = (order) => ({
    type: PLACE_ORDER,
    payload: { order },
});

export const fetchOrders = (ordersData) => ({
    type: FETCH_ORDERS,
    payload: { ordersData },
});

export const cancelOrder = (orderId) => ({
    type: CANCEL_ORDER,
    payload: { orderId },
});

export const trackOrder = (trackingNumber) => ({
    type: TRACK_ORDER,
    payload: { trackingNumber },
});

// Error Handling
export const setError = (error) => ({
    type: SET_ERROR,
    payload: { error },
});

export const clearError = () => ({
    type: CLEAR_ERROR,
});

// General State Management
export const setLoading = () => ({
    type: SET_LOADING,
});

export const clearLoading = () => ({
    type: CLEAR_LOADING,
});

export const setTheme = (theme) => ({
    type: SET_THEME,
    payload: theme,
});