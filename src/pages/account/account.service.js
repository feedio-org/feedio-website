// import VaAPI from 'shared/api';
// import { configs } from 'configuration';

// const version = configs().API_VERSION;

// export const accountAPI = {

//   login(data) {
//     return VaAPI.post(`/api/${version}/account/login`, { data });
//   },
//   createAccount(data) {
//     return VaAPI.post(`/api/${version}/account/signup`, { data });
//   },
//   verify(data){
//     return VaAPI.update(`/api/${version}/account/verify`, { data });
//   },
//   resedOTP(data){
//     return VaAPI.post(`/api/${version}/account/resend/otp`, { data });
//   },
//   forgotpassword(data){
//     return VaAPI.post(`/api/${version}/account/forgot`, { data });
//   },
//   changePassword(data){
//     return VaAPI.post(`/api/${version}/account/resetpwd`, { data });
//   },
//   newPassword(data){
//     return VaAPI.post(`/api/${version}/account/newpwd`, { data });
//   }
// };
