import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";
import { useNavigate } from "react-router-dom"
import * as React from 'react'
import { Card, CardMedia, Modal, CircularProgress, OutlinedInput, InputAdornment, IconButton, DialogContentText, Button, DialogActions, Dialog, DialogTitle, DialogContent, Typography, Box, TextField, InputLabel, FormControl } from '@mui/material'
import { green } from "@mui/material/colors";
import CheckIcon from '@mui/icons-material/Check';

// Admin panel React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import MDSnackbar from "components/MDSnackbar";
import MDAvatar from "components/MDAvatar";

// Admin panel React context
import { useMaterialUIController } from "context";

//firestore
import { db, storage } from "../.../../../../firebase"
import { doc, deleteDoc, getDoc, collection, query, where, getDocs, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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

//Modal Style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: '1rem',
  boxShadow: 24,
};

function Bill({ name, contactNo, address, image, noGutter, dataId }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const [bankModal, setBankModal] = React.useState(false);
  const [bankImageModal, setBankImageModal] = React.useState(false);
  const [bankNotification, setBankNotification] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [imageProgress, setImageProgress] = React.useState(0);
  const [imageProgressValue, setImageProgressValue] = React.useState(0);
  const [discountsId, setDiscountsId] = React.useState('')
  const [dbBanksData, setDbBanksData] = React.useState({})
  const [bankFile, setBankFile] = React.useState('')
  const navigate = useNavigate()

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
            setDbBanksData((prev) => ({
              ...prev,
              image: downloadURL
            }))
          });
        }
      );

    }
    bankFile && uploadBankFile()
  }, [bankFile])

  const fetchDataById = async (dataId) => {
    // get data from firestore
    try {
      const getBrands = await getDoc(doc(db, "banks", dataId));
      if (getBrands.exists()) {
        setDbBanksData(getBrands.data())
      } else {
        console.log("No such document!");
      }
      const query2 = query(collection(db, "discounts"), where("bank.uid", "==", dataId));
      const querySnapshotCarousel = await getDocs(query2);
      querySnapshotCarousel.forEach((doc) => {
        setDiscountsId(doc.id)
      })
    } catch (error) {
      console.log('error == ', error)
    }
  };
  React.useEffect(() => {
    fetchDataById(dataId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataId])

  const deleteById = async (dataId) => {
    // delete data from firestore
    try {
      if (dataId) {
        const reference = doc(db, 'banks', dataId)
        await deleteDoc(reference)
      }
      if (discountsId) {
        const reference = doc(db, 'discounts', discountsId)
        await deleteDoc(reference)
      }
      navigate("/admin/banks")
    } catch (error) {
      console.log('error == ', error)
    }
  };
  React.useEffect(() => {
  }, [dataId])

  const onUpdateBank = async (e) => {
    e.preventDefault()
    //put data into firestore
    const updateData = {
      name: dbBanksData.nametoLowerCase().replace(/\s+/g, '').trim(),
      contactNo: dbBanksData.contactNo,
      address: dbBanksData.address,
      image: dbBanksData.image
    }
    try {
      setLoading(true)
      if (dataId) {
        const banksDocRef = doc(db, "banks", dataId)
        await setDoc(banksDocRef, updateData, { merge: true })
      }
      if (discountsId) {
        const carouselDocRef = doc(db, "discounts", discountsId)
        await setDoc(carouselDocRef, { bank: updateData }, { merge: true })
      }
      bankModalClose()
      bankNotificationOpen()
      setImageProgress(0)
      setImageProgressValue(0)
    }
    catch (error) {
      setError(error.code)
      setLoading(false)
    }
  }

  const deleteAlertOpen = () => setDeleteAlert(true);
  const deleteAlertClose = () => setDeleteAlert(false);
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
  const bankImageModalOpen = () => setBankImageModal(true);
  const bankImageModalClose = () => setBankImageModal(false);
  return (
    <>
      <MDSnackbar
        color="success"
        icon="check"
        title="Successfully Update"
        // content="Hello, world! This is a bankNotification message"
        // dateTime="11 mins ago"
        open={bankNotification}
        onClose={bankNotificationClose}
        close={bankNotificationClose}
      />
      <Dialog
        open={deleteAlert}
        onClose={deleteAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Alert"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteAlertClose}>Cancel</Button>
          <Button sx={{ color: 'error.main' }} onClick={() => { deleteById(dataId) }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <BootstrapDialog
        onClose={bankModalClose}
        aria-labelledby="customized-dialog-title"
        open={bankModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={bankModalClose}>
          <Typography variant="h3" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>Edit</Typography>
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
              color="secondary"
              required
              value={dbBanksData.name}
              onChange={(e) => setDbBanksData({
                ...dbBanksData,
                name: e.target.value
              })}
            />
            <TextField
              label="Contact Number"
              type="number"
              color="secondary"
              required
              value={dbBanksData.contactNo}
              onChange={(e) => setDbBanksData({
                ...dbBanksData,
                contactNo: e.target.value
              })}
            />
            <TextField
              label="Website URL"
              type="url"
              color="secondary"
              required
              value={dbBanksData.address}
              onChange={(e) => setDbBanksData({
                ...dbBanksData,
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
              onClick={onUpdateBank}
            >Update</MDButton>
          }
        </DialogActions>
      </BootstrapDialog>

      <Modal
        open={bankImageModal}
        onClose={bankImageModalClose}
        aria-labelledby="bankImageModal-bankImageModal-title"
        aria-describedby="bankImageModal-bankImageModal-description"
      >
        <Box sx={style}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "transparent",
              boxShadow: "none",
              overflow: "visible",
            }}
          >
            <MDBox position="relative" width="100.25%" shadow="xl" borderRadius="xl">
              <CardMedia
                src={image}
                component="img"
                title="Bank Image"
                sx={{
                  maxWidth: "100%",
                  margin: 0,
                  boxShadow: ({ boxShadows: { md } }) => md,
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </MDBox>
          </Card>
        </Box>
      </Modal>
      <MDBox
        component="li"
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        bgColor={darkMode ? "transparent" : "grey-100"}
        borderRadius="lg"
        p={3}
        mb={noGutter ? 0 : 1}
        mt={2}
      >
        <MDBox width="100%" display="flex" flexDirection="column">
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
            mb={2}
          >
            <MDTypography variant="caption" color="text">
              Bank Name:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
                {name}
              </MDTypography>
            </MDTypography>

            <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
              <MDBox mr={1}>
                <MDButton variant="text" color="error" onClick={deleteAlertOpen}>
                  <Icon>delete</Icon>&nbsp;delete
                </MDButton>
              </MDBox>
              <MDButton variant="text" color={darkMode ? "white" : "dark"} onClick={bankModalOpen}>
                <Icon>edit</Icon>&nbsp;edit
              </MDButton>
            </MDBox>

          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Contact Number:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                {contactNo}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={0} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Address:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {address}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={0} lineHeight={0} display="flex" flexDirection="row" alignItems="center">
            <MDTypography variant="caption" color="text">
              Image:&nbsp;&nbsp;&nbsp;
            </MDTypography>
            <MDAvatar sx={{ cursor: "pointer" }} onClick={bankImageModalOpen} src={image} size="sm" />
          </MDBox>
        </MDBox>
      </MDBox>
    </>
  );
}

// Setting default values for the props of Bill
Bill.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Bill
Bill.propTypes = {
  name: PropTypes.string.isRequired,
  contactNo: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Bill;
