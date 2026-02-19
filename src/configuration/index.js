import { getCookie } from "cookies-next";
export const configs = () => {
  const accountId= getCookie('accountId');
  let API_HOST = 'https://api.videoassistant.com';
  let API_VERSION = 'v1';
  let ATTACHEMNT_BASE_URL=`https://storage.cloud.google.com/videoassistant/${accountId}`;
  if(process.env.REACT_APP_ENV ==='dev'){
    API_HOST = 'https://api.videoassistant.com';
  }else if(process.env.REACT_APP_ENV ==='prod'){
    API_HOST = 'https://api.videoassistant.com';
  }else if(process.env.REACT_APP_ENV ==='qa'){
    API_HOST = 'https://api-qa.videoassistant.com';
  }
  return {
    API_HOST,
    ATTACHEMNT_BASE_URL,
    API_VERSION
  };
};
  