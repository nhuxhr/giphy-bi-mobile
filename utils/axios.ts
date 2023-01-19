import Axios from 'axios';
import Constants from 'expo-constants';

const env = Constants?.manifest?.extras;
export const axios = Axios.create({
  baseURL: env?.GIPHY_API_ENDPOINT,
  headers: { 'Content-Type': 'application/json' },
  params: { api_key: env?.GIPHY_API_KEY },
});
