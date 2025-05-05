import React from 'react'
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {  Stack, Typography } from "@mui/material";

const BillingList = () => {
  return (
    <>
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
              Billing
            </Typography>
          </Stack>
          <Box mt={2}>
            <Stack mb={1.5}>
              <Paper sx={{ p: 3 }}>
                <Typography
                  variant="subtitle2"
                  component="p"
                  sx={{ flexGrow: 1 }}
                >
                  Pay Invoice
                </Typography>
              </Paper>
            </Stack>
            <Stack mb={1.5}>
              <Paper sx={{ p: 3 }}>
                <Typography
                  variant="subtitle2"
                  component="p"
                  sx={{ flexGrow: 1 }}
                >
                  Pay Invoice
                </Typography>
              </Paper>
            </Stack>
          </Box>

    </>
  )
}

export default BillingList