// @mui material components
import Grid from "@mui/material/Grid";

//  admin panel React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

//  admin panel React example components
import * as React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Typography, Paper, Divider, Stack, Tooltip, Avatar } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { blueGrey } from "@mui/material/colors";

//firestore
import { db } from "../../firebase"
import { collection, onSnapshot } from "firebase/firestore";

function Notifications() {
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    const fetchData = onSnapshot(collection(db, "notifications"),
      (snapshot) => {
        const notificationList = snapshot.docs.map((items) => {
          return { id: items.id, ...items.data() }
        })
        setData(notificationList)
      },
      (error) => {
        console.log("error == ", error)
      })
    return () => {
      fetchData()
    }
  }, [])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9} lg={12} mx={'auto'}>
              <Paper elevation={5} sx={{
                bgcolor: 'azure',
                margin: "0, auto",
                borderRadius: "1.5rem",
                width: '100%',
                p: 2
              }} >
                <Typography variant="h3" color="secondary.main" sx={{ pt: 2, textAlign: "center" }}>Notifications</Typography>
                <Divider />
                {data.map((items, index) => (
                  <>
                    <Paper elevation={5} sx={{ m: 2, pt: 1, borderRadius: '0.5rem', pb: 1 }}>
                      <Stack direction="row" spacing={3} sx={{ display: 'flex', alignItems: 'center', pt: 1.5, pb: 1.5, px: 1.5 }}>
                        <Typography variant="h6" color="secondary.main">{index+1}</Typography>
                        <MDInput
                          sx={{
                            width: '90%',
                          }}
                          label="Message"
                          multiline
                          focused
                          value={items.body}
                          rows={3}
                        />
                        <Tooltip title="Send" arrow>
                          <Avatar sx={{ bgcolor: blueGrey[500], cursor: 'pointer' }}>
                            <SendIcon />
                          </Avatar>
                        </Tooltip>
                      </Stack>
                    </Paper>
                  </>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Notifications;
