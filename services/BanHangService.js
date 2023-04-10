import axiosClient from '@interceptors/axiosClient';
import { ToastAndroid } from 'react-native';

const ApiName = '/ban-hang';
export const createBanHang = async (params) => {
  try {
    const result = await axiosClient.post(`${ApiName}/create-ban-hang`, params);
    return result.data;
  } catch (error) {
    ToastAndroid.show('Lỗi bán hàng', ToastAndroid.LONG);
  }
};

export const getBanHang = async (params) => {
  try {
    const result = await axiosClient.get(`${ApiName}/get-all`, {
      params,
    });
    return result.data;
  } catch (error) {
    ToastAndroid.show('Lỗi lấy danh sách hóa đơn', ToastAndroid.LONG);
  }
};
