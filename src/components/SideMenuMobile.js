import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MenuButton from './MenuButton';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import { useEffect,useContext,useState } from "react";
import { LoginContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from 'material-react-toastify';
function SideMenuMobile({ open, toggleDrawer }) {

  const { logindata, setLoginData } = useContext(LoginContext);
  const [loginuser, setLoginUser] = useState("");
  // const [userData, setUserData] = useState("");
  const [username, setUsername] = useState("");
  
  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUser(logindata.user.id);
    }
  }, [logindata]);
  
  useEffect(() => {
    if (loginuser) {
      fetchUserData(loginuser);
    }
  }, [loginuser]);
  

  
  const fetchUserData = async (id) => {
 
    const myHeaders = new Headers();
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    
    const url = `http://127.0.0.1/common/user/${id}`;
    
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      console.log("id", result);
      
     
      setUsername(result.username);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // const { logindata, setLoginData } = useContext(LoginContext);
  const navigate = useNavigate();
  const logoutuser = async () => {
    let token = localStorage.getItem("clientdatatoken");
    const url = 'http://127.0.0.1/common/clientlogin/logout/';

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
    };

    const res = await fetch(url, requestOptions);

    const data = await res.json();

    if (data.status === 200) {
        console.log("user logout");
        localStorage.removeItem("clientdatatoken");
        Cookies.remove("clientuserToken");
        setLoginData(false);

        navigate("/login");

        toast.success("Logout Successfully")
    } else {
        console.log("error");
    }
};
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt="Profile"
              // src="/static/images/avatar/7.jpg"
              sx={{ width: 24, height: 24 }}
            />
            <Typography component="p" variant="h6">
            {username}
            </Typography>
          </Stack>
          <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        <CardAlert />
        <Stack sx={{ p: 2 }}>
          <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />}  onClick={logoutuser}>
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}

SideMenuMobile.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SideMenuMobile;
