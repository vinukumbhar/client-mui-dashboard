
import React from "react";
import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom";
import Dashboard from "./Dashboard";
import SignIn from "./login-signup/Signin";
import Home from "./pages/Home";
import Document from "./pages/Documents/Document";
import ChatsTasks from "./pages/chats&tasks/ChatsTasks";
import Organizers from "./pages/Organizers";
import Proposals from "./pages/proposals/Proposals";
import UpdateChat from "./pages/chats&tasks/UpdateChat";
const App = () => {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/" element={<Dashboard />}>
            <Route path="/home" element={<Home />} />
            <Route path="/document" element={<Document />} />
            <Route path="/chatstasks" element={<ChatsTasks />} />
            <Route path="/updatechat/:_id" element={<UpdateChat/>} />

            <Route path="/organizers" element={<Organizers />} />

            <Route path="/proposalsels" element={<Proposals />} />
            {/* <Route path="*" element={<Navigate to="/home" replace />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
