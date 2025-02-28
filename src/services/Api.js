import axios from 'axios';

const API_BASE_URL = 'http://localhost:5051/api/user'; // Base URL for API

export const signUp = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/signup`, userData, {
            headers: {
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Origin': 'http://127.0.0.1:5173',
                'Referer': 'http://127.0.0.1:5173/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
                'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Something went wrong' };
    }
};
