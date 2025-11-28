import axios from 'axios';

// Set baseURL from Vite env variable if provided, otherwise use relative paths
const baseURL = import.meta.env.VITE_API_URL || '';

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

export default axios;
