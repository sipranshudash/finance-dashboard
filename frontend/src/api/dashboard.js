import axiosInstance from './axiosInstance'

export const getFullDashboardAPI = () =>
  axiosInstance.get('/dashboard/full/')

export const getRecentActivityAPI = () =>
  axiosInstance.get('/dashboard/recent/')