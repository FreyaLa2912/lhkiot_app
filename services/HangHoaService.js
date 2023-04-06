import axiosClient from '@interceptors/axiosClient';

const ApiName = '/hang-hoa';

export const getHangHoa = async (params) => {
  const res = await axiosClient.get(`${ApiName}/get-all`, { params: { ...params } });
  if (res) return res.data;
  else return null;
};
