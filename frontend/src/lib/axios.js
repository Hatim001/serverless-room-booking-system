import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const GET = (url, config) => instance.get(url, config);

const POST = (url, data, config) => instance.post(url, data, config);

const PUT = (url, data, config) => instance.put(url, data, config);

const DELETE = (url, config) => instance.delete(url, config);

export { instance as axios, GET, POST, PUT, DELETE };
