// @mui material components
import Grid from "@mui/material/Grid";

//  admin panel React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

//  admin panel React example components
import * as React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { CircularProgress, Typography, TextField, Paper, Divider, Box } from '@mui/material'
import { green } from '@mui/material/colors';

//firestore
import { db } from "../../firebase"
import { collection, addDoc } from "firebase/firestore";

function SendNotifications() {
  const [notificationAlert, setNotificationAlert] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [notificationData, setNotificationData] = React.useState('')

  const onSendNotifications = async (e) => {
    e.preventDefault()
    //post data into firestore
    try {
      setLoading(true)
      await addDoc(collection(db, "notifications"), {
        body: notificationData,
      })
      NotificationAlertOpen()
      setNotificationData('')
      setLoading(false)
    }
    catch (error) {
      setError(error.code)
      setLoading(false)
    }
  }

  const NotificationAlertOpen = () => setNotificationAlert(true);
  const NotificationAlertClose = () => setNotificationAlert(false);
  return (
    <>
      <MDSnackbar
        color="success"
        icon="check"
        title="Successfully Send"
        // content="Hello, world! This is a notificationAlert message"
        // dateTime="11 mins ago"
        open={notificationAlert}
        onClose={NotificationAlertClose}
        close={NotificationAlertClose}
      />

      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <MDBox>
            <Grid container spacing={3}>
              <Grid item xs={12} md={9} lg={12} mx={'auto'}>
                <Paper elevation={5} sx={{
                  margin: "0, auto",
                  borderRadius: "1.5rem",
                  width: '100%'
                }} >
                  <Typography variant="h3" color="secondary.main" sx={{ pt: 2, textAlign: "center" }}>Send Notifications</Typography>
                  <Divider />
                  <Box
                    component="form"
                    sx={{
                      '& .MuiTextField-root': { m: 5, maxWidth: '100%', display: 'flex', direction: 'column', justifyContent: 'center' },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <MDInput
                      label="Message"
                      multiline
                      rows={5}
                      value={notificationData}
                      onChange={(e) => setNotificationData(e.target.value)} />
                    {error === '' ? null :
                      <MDBox mb={2} p={1}>
                        <TextField
                          error
                          id="standard-error"
                          label="Error"
                          InputProps={{
                            readOnly: true,
                            sx: {
                              "& input": {
                                color: "red",
                              }
                            }
                          }}
                          // defaultValue="Invalid Data!"
                          value={error}
                          variant="standard"
                        />
                      </MDBox>}
                    <Box sx={{ display: 'flex', justifyContent: "center", pb: '1rem' }}>
                      {loading ?
                        <CircularProgress
                          size={30}
                          sx={{
                            color: green[500],
                          }}
                        /> : <MDButton variant="contained" color="info" type="submit"
                          onClick={onSendNotifications}
                        >Send</MDButton>
                      }
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}

export default SendNotifications;
