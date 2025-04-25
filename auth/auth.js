import axios from 'axios';

const API_BASE_URL = 'http://63.250.40.59:7080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generic API call
 * @param {string} endpoint - relative path like 'customer/dashboard-data'
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method - HTTP method
 * @param {Object} [data] - data to be sent (for POST/PUT)
 * @param {Object} [customHeaders] - any additional headers
 */
export const apiCall = async (endpoint, method = 'GET', data = {}, customHeaders = {}) => {
  try {
    const headers = {
      Authorization: `Bearer ${global.authToken}`,
      ...customHeaders,
    };

    const config = {
      method,
      url: endpoint,
      headers,
    };

    if (method === 'POST' || method === 'PUT') {
      config.data = data;
    }

    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
