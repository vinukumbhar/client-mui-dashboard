import * as React from "react";
import { useState,useEffect,useContext } from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
// import MainGrid from "./components/MainGrid";
import SideMenu from "./components/SideMenu";
import AppTheme from "./shared-theme/AppTheme";
import { Routes, Route, useNavigate } from "react-router-dom";


import { LoginContext } from "./context/Context";
import { useLocation } from "react-router-dom"; // add this
import { Link, Outlet } from "react-router-dom";
export default function Dashboard(props) {
  const navigate = useNavigate();
  // const location = useLocation(); // add this
  const { logindata, setLoginData } = useContext(LoginContext);

  const [data, setData] = useState(false);
  const [loginsData, setloginsData] = useState("");
  const [userData, setUserData] = useState("");
  const [username, setUsername] = useState("");
  const truncateString = (str, maxLength) => {
    if (str && str.length > maxLength) {
        return str.substring(0, maxLength) + "..."; // Truncate string if it exceeds maxLength
    } else {
        return str;
    }
};
  const fetchUserData = async (id) => {
      const maxLength = 15;
      const myHeaders = new Headers();

      const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
      };
      const url = `http://127.0.0.1/common/user/${id}`;
      fetch(url + loginsData, requestOptions)
          .then((response) => response.json())
          .then((result) => {
              console.log("id", result);
              if (result.email) {
                  setUserData(truncateString(result.email, maxLength));
              }
              //  console.log(userData)
              setUsername(result.username);
          });
    };

  const DashboardValid = async () => {
      let token = localStorage.getItem("clientdatatoken");
      
      const url = "http://127.0.0.1/common/clientlogin/verifytokenforclient";
      const res = await fetch(url, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: token,
          },
      });

      console.log(token);


      const data = await res.json();

      if (data.message === "Invalid token") {
          navigate("/login");
      } else {
          setLoginData(data);
          setloginsData(data.user.id);

          if (data.user.role === "Client") {
              fetchUserData(data.user.id);
              // navigate("/home");
             
          } else {
              // toast.error("You are not a valid user.");
              // fetchUserData(data.user.id);
              // console.log( data.user.id)
              navigate("/login");
              // setTimeout(() => {
                 
              // }, 1000);
          }
      }
  };
  useEffect(() => {
      DashboardValid();
      setData(true);
  }, []);
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState(false);
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        {/* <SideMenu /> */}
        <SideMenu 
          collapsed={sideMenuCollapsed} 
          onCollapseToggle={() => setSideMenuCollapsed(!sideMenuCollapsed)} 
        />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
            // marginLeft: sideMenuCollapsed ? '64px' : '240px', // Adjust based on your collapsed width
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              // pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />

            
             <Outlet />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
