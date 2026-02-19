import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { ConfigProvider } from 'antd';
import { Toaster } from 'react-hot-toast';
import Auth from './shared/rbac/provider';
import { theme } from './shared/theme';
import RootRouter from './router';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const App = () => {
  const [, setSubDomain] = useState(null);

  useEffect(() => {
    const host = window.location.host; // gets the full domain of the app

    const arr = host
      .split('.')
      .slice(0, host.includes('videoassistant.com') ? -1 : -2);
    if (arr.length > 0) setSubDomain(arr[0]);
  }, []);

  return (
    <ConfigProvider theme={theme}>
      <Auth>
        <RootRouter />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            className: '',
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
              fontSize:'15px'
            },

            // Default options for specific types
            success: {
              duration: 5000,
              theme: {
                primary: 'green',
                secondary: 'black'
              }
            }
          }}
        />
      </Auth>

      {/* <VaLoader/> */}
    </ConfigProvider>
  );
};

export default App;
