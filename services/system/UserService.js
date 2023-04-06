import axiosClient from '@interceptors/axiosClient';

const USER = '/user';

// export const getAll = async () => {
//   const res = await axiosClient.get(`${USER}/get-all`);
//   if (res) return res.data;
//   else return null;
// };

export const changePassword = async (params) => {
  try {
    const res = await axiosClient.put(`${USER}/change-userpassword`, { ...params });
    if (res) {
      return res.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
