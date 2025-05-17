// import React, { useState, useEffect } from "react";
// import Box from "@mui/material/Box";
// import Paper from "@mui/material/Paper";
// import { Stack, Typography } from "@mui/material";

// const ProposalsList = () => {
//   const [proposals, setProposals] = useState([]);
//   const fetchPrprosalsAllData = async () => {
//     try {
//       const url =
//         "http://127.0.0.1/proposalandels/proposalaccountwise/allproposallist/list";

//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error("Failed to fetch Proposals templates");
//       }
//       const result = await response.json();
//       console.log(result.proposalesandelsAccountwise);
//       setProposals(result.proposalesandelsAccountwise || []);
//     } catch (error) {
//       console.error("Error fetching Proposals  templates:", error);
//     }
//   };
//   useEffect(() => {
//     fetchPrprosalsAllData();
//   }, []);
//   return (
//     <>
//       {proposals.length > 0 && (
//         <Box>
//           <Stack
//             sx={{
//               p: 0,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               flexDirection: "row",
//             }}
//           >
//             <Typography
//               component="h2"
//               variant="subtitle2"
//               gutterBottom
//               sx={{ fontWeight: "600" }}
//             >
//               Proposals & ELs ({proposals.length})
//             </Typography>
//           </Stack>
//           <Box mt={2}>
//             <Stack mb={1.5}>
//               <Paper sx={{ p: 3 }}>one</Paper>
//             </Stack>
//             <Stack mb={1.5}>
//               <Paper sx={{ p: 3 }}>one</Paper>
//             </Stack>
//           </Box>
//         </Box>
//       )}
//     </>
//   );
// };

// export default ProposalsList;

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Stack, Typography, Link } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

const ProposalsList = () => {
  const [proposals, setProposals] = useState([]);

  const fetchProposalsAllData = async () => {
    try {
      const url =
        "http://127.0.0.1/proposalandels/proposalaccountwise/allproposallist/list";

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch Proposals templates");
      }
      const result = await response.json();
      console.log(result.proposalesandelsAccountwise);
      setProposals(result.proposalesandelsAccountwise || []);
    } catch (error) {
      console.error("Error fetching Proposals templates:", error);
    }
  };

  useEffect(() => {
    fetchProposalsAllData();
  }, []);

  return (
    <>
      {proposals.length > 0 && (
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
              Proposals & ELs ({proposals.length})
            </Typography>
          </Stack>
          <Box mt={2}>
            {proposals.map((proposal, index) => (
              <Stack key={index} mb={1.5}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    transition: "all 0.3s",
                    cursor: "pointer",
                    "&:hover .sign-link": {
                      opacity: 1,
                      visibility: "visible",
                      textDecoration: "none",
                      cursor: "pointer",
                    },
                  }}
                >
                  <Typography component="h2" variant="subtitle2" gutterBottom>
                    Review and sign
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <DescriptionIcon
                        fontSize="small"
                        sx={{ color: "#f0c000" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", cursor: "pointer" }}
                      >
                        {proposal.proposalname || "Engagement proposal"}
                      </Typography>
                    </Box>
                    <Typography
                      className="sign-link"
                      color="primary"
                      variant="subtitle2"
                      component="p"
                      fontWeight="600"
                      sx={{
                        fontSize: 14,
                        opacity: 0,
                        visibility: "hidden",
                        transition: "all 0.3s",
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                      Sign
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProposalsList;
