import api from './axiosConfig';

export const getDashboardData = () => api.get('/dashboard');