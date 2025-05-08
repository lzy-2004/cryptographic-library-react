import axios from 'axios';

const API_URL = 'http://localhost:8080/api/hex';

export const hexEncode = (data) => {
    return axios.post(`${API_URL}/encode`, {
        data
    });
};

export const hexDecode = (data) => {
    return axios.post(`${API_URL}/decode`, {
        data
    });
};