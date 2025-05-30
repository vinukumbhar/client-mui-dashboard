import { InputLabel, TextField, Typography } from "@mui/material";
import Editor from "../../components/Texteditor";
import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import { Box, Button } from "@mui/material";
import MenuButton from "../../components/MenuButton";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "material-react-toastify";

function NewChat({
  open,
  close,
  loginuserid,
  
  accId,
  
}) {


  const [inputText, setInputText] = useState("");
  const handlechatsubject = (e) => {
    const { value } = e.target;
    setInputText(value);
  };
  const [editorContent, setEditorContent] = useState("");
  const handleEditorChange = (content) => {
    setEditorContent(content);
  };
const saveChat = () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const messageData = [
    {
      message: editorContent,
      fromwhome: "client",
      senderid: loginuserid,
      isRead: false,
    },
  ];
  
  const raw = JSON.stringify({
    accountids: [accId],
    chatsubject: inputText,
    description: messageData,
    active: "true",
  });
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://127.0.0.1/chats/chatsaccountwise", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      toast.success("New Chat created successfully");
    
      setInputText("");
      setEditorContent("");
      close(); // This will close the drawer
    })
    .catch((error) => {
      console.error("Fetch error: ", error.message);
      toast.error("Failed to create new chat. Please try again.");
    });
};
  // const saveChat = () => {
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");
  //   const messageData = [
  //     {
  //       message: editorContent,
  //       fromwhome: "client",

  //       senderid: loginuserid,

  //       isRead: false,
  //     },
  //   ];
  //   console.log(messageData);
  //   const raw = JSON.stringify({
  //     accountids: [accId],
  //     chatsubject: inputText,
  //     description: messageData,
  //     active: "true",
  //   });
  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };
  //   console.log(raw);
  //   fetch("http://127.0.0.1/chats/chatsaccountwise", requestOptions)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((result) => {
  //       console.log(result);
  //       toast.success("New Chat created successfully");

  //       handleClose();
  //       accountwiseChatlist(accId, isActiveTrue);
  //       setInputText("");
  //       setEditorContent("");
  //     })
  //     .catch((error) => {
  //       console.error("Fetch error: ", error.message);
  //       toast.error("Failed to create new chat. Please try again.");
  //     });
  // };
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={close}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          width: "40dvw",
          backgroundImage: "none",
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack
        sx={{
          minWidth: "35dvw",
          height: "100%",
        }}
      >
        <Stack
          direction="row"
          sx={{ p: 2, pb: 0, gap: 1, alignItems: "center" }}
        >
          <Stack
            direction="row"
            sx={{
              gap: 1,
              alignItems: "center",
              flexGrow: 1,
              p: 1.5,
              justifyContent: "space-between",
            }}
          >
            <Typography component="p" variant="h6">
              New Chat
            </Typography>
            <MenuButton onClick={close}>
              <CloseIcon />
            </MenuButton>
          </Stack>
        </Stack>
        <Box sx={{ p: 3 }}>
          <Stack>
            <Typography
              variant="subtitle2"
              component="p"
              gutterBottom
              sx={{ fontWeight: "500" }}
            >
              Subject
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              multiline
              fullWidth
              placeholder="Subject"
              value={inputText}
              onChange={handlechatsubject}
            />
          </Stack>
          <Stack sx={{ mt: 3 }}>
            {" "}
            <Editor onChange={handleEditorChange} value={editorContent} />
          </Stack>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button variant="contained" onClick={saveChat}>
              Create chat
            </Button>
            <Button onClick={close} variant="outlined">
              Cancel
            </Button>
          </Box>
        </Box>
      </Stack>
    </Drawer>
  );
}
NewChat.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
};
export default NewChat;
