import { COLORS } from '../../constants';
import {
    LOGIN, SIGNUP, LOGOUT, UPDATE_PROFILE, FORGOT_PASSWORD, RESET_PASSWORD,
    FETCH_PRODUCTS, SEARCH_PRODUCTS, FILTER_PRODUCTS, FETCH_PRODUCT_DETAILS,
    RECENTLY_VIEWED, REMOVE_RECENTLY_VIEWED,
    ADD_TO_CART, FETCH_CART_DATA, REMOVE_FROM_CART, UPDATE_CART_QUANTITY,
    ADD_TO_WISHLIST, FETCH_WISHLIST_DATA, REMOVE_FROM_WISHLIST,
    PLACE_ORDER, FETCH_ORDERS, CANCEL_ORDER, TRACK_ORDER,
    SET_ERROR, CLEAR_ERROR, SET_LOADING, CLEAR_LOADING,
    SET_THEME,
    CLEAR_CART
} from './Actions';

const initialState = {
    userData: null,
    products: [],
    productDetails: null,
    searchResults: [],
    filteredProducts: [],
    recentlyViewed: [],
    cartsData: [],
    wishlistData: [],
    ordersData: [],
    theme: COLORS.light,
    loading: false,
    error: null,
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        // Authentication/Account Management
        case SIGNUP:
        case LOGIN:
            return {
                ...state,
                userData: action.payload.userData,
                error: null,
            };
        case LOGOUT:
            return {
                ...state,
                userData: null,
                cartsData: [],
                wishlistData: [],
                ordersData: [],
            };
        case UPDATE_PROFILE:
            return {
                ...state,
                userData: { ...state.userData, ...action.payload.updatedData },
            };
        case FORGOT_PASSWORD:
        case RESET_PASSWORD:
            return {
                ...state,
                error: null, // Assuming error handling can be done if needed
            };

        // Product Management
        case FETCH_PRODUCTS:
            return {
                ...state,
                products: action.payload.products,
                error: null,
            };
        case SEARCH_PRODUCTS:
            return {
                ...state,
                searchResults: action.payload.searchQuery,
                error: null,
            };
        case FILTER_PRODUCTS:
            return {
                ...state,
                filteredProducts: action.payload.filterCriteria,
                error: null,
            };
        case FETCH_PRODUCT_DETAILS:
            return {
                ...state,
                productDetails: action.payload.productId,
                error: null,
            };

        // User Activity
        case RECENTLY_VIEWED:
            return {
                ...state,
                recentlyViewed: action.payload.recentlyViewed,
                error: null,
            };
        case REMOVE_RECENTLY_VIEWED:
            return {
                ...state,
                recentlyViewed: state.recentlyViewed.filter(
                    item => item.id !== action.payload.productId
                ),
            };

        // Cart Management
        case ADD_TO_CART:
            return {
                ...state,
                cartsData: action.payload.cartsData, // Full updated cart data should be set, not just a single product
                error: null,
            };
        case FETCH_CART_DATA:
            return {
                ...state,
                cartsData: action.payload.cartsData,
                error: null,
            };
        case REMOVE_FROM_CART:
            return {
                ...state,
                cartsData: state.cartsData.filter(
                    item => item.productId !== action.payload.productId // Use productId instead of id
                ),
            };
        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                cartsData: state.cartsData.map(item =>
                    item.productId === action.payload.productId // Use productId to match
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
        case CLEAR_CART:
            return {
                ...state,
                cartsData: [],
            };

        // Wishlist Management
        case ADD_TO_WISHLIST:
            return {
                ...state,
                wishlistData: [...state.wishlistData, action.payload.product],
                error: null,
            };
        case FETCH_WISHLIST_DATA:
            return {
                ...state,
                wishlistData: action.payload.wishlistData,
                error: null,
            };
        case REMOVE_FROM_WISHLIST:
            return {
                ...state,
                wishlistData: Array.isArray(state.wishlistData)
                    ? state.wishlistData.filter(item => item.id !== action.payload.productId)
                    : [], // handle unexpected case
            };

        // Order Management
        case PLACE_ORDER:
            return {
                ...state,
                ordersData: [...state.ordersData, action.payload.order],
                error: null,
            };
        case FETCH_ORDERS:
            return {
                ...state,
                ordersData: action.payload.ordersData,
                error: null,
            };
        case CANCEL_ORDER:
            return {
                ...state,
                ordersData: state.ordersData.filter(
                    order => order.id !== action.payload.orderId
                ),
            };
        case TRACK_ORDER:
            return {
                ...state,
                // Assuming you want to store tracking data somewhere, adjust as needed
                trackingData: action.payload.trackingNumber,
                error: null,
            };

        // Error Handling
        case SET_ERROR:
            return {
                ...state,
                error: action.payload.error,
            };
        case CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };

        // General State Management
        case SET_LOADING:
            return {
                ...state,
                loading: true,
            };
        case CLEAR_LOADING:
            return {
                ...state,
                loading: false,
            };
        case SET_THEME:
            return {
                ...state,
                theme: action.payload === 'dark' ? COLORS.dark : COLORS.light,
            };
        // Default case
        default:
            return state;
    }
};

export default rootReducer;