import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Stack, Typography } from "@mui/material";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
const ChatsList = () => {
  const [chats, setChats] = useState([]);
    const theme = useTheme();

  useEffect(() => {
    const fetchUnreadChats = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1/chats/unreadmessages"
        );
        setChats(response.data.chats || []);
        console.log("unread chat messages",response.data.chats)
       
      } catch (error) {
        console.error("Error fetching unread chats:", error);
      }
    };

    fetchUnreadChats();
  }, []);
  const stripHtmlAndLimit = (html, wordLimit) => {
    if (!html) return "";
    const plainText = html.replace(/<[^>]+>/g, " "); // strip HTML tags
    const words = plainText.trim().split(/\s+/);
    if (words.length <= wordLimit) return plainText.trim();
    return words.slice(0, wordLimit).join(" ") + " ...";
  };
  const navigate = useNavigate();

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
        "chatstatus": true
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://127.0.0.1/chats/accountchat/updatestatus/${chatId}`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios.request(config)
        .then((response) => {
          console.log("Status updated:", JSON.stringify(response.data));
          resolve();  // Resolve the promise if successful
        })
        .catch((error) => {
          console.error("Error updating chat status:", error);
          reject(error);  // Reject the promise if there's an error
        });
    });
  };

  return (
    <>
      {chats.length > 0 && (
        <Box>
          <Stack
            sx={{
              p: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Typography
              component="h2"
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: "600" }}
            >
              Chats & Tasks ({chats.length})
            </Typography>
          </Stack>

          <Box mt={2}>
            {/* {chats.map((chat) => (
              <Stack key={chat._id} mb={1.5}>
                <Paper sx={{ p: 2 ,cursor:'pointer'}} onClick={() => handleShowChat(chat._id)}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {chat.chatsubject}
                  </Typography>
                  <Stack direction="row" alignItems="flex-start" spacing={1}>
                    <SendIcon
                      fontSize="small"
                      sx={{ color: "#4caf50", mt: "3px" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      <strong>
                        
                      {chat.latestMessage?.fromwhome?.username}
                        
                      </strong>{" "}
                      {stripHtmlAndLimit(chat.latestMessage?.message, 15)}
                    </Typography>
                  </Stack>
                </Paper>
              </Stack>
            ))} */}
            {chats.map((chat) => {
  const messageData = chat.latestMessage?._doc || {};
  const sender = messageData.senderid?.username || "Unknown Sender";
 

  return (
    <Stack key={chat._id} mb={1.5}>
      <Paper sx={{ p: 2, cursor: "pointer" }} onClick={() => handleShowChat(chat._id)}>
        <Typography variant="subtitle2" fontWeight="bold">
          {chat.chatsubject}
        </Typography>
        <Stack direction="row" alignItems="flex-start" spacing={1}>
          <SendIcon fontSize="small" sx={{ color: theme.palette.success.main, mt: "3px" }} />
          <Typography variant="body2" color="text.secondary">
            {sender} : {stripHtmlAndLimit(chat.latestMessage?.message, 15)}
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
})}

          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatsList;
