import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";
import { useNavigate } from "react-router-dom"
import * as React from 'react'
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Card, CardMedia, Modal, CircularProgress, OutlinedInput, DialogContentText, InputAdornment, IconButton, DialogActions, Dialog, DialogTitle, TextField, DialogContent, Typography, Box, InputLabel, FormControl } from '@mui/material'
import { green } from "@mui/material/colors";
import CheckIcon from '@mui/icons-material/Check';

// Admin panel React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDSnackbar from "components/MDSnackbar";
import MDAvatar from "components/MDAvatar";

// Admin panel React context
import { useMaterialUIController } from "context";

//firestore
import { db, storage } from "../../../firebase"
import { doc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
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

function Bill({ brand, title, percentage, saleURL, saleStart, saleEnd, banner, poster, noGutter, dataId }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [brandsSaleModal, setBrandsSaleModal] = React.useState(false);
  const [bannerModal, setBannerModal] = React.useState(false);
  const [posterModal, setPosterModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [posterImageProgress, setPosterImageProgress] = React.useState(0);
  const [posterImageProgressValue, setPosterImageProgressValue] = React.useState(0);
  const [bannerImageProgress, setBannerImageProgress] = React.useState(0);
  const [bannerImageProgressValue, setBannerImageProgressValue] = React.useState(0);
  const [brandsSaleNotification, setBrandsSaleNotification] = React.useState(false);
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const [selectedBrandName, setSelectedBrandName] = React.useState({})
  const [posterFile, setPosterFile] = React.useState('')
  const [bannerFile, setBannerFile] = React.useState('')
  const [dbSalesData, setDbSalesData] = React.useState({})
  const navigate = useNavigate()
  const role = JSON.parse(localStorage.getItem("role"))

  // posterFile upload
  React.useEffect(() => {
    const uploadPosterFile = () => {
      const name = new Date().getTime + posterFile.name
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, posterFile);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPosterImageProgress(progress)
          setPosterImageProgressValue(progress)
        },
        (error) => {
          console.log("ERROR == ", error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDbSalesData((prev) => ({
              ...prev,
              poster: downloadURL
            }))
          });
        }
      );

    }
    posterFile && uploadPosterFile()
  }, [posterFile])

  // bannerFile upload
  React.useEffect(() => {
    const uploadBannerFile = () => {
      const name = new Date().getTime + bannerFile.name
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, bannerFile);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setBannerImageProgress(progress)
          setBannerImageProgressValue(progress)
        },
        (error) => {
          console.log("ERROR == ", error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDbSalesData((prev) => ({
              ...prev,
              banner: downloadURL
            }))
          });
        }
      );

    }
    bannerFile && uploadBannerFile()
  }, [bannerFile])

  const deleteById = async (dataId) => {
    // delete data from firestore
    try {
      const reference = doc(db, 'sales', dataId)
      await deleteDoc(reference)
      navigate(`/${role}/addSale`)
    } catch (error) {
      console.log('error == ', error)
    }
  };
  React.useEffect(() => {
  }, [dataId])

  const fetchSpecificBrand = async (dataId) => {
    // get data from database
    const brandName = doc(db, "sales", dataId)
    const getSpecificBrandName = await getDoc(brandName);
    if (getSpecificBrandName.exists()) {
      setSelectedBrandName(getSpecificBrandName.data().brand)
    } else {
      console.log("No such document!");
    }
  };
  React.useEffect(() => {
    fetchSpecificBrand(dataId)
  }, [dataId])

  const fetchDataById = async (dataId) => {
    // get data from firestore
    try {
      const getBrands = await getDoc(doc(db, "sales", dataId));
      if (getBrands.exists()) {
        setDbSalesData(getBrands.data())
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log('error == ', error)
    }
  };
  React.useEffect(() => {
    fetchDataById(dataId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataId])

  const onUpdateSales = async (e) => {
    e.preventDefault()
    //update data into firestore
    const updateData = {
      title: dbSalesData.title,
      percentage: dbSalesData.percentage,
      startDate: dbSalesData.startDate,
      endDate: dbSalesData.endDate,
      saleURL: dbSalesData.saleURL,
      location: dbSalesData.location,
      poster: dbSalesData.poster,
      banner: dbSalesData.banner,
      createdAt: Date.now(),
      status: 'active'
    }
    try {
      setLoading(true)
      const docRef = doc(db, "sales", dataId)
      await setDoc(docRef, updateData, { merge: true })
      salesModalClose()
      brandsSaleNotificationOpen()
      setPosterImageProgress(0)
      setPosterImageProgressValue(0)
      setBannerImageProgress(0)
      setBannerImageProgressValue(0)
    }
    catch (error) {
      setError(error.code)
      setLoading(false)
    }
  }

  const deleteAlertOpen = () => setDeleteAlert(true);
  const deleteAlertClose = () => setDeleteAlert(false);
  const salesModalOpen = () => setBrandsSaleModal(true);
  const salesModalClose = () => {
    setBrandsSaleModal(false)
    setLoading(false)
    setError('')
    setPosterImageProgress(0)
    setPosterImageProgressValue(0)
    setBannerImageProgress(0)
    setBannerImageProgressValue(0)
  };
  const brandsSaleNotificationOpen = () => setBrandsSaleNotification(true);
  const brandsSaleNotificationClose = () => setBrandsSaleNotification(false);
  const bannerModalOpen = () => setBannerModal(true);
  const bannerModalClose = () => setBannerModal(false);
  const posterModalOpen = () => setPosterModal(true);
  const posterModalClose = () => setPosterModal(false);

  return (
    <>
      <MDSnackbar
        color="success"
        icon="check"
        title="Successfully Update"
        // content="Hello, world! This is a brandsSaleNotification message"
        // dateTime="11 mins ago"
        open={brandsSaleNotification}
        onClose={brandsSaleNotificationClose}
        close={brandsSaleNotificationClose}
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
          <Button sx={{ color: 'error.main' }} onClick={() => deleteById(dataId)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <BootstrapDialog
        onClose={salesModalClose}
        aria-labelledby="customized-dialog-title"
        open={brandsSaleModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={salesModalClose}>
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
            <MDInput
              label="Brand"
              InputProps={{
                readOnly: true,
              }}
              color="secondary"
              required
              value={selectedBrandName.name}
            />
            <MDInput
              type="text"
              label="Sale Title"
              required
              value={dbSalesData.title}
              onChange={(e) => setDbSalesData({
                ...dbSalesData,
                title: e.target.value
              })}
            />
            <MDInput
              type="text"
              label="Sale Percentage"
              required
              value={dbSalesData.percentage}
              onChange={(e) => setDbSalesData({
                ...dbSalesData,
                percentage: e.target.value
              })}
            />
            <MDInput
              type="date"
              label="Sale Starts"
              InputLabelProps={{
                shrink: true,
              }}
              value={dbSalesData.startDate}
              onChange={(e) => setDbSalesData({
                ...dbSalesData,
                startDate: e.target.value
              })}
            />
            <MDInput
              type="date"
              label="Sale Expires"
              InputLabelProps={{
                shrink: true,
              }}
              value={dbSalesData.endDate}
              onChange={(e) => setDbSalesData({
                ...dbSalesData,
                endDate: e.target.value
              })}
            />
            <MDInput
              type="url"
              label="Website"
              required
              value={dbSalesData.saleURL}
              onChange={(e) => setDbSalesData({
                ...dbSalesData,
                saleURL: e.target.value
              })}
            />
            <MDInput
              type="text"
              label="Location"
              required
              value={dbSalesData.location}
              onChange={(e) => setDbSalesData({
                ...dbSalesData,
                location: e.target.value
              })}
            />
            <Box sx={{ maxWidth: "100%", m: 2 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount" >Poster</InputLabel>
                <OutlinedInput
                  sx={{ height: "2.8rem" }}
                  id="outlined-adornment-amount"
                  startAdornment={<><InputAdornment position="start">
                    <input multiple type="file"
                      onChange={(e) => setPosterFile(e.target.files[0])}
                    />
                  </InputAdornment>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        size={25}
                        sx={{
                          color: green[500],
                        }}
                        value={posterImageProgress} />
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
                        {posterImageProgressValue === 100 ? <CheckIcon /> : null}
                      </Box>
                    </Box></>}
                  label="Poster"
                />
              </FormControl>
            </Box>
            <Box sx={{ maxWidth: "100%", m: 2 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount" >Banner</InputLabel>
                <OutlinedInput
                  sx={{ height: "2.8rem" }}
                  id="outlined-adornment-amount"
                  startAdornment={<><InputAdornment position="start">
                    <input multiple type="file"
                      onChange={(e) => setBannerFile(e.target.files[0])}
                    />
                  </InputAdornment>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        size={25}
                        sx={{
                          color: green[500],
                        }}
                        value={bannerImageProgress} />
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
                        {bannerImageProgressValue === 100 ? <CheckIcon /> : null}
                      </Box>
                    </Box></>}
                  label="Banner"
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
            <MDBox mt={1} p={1} sx={{ display: 'flex', direction: 'row', justifyContent: "center" }}>
              {loading ?
                <CircularProgress
                  size={30}
                  sx={{
                    color: green[500],
                  }}
                /> : <MDButton variant="contained" color="info" type="submit"
                  onClick={onUpdateSales}
                >Update</MDButton>
              }
            </MDBox>
          </Box>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </BootstrapDialog>

      <Modal
        open={bannerModal}
        onClose={bannerModalClose}
        aria-labelledby="bannerModal-bannerModal-title"
        aria-describedby="bannerModal-bannerModal-description"
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
                src={banner}
                component="img"
                title="Banner"
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
      <Modal
        open={posterModal}
        onClose={posterModalClose}
        aria-labelledby="bannerModal-bannerModal-title"
        aria-describedby="bannerModal-bannerModal-description"
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
                src={poster}
                component="img"
                title="Poster"
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
              Brand Name:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
                {brand}
              </MDTypography>
            </MDTypography>

            <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
              <MDBox mr={1}>
                <MDButton variant="text" color="error" onClick={deleteAlertOpen}>
                  <Icon>delete</Icon>&nbsp;delete
                </MDButton>
              </MDBox>
              <MDButton variant="text" color={darkMode ? "white" : "dark"} onClick={salesModalOpen}>
                <Icon>edit</Icon>&nbsp;edit
              </MDButton>
            </MDBox>

          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Sale Title:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                {title}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Sale Percentage:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {percentage}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Sale Website:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {saleURL}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Sale Start:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {saleStart}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={0} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Sale End:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {saleEnd}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={0} lineHeight={0} display="flex" flexDirection="row" alignItems="center">
            <MDTypography variant="caption" color="text">
              Sale Banner Image:&nbsp;&nbsp;&nbsp;
            </MDTypography>
            <MDAvatar sx={{ cursor: "pointer" }} onClick={bannerModalOpen} src={banner} size="sm" />
          </MDBox>
          <MDBox mb={0} lineHeight={0} display="flex" flexDirection="row" alignItems="center">
            <MDTypography variant="caption" color="text">
              Sale Poster Image:&nbsp;&nbsp;&nbsp;
            </MDTypography>
            <MDAvatar sx={{ cursor: "pointer" }} onClick={posterModalOpen} src={poster} size="sm" />
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
  brand: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  percentage: PropTypes.string.isRequired,
  saleURL: PropTypes.string.isRequired,
  banner: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Bill;
