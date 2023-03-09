import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";
import { useNavigate } from "react-router-dom"
import * as React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Card, CardMedia, Modal, CircularProgress, OutlinedInput, DialogContentText, InputAdornment, IconButton, DialogActions, Dialog, DialogTitle, Button, DialogContent, Typography, Box, TextField, InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { green } from "@mui/material/colors";
import CheckIcon from '@mui/icons-material/Check';

// Admin panel React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import MDAvatar from "components/MDAvatar";

// Admin panel React context
import { useMaterialUIController } from "context";

//firestore
import { db, storage } from "../../../firebase"
import { doc, deleteDoc, getDoc, collection, query, where, getDocs, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";
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
function Bill({ name, contactNo, website, category, logo, noGutter, dataId }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [brandsModal, setBrandsModal] = React.useState(false);
  const [bankLogoModal, setBankLogoModal] = React.useState(false);
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const [brandsNotification, setBrandsNotification] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [imageProgress, setImageProgress] = React.useState(0);
  const [imageProgressValue, setImageProgressValue] = React.useState(0);
  const [categoriesDropdown, setCategoriesDropdown] = React.useState([])
  const [file, setFile] = React.useState('')
  const [saleId, setSaleId] = React.useState('')
  const [carouselId, setCarouselId] = React.useState('')
  const [discountsId, setDiscountsId] = React.useState('')
  const [carouselData, setCarouselData] = React.useState({})
  const [dbBrandsData, setDbBrandsData] = React.useState({})
  const navigate = useNavigate()

  //file upload
  React.useEffect(() => {
    const uploadFile = () => {
      const name = file.name
      const storageRef = ref(storage, `brands/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
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
            setDbBrandsData((prev) => ({
              ...prev,
              logo: downloadURL
            }))
          });
        }
      );

    }
    file && uploadFile()
  }, [file])

  const fetchDataById = async (dataId) => {
    // get data from firestore
    try {
      const getBrands = await getDoc(doc(db, "brands", dataId));
      if (getBrands.exists()) {
        setDbBrandsData(getBrands.data())
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

  const fetchAllBrandsCategories = async () => {
    // get data from database
    try {
      const getAllDocs = await getDocs(collection(db, "categories"));
      const dbData = getAllDocs.docs.map((items) => ({ id: items.id, ...items.data() }))
      let allCategories = dbData.map((filterItems) => {
        return {
          id: filterItems.id,
          name: filterItems.name,
        }
      })
      setCategoriesDropdown(allCategories)
    } catch (error) {
      console.log('error == ', error)
    }
  };
  React.useEffect(() => {
    fetchAllBrandsCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAllSalesBrandCarousels = async () => {
    // get data from database
    try {
      const q = query(collection(db, "sales"), where("brand.uid", "==", dataId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setSaleId(doc.id)
        setCarouselData(doc.data())
      });
      const getAllDocs = await getDocs(collection(db, "carousels"));
      const dbData = getAllDocs.docs.map((items) => ({ id: items.id }))
      let carouselIdObj = {}
      for (let i = 0; i < dbData.length; i++) {
        Object.assign(carouselIdObj, dbData[i]);
      }
      setCarouselId(carouselIdObj.id)
      const query2 = query(collection(db, "discounts"), where("brand.uid", "==", dataId));
      const querySnapshotCarousel = await getDocs(query2);
      querySnapshotCarousel.forEach((doc) => {
        setDiscountsId(doc.id)
      })
    } catch (error) {
      console.log('error == ', error)
    }
  };
  React.useEffect(() => {
    fetchAllSalesBrandCarousels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataId])

  const deleteById = async (dataId) => {
    // delete data from firestore
    const deleteData = {
      carousels: arrayRemove({ sale: carouselData })
    }
    try {
      if (dataId) {
        const reference = doc(db, 'brands', dataId)
        await deleteDoc(reference)
      }
      if (saleId) {
        const reference = doc(db, 'sales', saleId)
        await deleteDoc(reference)
      }
      if (carouselId) {
        const delDocRef = doc(db, "carousels", carouselId)
        await setDoc(delDocRef, deleteData, { merge: true })
      }
      if (discountsId) {
        const reference = doc(db, 'discounts', discountsId)
        await deleteDoc(reference)
      }
      navigate("/admin/brands")
    } catch (error) {
      console.log('error == ', error)
    }
  };
  React.useEffect(() => {
  }, [dataId])

  const onUpdateBrand = async (e) => {
    e.preventDefault()
    //update data into firestore
    const updateData = {
      name: dbBrandsData.name,
      contactNo: dbBrandsData.contactNo,
      website: dbBrandsData.website,
      category: dbBrandsData.category,
      logo: dbBrandsData.logo
    }
    const deleteCarouselData = {
      carousels: arrayRemove({ sale: carouselData })
    }
    const updateCarouselData = {
      carousels: arrayUnion({
        sale: {
          brand: updateData,
          title: carouselData.title,
          percentage: carouselData.percentage,
          startDate: carouselData.startDate,
          endDate: carouselData.endDate,
          saleURL: carouselData.saleURL,
          location: carouselData.location,
          poster: carouselData.poster,
          banner: carouselData.banner,
          createdAt: carouselData.createdAt,
          status: carouselData.status
        }
      })
    }
    try {
      setLoading(true)
      if (dataId) {
        const brandsDocRef = doc(db, "brands", dataId)
        await setDoc(brandsDocRef, updateData)
      }
      if (saleId) {
        const saleDocRef = doc(db, "sales", saleId)
        await setDoc(saleDocRef, { brand: updateData }, { merge: true })
      }
      if (carouselId) {
        const carouselDelDocRef = doc(db, "carousels", carouselId)
        await setDoc(carouselDelDocRef, deleteCarouselData, { merge: true })
        const carouselUpdDocRef = doc(db, "carousels", carouselId)
        await setDoc(carouselUpdDocRef, updateCarouselData, { merge: true })
      }
      if (discountsId) {
        const discountDocRef = doc(db, "discounts", discountsId)
        await setDoc(discountDocRef, { brand: updateData }, { merge: true })
      }
      brandsModalClose()
      brandsNotificationOpen()
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
  const brandsModalOpen = () => setBrandsModal(true);
  const brandsModalClose = () => {
    setBrandsModal(false)
    setLoading(false)
    setError('')
    setImageProgress(0)
    setImageProgressValue(0)
  };
  const brandsNotificationOpen = () => setBrandsNotification(true);
  const brandsNotificationClose = () => setBrandsNotification(false);
  const bankLogoModalOpen = () => setBankLogoModal(true);
  const bankLogoModalClose = () => setBankLogoModal(false);
  return (
    <>
      <MDSnackbar
        color="success"
        icon="check"
        title="Successfully Update"
        // content="Hello, world! This is a brandsNotification message"
        // dateTime="11 mins ago"
        open={brandsNotification}
        onClose={brandsNotificationClose}
        close={brandsNotificationClose}
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

      <Modal
        open={bankLogoModal}
        onClose={bankLogoModalClose}
        aria-labelledby="bankLogoModal-bankLogoModal-title"
        aria-describedby="bankLogoModal-bankLogoModal-description"
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
                src={logo}
                component="img"
                title="Brand Logo"
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

      <BootstrapDialog
        onClose={brandsModalClose}
        aria-labelledby="customized-dialog-title"
        open={brandsModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={brandsModalClose}>
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
              label="Brand Name"
              type="text"
              color="secondary"
              required
              value={dbBrandsData.name}
              onChange={(e) => setDbBrandsData({
                ...dbBrandsData,
                name: e.target.value
              })}
            />
            <TextField
              label="Contact Number"
              type="number"
              color="secondary"
              required
              value={dbBrandsData.contactNo}
              onChange={(e) => setDbBrandsData({
                ...dbBrandsData,
                contactNo: e.target.value
              })}
            />
            <TextField
              label="Website URL"
              type='url'
              color="secondary"
              required
              value={dbBrandsData.website}
              onChange={(e) => setDbBrandsData({
                ...dbBrandsData,
                website: e.target.value
              })}
            />
            <Box sx={{ maxWidth: "100%", m: 2 }}>
              <FormControl fullWidth >
                <InputLabel id="demo-simple-select-label" sx={{ height: "2.8rem" }} required>Select Brand Category</InputLabel>
                <Select
                  sx={{ height: "2.8rem" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Select Brand Category"
                  value={dbBrandsData.category}
                  onChange={(e) => setDbBrandsData({
                    ...dbBrandsData,
                    category: e.target.value
                  })}
                >
                  {categoriesDropdown.map((items) => {
                    return (
                      <MenuItem key={items.id} value={items.name}>{items.name}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }} >
                <InputLabel htmlFor="outlined-adornment-amount" >Brand Logo</InputLabel>
                <OutlinedInput
                  sx={{ height: "2.8rem" }}
                  id="outlined-adornment-amount"
                  startAdornment={<><InputAdornment position="start">
                    <input multiple type="file"
                      onChange={(e) => setFile(e.target.files[0])}
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
                  label="Brand Logo"
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
              onClick={onUpdateBrand}
            >Update</MDButton>
          }
        </DialogActions>
      </BootstrapDialog>

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
                {name}
              </MDTypography>
            </MDTypography>

            <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
              <MDBox mr={1}>
                <MDButton variant="text" color="error" onClick={deleteAlertOpen}>
                  <Icon>delete</Icon>&nbsp;delete
                </MDButton>
              </MDBox>
              <MDButton variant="text" color={darkMode ? "white" : "dark"} onClick={brandsModalOpen}>
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
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Website:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {website}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={0} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Category:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {category}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={0} lineHeight={0} display="flex" flexDirection="row" alignItems="center">
            <MDTypography variant="caption" color="text">
              Logo:&nbsp;&nbsp;&nbsp;
            </MDTypography>
            <MDAvatar sx={{ cursor: "pointer" }} onClick={bankLogoModalOpen} src={logo} size="sm" />
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
  website: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Bill;
