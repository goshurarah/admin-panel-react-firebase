// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox"
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";

import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import CloseIcon from '@mui/icons-material/Close';
import MDInput from "components/MDInput";
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { CircularProgress, TextField, OutlinedInput, InputAdornment, IconButton, DialogActions, Dialog, DialogTitle, DialogContent, Typography, Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { green } from "@mui/material/colors";
import CheckIcon from '@mui/icons-material/Check';

// Admin panel React example components
import * as React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import Footer from "examples/Footer";
import MDSnackbar from "components/MDSnackbar";
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";

// Data
import salesNameTable from "layouts/addSale/data/SalesNameTable";


//firestore
import { db, storage } from "../../firebase"
import { collection, doc, addDoc, getDoc, getDocs, where, query } from "firebase/firestore";
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

function AddSale() {
  const { columns, rows } = salesNameTable();
  const { currentUser, role } = useContext(AuthContext)
  const [brandsSaleModal, setBrandsModal] = React.useState(false);
  const [brandsSaleNotification, setBrandsSaleNotification] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [posterImageProgress, setPosterImageProgress] = React.useState(0);
  const [posterImageProgressValue, setPosterImageProgressValue] = React.useState(0);
  const [bannerImageProgress, setBannerImageProgress] = React.useState(0);
  const [bannerImageProgressValue, setBannerImageProgressValue] = React.useState(0);
  const [selectedBrand, setSelectedBrand] = React.useState('');
  const [brandsDropdown, setBrandsDropdown] = React.useState([])
  const [brandDbData, setBrandDbData] = React.useState({})
  const [posterFile, setPosterFile] = React.useState('')
  const [bannerFile, setBannerFile] = React.useState('')
  const [brandsSaleData, setBrandsSaleData] = React.useState({
    title: '',
    percentage: '',
    startDate: '',
    endDate: '',
    saleURL: '',
    location: ''
  })

  // posterFile upload
  React.useEffect(() => {
    const uploadPosterFile = () => {
      const name = posterFile.name
      const storageRef = ref(storage, `sales/${name}`);
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
            setBrandsSaleData((prev) => ({
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
      const name = bannerFile.name
      const storageRef = ref(storage, `sales/${name}`);
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
            setBrandsSaleData((prev) => ({
              ...prev,
              banner: downloadURL
            }))
          });
        }
      );

    }
    bannerFile && uploadBannerFile()
  }, [bannerFile])


  const fetchAllBrands = async (selectedBrand) => {
    // get data from database
    const getAllDocs = await getDocs(collection(db, "brands"));
    const dbData = getAllDocs.docs.map((items) => ({ id: items.id, ...items.data() }))
    let allBrands = dbData.map((filterItems) => {
      return {
        id: filterItems.id,
        name: filterItems.name,
      }
    })
    setBrandsDropdown(allBrands)

    const getSpecificBrands = await getDoc(doc(db, "brands", selectedBrand));
    if (getSpecificBrands.exists()) {
      setBrandDbData(getSpecificBrands.data())
    } else {
      console.log("No such document!");
    }
  };
  React.useEffect(() => {
    role === "admin" && fetchAllBrands(selectedBrand)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand])

  const fetchAllBrands2 = async (selectedBrand) => {
    // get data from database
    const q = query(collection(db, "users"), where("uid", "==", currentUser))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setSelectedBrand(doc.data().brandName)
    })

    const q2 = query(collection(db, "brands"), where("name", "==", selectedBrand))
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
      setBrandDbData(doc.data())
    })
  };
  React.useEffect(() => {
    role === "brand" && fetchAllBrands2(selectedBrand)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand])

  const onAddBrandSale = async (e) => {
    e.preventDefault()
    //post data into firestore
    try {
      setLoading(true)
      await addDoc(collection(db, "sales"), {
        brand: {
          name: brandDbData.name,
          contactNo: brandDbData.contactNo,
          website: brandDbData.website,
          category: brandDbData.category,
          logo: brandDbData.logo,
          uid: brandDbData.uid
        },
        title: brandsSaleData.title,
        percentage: brandsSaleData.percentage,
        startDate: brandsSaleData.startDate,
        endDate: brandsSaleData.endDate,
        saleURL: brandsSaleData.saleURL,
        location: brandsSaleData.location,
        poster: brandsSaleData.poster,
        banner: brandsSaleData.banner,
        createdAt: Date.now(),
        status: 'active'
      })
      brandsSaleModalClose()
      brandsSaleNotificationOpen()
      setBrandsSaleData({
        title: '',
        percentage: '',
        startDate: '',
        endDate: '',
        saleURL: '',
        location: ''
      })
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
  const brandsSaleModalOpen = () => setBrandsModal(true);
  const brandsSaleModalClose = () => {
    setBrandsModal(false)
    setLoading(false)
    setError('')
    setPosterImageProgress(0)
    setPosterImageProgressValue(0)
    setBannerImageProgress(0)
    setBannerImageProgressValue(0)
  };
  const brandsSaleNotificationOpen = () => setBrandsSaleNotification(true);
  const brandsSaleNotificationClose = () => setBrandsSaleNotification(false);
  return (
    <>
      <MDSnackbar
        color="success"
        icon="check"
        title="Successfully Add"
        // content="Hello, world! This is a brandsSaleNotification message"
        // dateTime="11 mins ago"
        open={brandsSaleNotification}
        onClose={brandsSaleNotificationClose}
        close={brandsSaleNotificationClose}
      />

      <BootstrapDialog
        onClose={brandsSaleModalClose}
        aria-labelledby="customized-dialog-title"
        open={brandsSaleModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={brandsSaleModalClose}>
          <Typography variant="h3" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>Add Sale</Typography>
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
            {role === 'admin' ? <Box sx={{ maxWidth: "100%", m: 2 }}>
              <FormControl fullWidth >
                <InputLabel id="demo-simple-select-label" sx={{ height: "2.8rem" }} required>Brand</InputLabel>
                <Select
                  sx={{ height: "2.8rem" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Brand"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  {brandsDropdown.map((items) => {
                    return (
                      <MenuItem key={items.id} value={items.id}>{items.name}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Box> :
              <MDInput
                type="text"
                label="Selected Brand"
                required
                value={selectedBrand}
              />}
            <MDInput
              type="text"
              label="Sale Title"
              required
              value={brandsSaleData.title}
              onChange={(e) => setBrandsSaleData({
                ...brandsSaleData,
                title: e.target.value
              })}
            />
            <MDInput
              type="text"
              label="Sale Percentage"
              required
              value={brandsSaleData.percentage}
              onChange={(e) => setBrandsSaleData({
                ...brandsSaleData,
                percentage: e.target.value
              })}
            />
            <MDInput
              type="date"
              label="Sale Starts"
              InputLabelProps={{
                shrink: true,
              }}
              value={brandsSaleData.startDate}
              onChange={(e) => setBrandsSaleData({
                ...brandsSaleData,
                startDate: e.target.value
              })}
            />
            <MDInput
              type="date"
              label="Sale Expires"
              InputLabelProps={{
                shrink: true,
              }}
              value={brandsSaleData.endDate}
              onChange={(e) => setBrandsSaleData({
                ...brandsSaleData,
                endDate: e.target.value
              })}
            />
            <MDInput
              type="url"
              label="Website"
              required
              value={brandsSaleData.saleURL}
              onChange={(e) => setBrandsSaleData({
                ...brandsSaleData,
                saleURL: e.target.value
              })}
            />
            <MDInput
              type="text"
              label="Location"
              required
              value={brandsSaleData.location}
              onChange={(e) => setBrandsSaleData({
                ...brandsSaleData,
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
                      onChange={(e) => setBannerFile(e.target.files[0])
                      }
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
                  // disabled={brandsSaleData.title === '' || brandsSaleData.percentage === '' || brandsSaleData.saleURL === '' || brandsSaleData.location === '' ? true : false}
                  onClick={onAddBrandSale}
                >Save</MDButton>
              }
            </MDBox>
          </Box>
        </DialogContent>
        <DialogActions>
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
                        All Brand Sales
                      </MDTypography>
                      <MDButton variant="gradient" color="light"
                        onClick={() => {
                          brandsSaleModalOpen()
                        }}
                      >
                        <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                        &nbsp;ADD SALE
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

export default AddSale;
