// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox"
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import { CircularProgress, OutlinedInput, InputAdornment, IconButton, DialogActions, Dialog, DialogTitle, DialogContent, Typography, Box, TextField, InputLabel, FormControl } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import CheckIcon from '@mui/icons-material/Check';

// Admin panel React example components
import * as React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDSnackbar from "components/MDSnackbar";

// Data
import banksNameTable from "layouts/banks/data/banksNameTable";

//firestore 
import { db, storage } from "../../firebase"
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { green } from "@mui/material/colors";

//modal Styles
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function Banks() {
  const { columns, rows } = banksNameTable();
  const [bankModal, setBankModal] = React.useState(false);
  const [bankNotification, setBankNotification] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [imageProgress, setImageProgress] = React.useState(0);
  const [imageProgressValue, setImageProgressValue] = React.useState(0);
  const [bankFile, setBankFile] = React.useState('')
  const [banksData, setBanksData] = React.useState({
    name: '',
    contactNo: '',
    address: '',
  })

  // bankFile upload
  React.useEffect(() => {
    const uploadBankFile = () => {
      const name = bankFile.name
      const storageRef = ref(storage, `banks/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, bankFile);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageProgress(progress)
          setImageProgressValue(progress)
        },
        (error) => {
          console.log("ERROR == ", error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setBanksData((prev) => ({
              ...prev,
              image: downloadURL
            }))
          });
        }
      );

    }
    bankFile && uploadBankFile()
  }, [bankFile])

  const onAddBank = async (e) => {
    e.preventDefault()
    //post data into firestore
    try {
      setLoading(true)
      const docId = await addDoc(collection(db, "banks"), {
        name: banksData.name.toLowerCase().replace(/\s+/g, '').trim(),
        contactNo: banksData.contactNo,
        address: banksData.address,
        image: banksData.image,
        cards: []
      })
      const updateData = {
        uid: docId.id
      }
      const DocRef = doc(db, "banks", docId.id)
      await setDoc(DocRef, updateData, { merge: true })
      bankModalClose()
      bankNotificationOpen()
      setBanksData({
        name: '',
        contactNo: '',
        address: '',
      })
      setImageProgress(0)
      setImageProgressValue(0)
    }
    catch (error) {
      setError(error.code)
      setLoading(false)
    }
  }

  const bankModalOpen = () => setBankModal(true);
  const bankModalClose = () => {
    setBankModal(false)
    setLoading(false)
    setError('')
    setImageProgress(0)
    setImageProgressValue(0)
  };
  const bankNotificationOpen = () => setBankNotification(true);
  const bankNotificationClose = () => setBankNotification(false);
  return (
    <>
      <MDSnackbar
        color="success"
        icon="check"
        title="Successfully Add"
        // content="Hello, world! This is a bankNotification message"
        // dateTime="11 mins ago"
        open={bankNotification}
        onClose={bankNotificationClose}
        close={bankNotificationClose}
      />
      <BootstrapDialog
        onClose={bankModalClose}
        aria-labelledby="customized-dialog-title"
        open={bankModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={bankModalClose}>
          <Typography variant="h3" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>Add Bank</Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 2, maxWidth: "100%", display: "flex", direction: "column", justifyContent: "center" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Bank Name"
              type="text"
              rows={1}
              color="secondary"
              required
              value={banksData.name}
              onChange={(e) => setBanksData({
                ...banksData,
                name: e.target.value
              })}
            />
            <TextField
              label="Contact Number"
              type="number"
              rows={1}
              color="secondary"
              required
              value={banksData.contactNo}
              onChange={(e) => setBanksData({
                ...banksData,
                contactNo: e.target.value
              })}
            />
            <TextField
              label="Website URL"
              type="url"
              rows={1}
              color="secondary"
              required
              value={banksData.address}
              onChange={(e) => setBanksData({
                ...banksData,
                address: e.target.value
              })}
            />
            <Box sx={{ maxWidth: "100%", m: 2 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount">Bank Image</InputLabel>
                <OutlinedInput
                  sx={{ height: "2.8rem" }}
                  id="outlined-adornment-amount"
                  startAdornment={<><InputAdornment position="start">
                    <input multiple type="File"
                      onChange={(e) => setBankFile(e.target.files[0])}
                    />
                  </InputAdornment>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        size={25}
                        sx={{
                          color: green[500],
                        }}
                        value={imageProgress} />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {imageProgressValue === 100 ? <CheckIcon /> : null}
                      </Box>
                    </Box></>}
                  label="Bank Image"
                />
              </FormControl>
            </Box>
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          {loading ?
            <CircularProgress
              size={30}
              sx={{
                color: green[500],
              }}
            /> : <MDButton variant="contained" color="info" type="submit"
              // disabled={banksData.name === '' || banksData.contactNo === '' || banksData.address === '' || banksData.image === '' ? true : false}
              onClick={onAddBank}
            >Save</MDButton>
          }
        </DialogActions>
      </BootstrapDialog>

      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <MDBox>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <MDBox pt={2} pb={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                      <MDTypography variant="h6" fontWeight="medium" color="white">
                        All Banks
                      </MDTypography>
                      <MDButton variant="gradient" color="light"
                        onClick={() => {
                          bankModalOpen()
                        }}>
                        <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                        &nbsp;ADD BANK
                      </MDButton>
                    </MDBox>
                  </MDBox>
                  <MDBox pt={3}>
                    <DataTable
                      table={{ columns, rows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}

export default Banks;
