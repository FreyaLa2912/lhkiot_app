import axiosClient from '@interceptors/axiosClient';

const COMMON_MASTER = '/commonmaster';

export const getAll = async () => {
  const res = await axiosClient.get(`${COMMON_MASTER}/get-all`);
  if (res) return res.data;
  else return null;
};
