import {
  Box,
  Grid,
  Checkbox,
  // Container,
  // Divider,
  Typography,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "material-react-toastify";
import Editor from "../../components/Texteditor";
const UpdateChat = () => {
  const { _id } = useParams();
  const [chatDetails, setChatDetails] = useState("");
  const [time, setTime] = useState();
  const [chatsubject, setChatSubject] = useState("");
  const [accountName, setAccountName] = useState("");
  const [chatDescriptions, setChatDescriptions] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const [tasks, setTasks] = useState([]);

  const getsChatDetails = async () => {
    try {
      const url = `http://127.0.0.1/chats/chatsaccountwise/`;
      const response = await fetch(url + _id);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setChatDetails(data.chat);
      setChatSubject(data.chat.chatsubject);
      setTime(data.chat.updatedAt);
      setAccountName(data.chat.accountid.accountName);
      setChatDescriptions(data.chat.description || []);
      setTasks(data.chat.clienttasks.flat());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleCheckboxChange = (index) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task, i) =>
        i === index
          ? { ...task, checked: task.checked === "true" ? "false" : "true" }
          : task
      );
  
      updateClientTask(updatedTasks);
      return updatedTasks;
    });
  };
  

  const updateClientTask = (updatedTasks) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      chatId: _id,
      taskUpdates: updatedTasks.map(task => ({
        id: task.id,
        text: task.text,
        checked: task.checked.toString(), // Ensure boolean is sent as string "true"/"false"
      })),
    });

    console.log("Payload to Backend:", raw); // Log to verify

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`http://127.0.0.1/chats/chatsaccountwise/updateTaskCheckedStatus`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("Backend response:", result);
        const allChecked = updatedTasks.every(task => task.checked === true || task.checked === "true");

        if (allChecked) {
          const taskMessages = updatedTasks.map(task => `• <s>${task.text}</s>`).join("<br>");
          // const taskMessages = updatedTasks.map(task => `• ${task.text}`).join("\n");
          console.log("All tasks are checked. Updating description:", taskMessages);
          updateChatDescription(taskMessages);
        }
         else {
          console.log("Not all tasks are checked. Description not updated.");
        }
      })
      .catch(error => console.error("Error updating task:", error));
  };

  
  useEffect(() => {
    getsChatDetails();
  }, []);

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${day} ${month} ${formattedHours}:${formattedMinutes} ${period}`;
  };
  const updateChatDescription = (message = "") => {
    const contentToSend = message.trim() || editorContent.trim();
    if (!contentToSend) return;
  
    const newDescription = {
      message: contentToSend,
      fromwhome: "client",
    };
  
    setChatDescriptions((prevDescriptions) => [
      ...prevDescriptions,
      { ...newDescription, time: new Date().toISOString() },
    ]);
  
    setEditorContent("");
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      newDescriptions: [newDescription],
    });
  
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    const url = `http://127.0.0.1/chats/chatsaccountwise/chatupdatemessage/${_id}`;
  
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Chat description updated successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to update chat description. Please try again.");
      });
  };
  
  // const updateChatDescription = () => {
  //   if (!editorContent.trim()) return;

  //   const newDescription = {
  //     message: editorContent,
  //     fromwhome: "client",
  //   };

  //   setChatDescriptions((prevDescriptions) => [
  //     ...prevDescriptions,
  //     { ...newDescription, time: new Date().toISOString() },
  //   ]);

  //   setEditorContent("");

  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   const raw = JSON.stringify({
  //     newDescriptions: [newDescription],
  //   });

  //   const requestOptions = {
  //     method: "PATCH",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };

  //   const url = `http://127.0.0.1/chats/chatsaccountwise/chatupdatemessage/${_id}`;

  //   fetch(url, requestOptions)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((result) => {
  //       toast.success("Chat description updated successfully");
  //       setEditorContent("");
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       toast.error("Failed to update chat description. Please try again.");
  //     });
  // };
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
      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ border: "2px solid red", height: "89vh", p: 2 }}
        >
          <Box>
            <Typography
              variant="h6"
              component="p"
              gutterBottom
              sx={{ fontWeight: "600" }}
            >
              {chatsubject}
            </Typography>
          </Box>
          <Divider />
          <Box height={"42vh"} sx={{ overflowY: "auto", mt: 1, mb: 1 }}>
            {Array.isArray(chatDescriptions) &&
              chatDescriptions.length > 0 &&
              chatDescriptions.map((desc, index) => {
                const isClient = desc.fromwhome?.toLowerCase() === "client";
                const isAdmin = desc.fromwhome?.toLowerCase() === "admin";
                const messageTime = desc.time
                  ? formatDate(desc.time)
                  : "Just now";

                return (
                  <Box
                    key={desc._id || index}
                    sx={{
                      display: "flex",
                      justifyContent: isClient ? "flex-end" : "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "75%",
                        backgroundColor: isAdmin ? "#ffe6e6" : "#e6f0ff",
                        p: 2,
                        borderRadius: 2,
                        borderTopLeftRadius: isClient ? 16 : 4,
                        borderTopRightRadius: isClient ? 4 : 16,
                        boxShadow: 1,
                      }}
                    >
                      {/* <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", color: "#333" }}
                        dangerouslySetInnerHTML={{
                          __html:
                            typeof desc.message === "string"
                              ? desc.message.replace(/<[^>]+>/g, "")
                              : desc.message || "No message available",
                        }}
                      /> */}
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", color: "#333" }}
                        dangerouslySetInnerHTML={{
                          __html:
                            typeof desc.message === "string"
                              ? desc.message
                              : "No message available",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "right",
                          color: "gray",
                          mt: 1,
                        }}
                      >
                        {messageTime}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 2,
              alignItems: "start",
              // mt:2
            }}
          >
            <Editor onChange={handleEditorChange} value={editorContent} />
            <Button
              // onClick={updateChatDescription}
              onClick={() => updateChatDescription()}
              variant="contained"
              sx={{ height: "fit-content", alignSelf: "end" }}
            >
              Send
            </Button>
          </Box>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ border: "2px solid red", height: "89vh", p: 2 }}
        >
          <Box>
            <Typography
              variant="h6"
              component="p"
              gutterBottom
              sx={{ fontWeight: "600" }}
            >
              Client Tasks
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {/* <Box display="flex" flexDirection="column" gap={2}>
              {tasks.map((task, index) => (
                <Box key={index} display="flex" alignItems="center" gap={1}>
                  <Checkbox
                    checked={task.checked === "true"}
                   
                    onChange={() => handleCheckboxChange(index)} // use index instead of task.id

                  />
                  <Box
                    sx={{
                      p: 1,
                      width: "100%",
                      textDecoration: task.checked === "true" ? "line-through" : "none",
                    }}
                  >
                    <Typography variant="body1">{task.text}</Typography>
                  </Box>
                </Box>
              ))}
            </Box> */}

<Box display="flex" flexDirection="column" gap={2}>
  {tasks.length > 1 ? (
    tasks.map((task, index) => (
      <Box key={index} display="flex" alignItems="center" gap={1}>
        <Checkbox
          checked={task.checked === "true"}
          onChange={() => handleCheckboxChange(index)}
        />
        <Box
          sx={{
            p: 1,
            width: "100%",
            textDecoration: task.checked === "true" ? "line-through" : "none",
          }}
        >
          <Typography variant="body1">{task.text}</Typography>
        </Box>
      </Box>
    ))
  ) : (
    <Typography variant="body2" color="text.secondary">
      No task is assigned
    </Typography>
  )}
</Box>

          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdateChat;
