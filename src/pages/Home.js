import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import React ,{useContext,useEffect,useState}from "react";
import { Stack, Typography } from "@mui/material";
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
// import TelegramIcon from "@mui/icons-material/Telegram";
import QuickLinks from "../components/QuickLinks";
import OrganizersList from "../components/Home Components/OrganizersList";
import BillingList from "../components/Home Components/BillingList";
import DocumentsList from "../components/Home Components/DocumentsList";
import ChatsList from "../components/Home Components/ChatsList";
import ProposalsList from "../components/Home Components/ProposalsList"

import { LoginContext } from '../context/Context';
const Home = () => {
   const { logindata } = useContext(LoginContext);
     const [loginUserId, setLoginUserId] = useState();
  console.log("login data",logindata)
    useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
     
    }
  }, [logindata]);
   
 

useEffect(() => {
  if (loginUserId) {
    fetchAccountId();
  }
}, [loginUserId]);
const [accountId, setAccountId] = useState();
    const fetchAccountId = async () => {


    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    try {
      const response = await fetch(`http://127.0.0.1/accounts/accountdetails/accountdetailslist/listbyuserid/${loginUserId}`, requestOptions);
      const result = await response.json();
      console.log("result",result);
 if (result.accounts && result.accounts.length > 0) {
      setAccountId(result.accounts[0]._id); // ✅ Setting accountId
    }
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };
  console.log("accountid", accountId)
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        flexGrow: 1,
        // border:'2px solid green',
        height: "90vh",
        p: 1,
      }}
    >
      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12, md: 8 }}
          // sx={{ height: "88vh", overflowY: "auto" }}
        >
          <Stack sx={{ p: 0 }}>
            <Typography
              variant="h6"
              component="p"
              gutterBottom
              sx={{ fontWeight: "600" }}
            >
              Waiting for action
            </Typography>
          </Stack>
          <OrganizersList />
          <BillingList />
          <DocumentsList />
          <ChatsList accountId={accountId}/>
          <ProposalsList accountId={accountId}/>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <QuickLinks />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
