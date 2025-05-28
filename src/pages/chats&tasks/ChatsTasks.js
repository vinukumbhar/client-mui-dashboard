import {
  Button,
  Stack,
  Typography,
  Container,
  Divider,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import TelegramIcon from "@mui/icons-material/Telegram";
import Grid from "@mui/material/Grid";
import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../context/Context";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
const ChatsTasks = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");

  useEffect(() => {
    if (logindata?.user?.id) {
      const id = logindata.user.id;
      setLoginUserId(id);

      fetchAccountId(id); // pass the ID directly
    }
  }, [logindata]);
  console.log(loginuserid);
  const [isActiveTrue, setIsActiveTrue] = useState(true);
  const fetchAccountId = (id) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://127.0.0.1/accounts/accountdetails/accountdetailslist/listbyuserid/${id}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        accountwiseChatlist(response.data.accounts[0]._id, isActiveTrue);
      })
      .catch((error) => {
        console.log(error);
      });
  };

 
  const [accountName, setAccountName] = useState();
  const [time, setTime] = useState();
  const [chatList, setChatList] = useState([]);

  const accountwiseChatlist = (accId, ActiveTrue) => {
    console.log(accId);
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `http://127.0.0.1/chats/chatsaccountwise/isactivechat/${accId}/${ActiveTrue}`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        if (result.chataccountwise && result.chataccountwise.length > 0) {
          result.chataccountwise.forEach((chat) => {
            console.log(chat.chatsubject);
            console.log(chat.description);

            chat.description.forEach((message) => {
              console.log(message._id);
            });
            setAccountName(chat.accountid.accountName);
            setTime(chat.updatedAt);
          });
          // setIsSubmitted(true)
          setChatList(result.chataccountwise);
        } else {
          console.log("No chat data available");
        }
      })
      .catch((error) => console.error(error));
  };
  const formattedTime = new Date(time)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    })
    .replace(",", "");

  const handleShowChat = (chatId) => {
    // Navigate to the chat update page with the chat ID
    // navigate(`/updatechat/${chatId}`);
    updatechatStatus(chatId)
      .then(() => {
        // Once the status is updated, navigate to the chat update page
        navigate(`/updatechat/${chatId}`);
      })
      .catch((error) => {
        console.error("Error updating chat status:", error);
      });
  };

  const updatechatStatus = (chatId) => {
    return new Promise((resolve, reject) => {
      let data = JSON.stringify({
        chatstatus: true,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `http://127.0.0.1/chats/accountchat/updatestatus/${chatId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log("Status updated:", JSON.stringify(response.data));
          resolve(); // Resolve the promise if successful
        })
        .catch((error) => {
          console.error("Error updating chat status:", error);
          reject(error); // Reject the promise if there's an error
        });
    });
  };
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        flexGrow: 1,

        height: "90vh",
        p: 1,
      }}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid item>
          <Typography
            variant="h4"
            component="p"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Chats & Tasks
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            size="small"
            color="primary"
            fullWidth={isSmallScreen}
            // onClick={handleNewChat}
          >
            New Chat
          </Button>
        </Grid>
      </Grid>
      <Box>
        {chatList.length > 0 &&
          chatList.map((chat, index) => (
            <Box>
              <Paper
                key={index}
                sx={{ p: 1, cursor: "pointer" }}
                
                onClick={() => handleShowChat(chat._id)}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  mb={1}
                  gap={1.5}
                  sx={{ justifyContent: "space-between", flexDirection: "row" }}
                >
                  <Box display="flex" alignItems="center" mb={1} gap={1.5}>
                    <TelegramIcon
                      sx={{
                        color: chat.chatstatus
                          ? theme.palette.text.menu
                          : theme.palette.success.main,
                      }}
                      fontSize="small"
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      Chat with {chat.accountid.accountName}{" "}
                    </Typography>
                  </Box>

                  <Box>
                    {!chat.chatstatus && (
                      <FiberManualRecordIcon
                        fontSize="small"
                        sx={{ color: theme.palette.success.main }}
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{}}>
                  <Typography
                    component="h2"
                    variant="subtitle2"
                    gutterBottom
                    sx={{ fontWeight: "600" }}
                  >
                    {chat.chatsubject}
                  </Typography>
                  <Typography component="h2" variant="caption" gutterBottom>
                    
                    {(() => {
                      const cleanText =
                        chat.description[0]?.message.replace(/<[^>]+>/g, "") ||
                        "";
                      const words = cleanText.split(/\s+/);
                      return words.length > 35
                        ? words.slice(0, 35).join(" ") + "..."
                        : cleanText;
                    })()}
                  </Typography>

                  <Box textAlign="right">
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {formattedTime}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              <Divider sx={{ mb: 1, mt: 1 }} />
            </Box>
          ))}
      </Box>
      {/* <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ height: "80vh" }}>
          <Box sx={{ height: "90vh" }}>
            {chatList.length > 0 &&
              chatList.map((chat, index) => (
                <Box>
                  <Paper key={index} sx={{ p: 1, cursor: "pointer" }}>
                    <Box display="flex" alignItems="center" mb={1} gap={1.5}>
                      <TelegramIcon
                        sx={{ color: "text.menu" }}
                        fontSize="small"
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        Chat with {chat.accountid.accountName}{" "}
                      </Typography>
                    </Box>
                    <Box sx={{}}>
                      <Typography
                        component="h2"
                        variant="subtitle2"
                        gutterBottom
                        sx={{ fontWeight: "600" }}
                      >
                        {chat.chatsubject}
                      </Typography>
                      <Typography component="h2" variant="caption" gutterBottom>
                       
                        {(() => {
                          const cleanText =
                            chat.description[0]?.message.replace(
                              /<[^>]+>/g,
                              ""
                            ) || "";
                          const words = cleanText.split(/\s+/);
                          return words.length > 20
                            ? words.slice(0, 20).join(" ") + "..."
                            : cleanText;
                        })()}
                      </Typography>

                      <Box textAlign="right">
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {formattedTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                  <Divider sx={{ mb: 1, mt: 1 }} />
                </Box>
              ))}
          </Box>
        </Grid>
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{ border: "2px solid red", height: "80vh" }}
        ></Grid>
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{ border: "2px solid red", height: "80vh" }}
        ></Grid>
      </Grid> */}
    </Box>
  );
};

export default ChatsTasks;
