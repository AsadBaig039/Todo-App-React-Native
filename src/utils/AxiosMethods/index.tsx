import axios from 'axios';
import {getData} from '../AsyncStorageMethods';
let baseURL = 'https://api-nodejs-todolist.herokuapp.com';

/* Basic Axios Request*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const doGet = (url: string, data: Object) =>
  new Promise((resolve, reject) =>
    axios({
      url: baseURL + url,
      method: 'GET',
      headers: {
        // Authorization: 'Bearer ' + data,
        'Content-Type': 'application/json',
      },
    })
      .then((result) => {
        // console.log(result);
        resolve(result);
      })
      .catch((error) => reject(error)),
  );

export const doPost = async (url: string, data: Object) => {
  const endPoint = baseURL + url;
  const getToken = await getData('userToken');
  console.log('token', getToken);

  return new Promise((resolve) =>
    axios
      .post(
        endPoint,
        data,
        //      {

        //     headers: {
        //       Authorization: `Bearer ${getToken}`,
        //       'content-type': 'application/json',
        //     },
        //   }
      )
      .then((result) => {
        console.log(result);
        resolve(result.data);
      })
      .catch((error) => {
        console.log(error);
        // resolve(result.data);
      }),
  );
};

// export const doDeleteAws = (data, url) =>
//   new Promise(resolve =>
//     axios({
//       url: baseURL + url,
//       method: 'DELETE',
//       //timeout: 1000 * 8,
//       headers: {
//         'Content-Type': 'application/json',
//         //'Authorization': "Bearer " + token
//       },
//       data,
//     })
//       .then(result => {
//         // console.log('Post Request Result', result);
//         resolve(result);
//       })
//       .catch(error => resolve(error)),
//   );

// export const doPostWithTokenResponse = (url, data) => {
//   const endPoint = baseURL + url;

//   return new Promise(resolve =>
//     axios.post(endPoint, data).then(result => {
//       resolve({data: result.data, token: result.headers['x-auth-token']});
//     }),
//   );
// };

// export const doGetWithTokenInHeader = (url, token) => {
//   // console.log(`doGetWithTokenInHeader ${url} and Token ${token}`);
//   const endPoint = baseURL + url;
//   return new Promise((resolve, reject) =>
//     axios(endPoint, {
//       headers: {
//         'x-auth-token': token,
//       },
//     })
//       .then(result => {
//         // console.log('Result from api in doGetWithTokenInHeader', result);
//         resolve(result);
//       })
//       .catch(error => reject(error)),
//   );
// };

// export const doPostAws = (data, url) =>
//   new Promise(resolve =>
//     axios({
//       url: url,
//       method: 'POST',
//       //timeout: 1000 * 8,
//       headers: {
//         'Content-Type': 'application/json',
//         //'Authorization': "Bearer " + token
//       },
//       data,
//     })
//       .then(result => {
//         // console.log('Post Request Result', result);
//         resolve(result);
//       })
//       .catch(error => resolve(error)),
//   );

// export const doPutAws = (data, url) =>
//   new Promise(resolve =>
//     axios({
//       url: baseURL + url,
//       method: 'PUT',
//       //timeout: 1000 * 8,
//       headers: {
//         'Content-Type': 'application/json',
//         //'Authorization': "Bearer " + token
//       },
//       data,
//     })
//       .then(result => resolve(result))
//       .catch(error => resolve(error)),
//   );

export const doPostWithToken = async (url: string, data: object) => {
  const getToken = await getData('userToken');
  console.log('token', getToken);
  return new Promise((resolve) =>
    axios({
      url: baseURL + url,
      method: 'POST',
      //timeout: 1000 * 8,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getToken,
      },
      data,
    })
      .then((result) => resolve(result))
      .catch((error) => resolve(error)),
  );
};

// export const doPostWithoutBody = (token, url) =>
//   new Promise(resolve =>
//     axios({
//       url: baseURL + url,
//       method: 'POST',
//       //timeout: 1000 * 8,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer ' + token,
//       },
//     })
//       .then(result => resolve(result))
//       .catch(error => resolve(error)),
//   );

// export const doDelete = (token, url) =>
//   new Promise(resolve =>
//     axios({
//       url: baseURL + url,
//       method: 'DELETE',
//       headers: {
//         Authorization: 'Bearer ' + token,
//       },
//     })
//       .then(result => resolve(result))
//       .catch(error => resolve(error)),
//   );
