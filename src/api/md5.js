import axios from 'axios';

const API_URL = 'http://localhost:8080/api/md5';

export const md5Hash = (data, encoding) => {
    return axios.post(`${API_URL}/hash`, {
        data,
        encoding
    });
};