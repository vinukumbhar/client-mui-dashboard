// import React from 'react'
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import React,{useState} from "react";
import { Divider, Stack, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import TelegramIcon from "@mui/icons-material/Telegram";
import NewChat from "../pages/chats&tasks/NewChat";
const QuickLinks = ({accountId,loginUserId}) => {

    const [open, setOpen] = useState(false);
     const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  return (
    <>
     <Paper sx={{ height: "auto" }}>
            <Stack direction="row" sx={{ gap: 1, alignItems: "center", p: 2 }}>
              <Typography variant="h6" component="p" sx={{ flexGrow: 1 }}>
                Quick links
              </Typography>
            </Stack>
            <Divider sx={{ mb: 1 }} />
            {/* <Box sx={{ flexGrow: 1, p: 2 }}> */}
            <Grid container spacing={2} sx={{p:1}}>
              <Grid size={{ xs: 12, md: 6 }} >
                <Stack>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <UploadFileIcon />
                    <Typography component="h2" variant="subtitle2" gutterBottom>
                      Uplaod Documents
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <DriveFolderUploadIcon />
                    <Typography component="h2" variant="subtitle2" gutterBottom>
                      Uplaod Folder
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 6, md: 6 }}>
                <Stack>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <TelegramIcon />
                    <Typography component="h2" variant="subtitle2" gutterBottom  onClick={handleOpen} sx={{cursor:'pointer'}}>
                      Chats
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
            {/* </Box> */}

            <Stack direction="row" sx={{ gap: 1, alignItems: "center", p: 2 }}>
              <Typography variant="h6" component="p" sx={{ flexGrow: 1 }}>
                Balance
              </Typography>
            </Stack>
            <Divider sx={{ mb: 1 }} />

            <Box sx={{ flexGrow: 1, p: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        component="h2"
                        variant="subtitle2"
                        gutterBottom
                      >
                        Credits Available
                      </Typography>

                      <Typography
                        component="h2"
                        variant="subtitle2"
                        gutterBottom
                      >
                        $0.00
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        component="h2"
                        variant="subtitle2"
                        gutterBottom
                      >
                        Outstanding Balance
                      </Typography>
                      <Typography
                        component="h2"
                        variant="subtitle2"
                        gutterBottom
                      >
                        $0.00
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            <Stack direction="row" sx={{ gap: 1, alignItems: "center", p: 2 }}>
              <Typography variant="h6" component="p" sx={{ flexGrow: 1 }}>
                Contact info
              </Typography>
            </Stack>

            <Divider sx={{ mb: 1 }} />
            <Stack p={2}>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{ flexGrow: 1 }}
              >
                Phone
              </Typography>
              <Typography
                variant="subtitle2"
                component="p"
                sx={{ flexGrow: 1 }}
              >
                (925) 800-3561
              </Typography>
            </Stack>
            <Stack p={2}>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{ flexGrow: 1 }}
              >
                Address
              </Typography>
              <Typography
                variant="subtitle2"
                component="p"
                sx={{ flexGrow: 1 }}
              >
                3015 Hopyard Rd, Ste M, Pleasanton, CA 94588
              </Typography>
            </Stack>
          </Paper>

           <NewChat open={open} close={handleClose}  accId={accountId} loginuserid={loginUserId} />
    </>
  )
}

export default QuickLinks