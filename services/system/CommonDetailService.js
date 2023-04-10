import axiosClient from '@interceptors/axiosClient';

const apiName = '/commondetail';

export const getAllByMasterCode = async (params) => {
  const res = await axiosClient.get(`${apiName}/getall-by-masterCode`, {
    params: { ...params },
  });
  if (res) return res.data;
  else return null;
};
