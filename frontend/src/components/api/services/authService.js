// src/api/services/authService.js
import axiosClient from '../axios';

export const authService = {
  login: (data) => axiosClient.post('/user/login', data),
  register: (data) => axiosClient.post('/user/register', data),
  verifyOTP: (data) => axiosClient.post('/user/verify-otp', data),
  forgotPassword: (data) => axiosClient.post('/user/forgot-password', data),
  changePassword: (data) => axiosClient.post('/user/change-password', data),
};