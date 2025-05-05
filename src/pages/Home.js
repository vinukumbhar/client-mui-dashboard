import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import React from "react";
import { Stack, Typography } from "@mui/material";
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
// import TelegramIcon from "@mui/icons-material/Telegram";
import QuickLinks from "../components/QuickLinks";
import OrganizersList from "../components/Home Components/OrganizersList";
import BillingList from "../components/Home Components/BillingList";
import DocumentsList from "../components/Home Components/DocumentsList";
import ChatsList from "../components/Home Components/ChatsList";

const Home = () => {
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
          <ChatsList />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <QuickLinks />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
