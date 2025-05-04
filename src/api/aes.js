import axios from 'axios';

const API_URL = 'http://localhost:8080/api/aes';

export const aesEncrypt = (key, plaintext, outputEncoding) => {
    return axios.post(`${API_URL}/encrypt`, {
        key,
        data: plaintext,
        outputEncoding
    });
};

export const aesDecrypt = (key, ciphertext, outputEncoding) => {
    return axios.post(`${API_URL}/decrypt`, {
        key,
        data: ciphertext,
        outputEncoding
    });
};