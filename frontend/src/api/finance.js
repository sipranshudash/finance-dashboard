import axiosInstance from './axiosInstance'

export const getTransactionsAPI = (params) =>
  axiosInstance.get('/transactions/', { params })

export const createTransactionAPI = (data) =>
  axiosInstance.post('/transactions/', data)

export const updateTransactionAPI = (id, data) =>
  axiosInstance.patch(`/transactions/${id}/`, data)

export const deleteTransactionAPI = (id) =>
  axiosInstance.delete(`/transactions/${id}/`)