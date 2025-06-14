// import React from "react";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Input,
//   Stack,
//   Grid,
//   Divider,
//   Paper,
// } from "@mui/material";
// import { LoginContext } from "../../context/Context";
// import FileExplorer from "./FileExplorer";
// import { HiDocumentArrowUp } from "react-icons/hi2";
// import { useState, useContext, useEffect } from "react";
// import { FaRegFolderClosed } from "react-icons/fa6";
// import UploadDoc from "./UplodDoc";
// import CreateFolderInFirm from "./CreateFolder";
// import axios from "axios";
// const Document = () => {
//   const { logindata } = useContext(LoginContext);
//   const [loginuserid, setLoginUserId] = useState("");
//   const [accId, setAccId] = useState("");
//   useEffect(() => {
//     if (logindata?.user?.id) {
//       const id = logindata.user.id;
//       setLoginUserId(id);
//       fetchAccountId(id);
//     }
//   }, [logindata]);

//   const fetchAccountId = (id) => {
//     let config = {
//       method: "get",
//       maxBodyLength: Infinity,
//       url: `http://127.0.0.1/accounts/accountdetails/accountdetailslist/listbyuserid/${id}`,
//       headers: {},
//     };

//     axios
//       .request(config)
//       .then((response) => {
//         setAccId(response.data.accounts[0]._id);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };
//   const [file, setFile] = useState(null);
//   const [uploadDocOpen, setUplaodDocOpen] = useState(false);
//   const [isFolderCreate, setIsFolderCreate] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const handleNewFileChange = (e) => setFile(e.target.files[0]);
//   const handleOpenDrawer = () => setUplaodDocOpen(true);
//   const handleNewFolderClick = () => setIsFolderCreate((prev) => !prev);
//   return (
//     <Box
//       sx={{
//         width: "100%",
//         maxWidth: { sm: "100%", md: "1700px" },
//         flexGrow: 1,
//         height: "90vh",
//         p: 1,
//       }}
//     >
//       <Box>
//         <Box>
//           <Stack sx={{ height: "auto" }}>
//             {/* <Box sx={{ flexGrow: 1, p: 2 }}> */}
//             <Grid container spacing={2} sx={{ p: 1 }}>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Stack>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                     <IconButton
//                       component="label"
//                       htmlFor="firmDocFileInput"
//                       sx={{ color: "#e87800" }}
//                     >
//                       <HiDocumentArrowUp size={24} />
//                     </IconButton>
//                     <Typography
//                       variant="body1"
//                       component="label"
//                       htmlFor="firmDocFileInput"
//                       sx={{ cursor: "pointer" }}
//                     >
//                       Upload Document in firm
//                     </Typography>
//                     <Input
//                       type="file"
//                       id="firmDocFileInput"
//                       onChange={(e) => {
//                         handleNewFileChange(e);
//                         handleOpenDrawer();
//                       }}
//                       sx={{ display: "none" }}
//                     />
//                   </Box>
//                 </Stack>
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Stack>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                     <IconButton sx={{ color: "#e87800" }}>
//                       <FaRegFolderClosed size={20} />
//                     </IconButton>
//                     <Typography variant="body1" sx={{ cursor: "pointer" }}>
//                       Create Folder in firm
//                     </Typography>
//                   </Box>
//                 </Stack>
//               </Grid>
//             </Grid>
//           </Stack>
//         </Box>
//         <Box mt={2}>
//           {/* <FileExplorer accountId={data}/> */}
//           <FileExplorer accountId={accId} refreshTrigger={refreshKey} />
//         </Box>

//         {/* FIRM DOCS SHARED WITH CLIENT UPLOAD DOC DRAWER */}
//         <UploadDoc
//           open={uploadDocOpen}
//           onClose={() => setUplaodDocOpen(false)}
//           file={file}
//           accountId={accId}
//           onUploadSuccess={() => setRefreshKey((prev) => prev + 1)}
//         />
//         {/* FIRM DOCS SHARED WITH CLIENT CREATE FOLDER DRAWER */}
//         <CreateFolderInFirm
//           open={isFolderCreate}
//           onClose={() => setIsFolderCreate(false)}
//           accountId={accId}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default Document;

import React from 'react'

const Document = () => {
  return (
    <div>Document</div>
  )
}

export default Document