import axios from 'axios';
// import dayjs from 'dayjs';
// import jwt_decode from 'jwt-decode';

let failedQueue = [];
let isRefreshing = false;

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

const createAxiosClient = ({
  options, //the options that are passed to the axios instance, example: baseUrl, timeout etc.
  getCurrentAccessToken, //a function that provides the accessToken from the store.
  getCurrentRefreshToken, //a function that provides the refreshToken from the store.
  refreshTokenUrl, //the url endpoint that should be called when the access token is expired.
  logout, //a function that performs the logout logic when the refreshToken called failed( ex: cleanup storage / redirect to /login)
  setNewTokens, //a function that sets the tokens in store/localStorage.
  removeAllTokens, //a function that remove all tokens in store/localStorage.
  setAccessToken, //a function that sets the access token in store/localStorage.
  setRefreshToken, //a function that sets the refresh token in store/localStorage.
}) => {
  const client = axios.create(options);

  client.interceptors.request.use(
    (request) => {
      if (request.authorization !== false && request.url !== refreshTokenUrl) {
        const token = getCurrentAccessToken();
        if (token) {
          request.headers.Authorization = 'Bearer ' + token;
        }
      }
      return request;
    },
    (error) => {
      console.log('err: ', error);
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    async (response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      const originalRequest = response.config;
      originalRequest.headers = JSON.parse(JSON.stringify(originalRequest.headers || {}));

      const refreshToken = getCurrentRefreshToken();
      const accessToken = getCurrentAccessToken();

      // If error, process all the requests in the queue and logout the user.
      const handleError = (error) => {
        processQueue(error);
        removeAllTokens();
        logout();
        return Promise.reject(error);
      };

      const kickOut = () => {
        processQueue(null);
        removeAllTokens();
        logout();
        return Promise.resolve(true);
      };

      // Refresh token conditions
      if (
        refreshToken &&
        response.data.HttpResponseCode === 401 &&
        response.data.ResponseMessage === 'login.lost_authorization' &&
        originalRequest?.url !== refreshTokenUrl &&
        originalRequest?._retry !== true
      ) {
        if (isRefreshing) {
          try {
            await new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });

            return await client(originalRequest);
          } catch (err) {
            return await Promise.reject(err);
          }
        }

        isRefreshing = true;
        originalRequest._retry = true;

        return client
          .post(refreshTokenUrl, {
            expiredToken: accessToken,
            refreshToken: refreshToken,
          })
          .then(async (res) => {
            const data = res.data;

            switch (data.HttpResponseCode) {
              case 400:
                switch (data.ResponseMessage) {
                  case 'general.object_invalid':
                  case 'token.invalid_refresh_token':
                  case 'token.refresh_token_expired':
                    return kickOut();
                  default:
                    return client(originalRequest);
                }

              case 403:
              case 500:
                return kickOut();

              default:
                const tokens = {
                  accessToken: data?.Data?.accessToken,
                  refreshToken: data?.Data?.refreshToken,
                };
                // setNewTokens(tokens.accessToken, tokens.refreshToken);
                await Promise.all([setAccessToken(tokens.accessToken), setRefreshToken(tokens.refreshToken)]);
                processQueue(null);
                return client(originalRequest);
            }
          }, handleError)

          .finally(() => {
            isRefreshing = false;
          });
      }

      if (response.data.HttpResponseCode === 401 && response.data.ResponseMessage === 'login.lost_authorization') {
        return kickOut();
      }
      return response;
    },
    (error) => {
      console.log('response error: ', error);
      const originalRequest = error.config;

      // Refresh token missing or expired => logout user...
      // if (error.response?.status === 401 && error.response?.data?.message === 'TokenExpiredError') {
      //   return handleError(error);
      // }

      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );

  return client;
};

export { createAxiosClient };
