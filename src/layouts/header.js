import { EyeInvisibleOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Image, Input, Layout, Typography } from 'antd';
import userPool from 'AWSCognitoUserPool';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { VaContext } from 'shared/rbac/context';
import { searchCourseVideoList } from '../pages/dashboard/redux/courseSlice';
import styles from './layouts.module.scss';
import logo from './logo.svg';

const { Text } = Typography;
const { Header } = Layout;
const { Search } = Input;

function GlobalHeader(props) {
  const navigate = useNavigate();
  const authCxt = useContext(VaContext);
  const [userInitial, setUserInitial] = useState(' '); // Default initial
  const dispatch = useDispatch();
 const [userData, setUserData] = useState({});
  const handleSearch = (value) => {

    dispatch(searchCourseVideoList(value));
  };

  // Assuming you can get the user's email from a method like getCurrentUser() or a global state
  useEffect(() => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          console.error(err);
          toast.error(`Session error: ${err.message}`); // Show error toast
          return;
        }
        const userEmail = session.getIdToken().payload.email;
        setUserData({email: userEmail});
        setUserInitial(userEmail.charAt(0).toUpperCase());
      });
    }
  }, []);

  const logout = ({ key }) => {
    if (key === '3') {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        try {
          cognitoUser.signOut();
          authCxt.logout();
          toast.success('Successfully logged out!');
          window.location.href = 'https://feedio.ai'; // Redirect to Feedio.ai
        } catch (error) {
          toast.error(`Logout error: ${error.message}`);
        }
      }
    }
  };

  const options = [
    {
      key: "1",
      label: <Text ellipsis={true} style={{ maxWidth: 150 }}>{userData.email}</Text>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: <Link to="/account/changepassword">Change password</Link>,
      icon: <EyeInvisibleOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];

  const SearchInput = () => {
    const location = useLocation();
    if (location.pathname !== '/dashboard') {
      return null; 
    }
    return (
      <div
        key="SearchOutlined"
        aria-hidden
        className={styles.search}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Search
          className={styles.searchBox}
          // prefix={<SearchOutlined />}
          placeholder="Search courses/videos"
          variant={'borderless'}
          onSearch={handleSearch}
          enterButton 
          allowClear
        />
      </div>
    );
  };

  return (
    <>
      <Header className={styles.shallowHeader}></Header>
      <Header className={`${styles.header}`}>
        <div className={styles.topNavHeader}>
          <div className={styles.topNavHeaderMain}>
            <div
              className={styles.topNavHeaderMainLeft}
              onClick={() => navigate('/dashboard')}
            >
              <div className={styles.logo}>
                <Image
                  height={38}
                  src={logo}
                  preview={false}
                  style={{ marginTop: '20px' }}
                />
              </div>
              {/* Add Feedio.ai text here */}
              <div className={styles.branding}>
                <h3
                  style={{
                    marginLeft: '90px',
                    marginTop: '-45px',
                    fontFamily: 'unset',
                    fontWeight:'bold',
                    opacity: '100%',
                    fontSize: '20px',
                  }}
                >
                  <span style={{color:'#33382f'}}>Feed</span>io
                </h3>
              </div>
            </div>
            <div className={`${styles.topNavHeaderMenu} topNav`}>
              <ul>
                {/* <li className={styles.welcomeText}>Welcome John</li> */}
              </ul>
            </div>
            <div className={styles.headerRightContent}>
              <SearchInput />
            </div>
            <div className={styles.headerActionsAvatar}>
              <Dropdown
                menu={{
                  items: options,
                  onClick: logout
                }}
                overlayClassName={styles.settings}
                arrow
                placement={'bottomRight'}
              >
                <Button shape="circle">{userInitial}</Button>
              </Dropdown>
            </div>
          </div>
        </div>
      </Header>
    </>
  );
}

export default GlobalHeader;
