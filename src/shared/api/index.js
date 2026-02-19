// utils/apiUtils.js
import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import refreshToken from './refreshToken';

export async function makeApiRequest(method, data) {
  const token = getCookie('accessToken');
  const endpoint =
    'https://mkrmb7pkpi.execute-api.us-east-1.amazonaws.com/dev/va';
  try {
    const response = await axios({
      url: endpoint,
      method: method,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (
      error.response?.status === 401 ||
      error.message === 'Unauthorized' ||
      error.message === 'Request failed with status code 401'
    ) {
      try {
        const newToken = await refreshToken();
        const retryResponse = await axios({
          url: endpoint,
          method: method,
          data: data,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`
          }
        });
        return retryResponse.data;
      } catch (retryError) {
        throw retryError;
      }
    }
    throw error;
  }
}
