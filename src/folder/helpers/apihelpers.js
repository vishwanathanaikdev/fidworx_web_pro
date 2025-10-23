import axios from 'axios';
import {store} from '../redux/store'



const token = store.getState()?.Auth?.access;

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
   },
});

const instance1 = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
}); 

const publicInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
        },
});

instance.interceptors.request.use(function (config) {
    const token = store.getState()?.Auth?.token;
    config.headers['Content-Type'] = 'application/json';
    config.headers.Authorization =  `Bearer ${token}`;
    
    return config;
});

instance1.interceptors.request.use(function (config) {
    const token = store.getState()?.Auth?.token;
    config.headers['Content-Type'] = 'multipart/form-data';
    config.headers.Authorization =  `Bearer ${token}`;
    
    return config;
});

export const get = async (uri) => {
    const response = await instance.get(uri);
    return response;
}

export const post = async (uri, data) => {
    const response = await instance.post(uri, data);
    return response;
}

export const postfd = async (uri, data) => {
    const response = await instance1.post(uri, data);
    return response;
}

export const put = async (uri, data) => {
    const response = await instance.put(uri, data);
    return response;
}

export const deleteRequest = async (uri) => {
    const response = await instance.delete(uri);
    return response;
}

export const publicPost = (uri, data) => {
    return publicInstance.post(uri, data);
}


