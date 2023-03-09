// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox"
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { CircularProgress, OutlinedInput, InputAdornment, IconButton, DialogActions, Dialog, DialogTitle, DialogContent, Typography, Box, TextField, InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { green } from '@mui/material/colors';
import CheckIcon from '@mui/icons-material/Check';

// Admin panel React example components
import * as React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDSnackbar from "components/MDSnackbar";

// Data
import brandsNameTable from "layouts/brands/data/brandsNameTable";

//firestore 
import { db, storage } from "../../firebase"
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
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

function Brands() {
  const { columns, rows } = brandsNameTable();
  const [brandsModal, setBrandsModal] = React.useState(false);
  const [brandsNotification, setBrandsNotification] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [imageProgress, setImageProgress] = React.useState(0);
  const [imageProgressValue, setImageProgressValue] = React.useState(0);
  const [categoriesDropdown, setCategoriesDropdown] = React.useState([])
  const [brandsData, setBrandsData] = React.useState({
    name: '',
    contactNo: '',
    website: '',
    category: '',
  })
  const [file, setFile] = React.useState('')

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
            setBrandsData((prev) => ({
              ...prev,
              logo: downloadURL
            }))
          });
        }
      );

    }
    file && uploadFile()
  }, [file])

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
  }, [])

  const onAddBrand = async (e) => {
    e.preventDefault()
    //post data into firestore
    try {
      setLoading(true)
      const docId = await addDoc(collection(db, "brands"), {
        name: brandsData.name,
        contactNo: brandsData.contactNo,
        website: brandsData.website,
        category: brandsData.category,
        logo: brandsData.logo
      })
      const updateData = {
        uid: docId.id
      }
      const DocRef = doc(db, "brands", docId.id)
      await setDoc(DocRef, updateData, { merge: true })
      brandsModalClose()
      brandsNotificationOpen()
      setBrandsData({
        name: '',
        contactNo: '',
        website: '',
        category: '',
      })
      setImageProgress(0)
      setImageProgressValue(0)
    }
    catch (error) {
      setError(error.code)
      setLoading(false)
    }
  }

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
  return (
    <>
      <MDSnackbar
        color="success"
        icon="check"
        title="Successfully Add"
        // content="Hello, world! This is a brandsNotification message"
        // dateTime="11 mins ago"
        open={brandsNotification}
        onClose={brandsNotificationClose}
        close={brandsNotificationClose}
      />
      <BootstrapDialog
        onClose={brandsModalClose}
        aria-labelledby="customized-dialog-title"
        open={brandsModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={brandsModalClose}>
          <Typography variant="h3" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>Add Brand</Typography>
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
              rows={1}
              color="secondary"
              required
              value={brandsData.name}
              onChange={(e) => setBrandsData({
                ...brandsData,
                name: e.target.value
              })}
            />
            <TextField
              label="Contact Number"
              type="number"
              rows={1}
              color="secondary"
              required
              value={brandsData.contactNo}
              onChange={(e) => setBrandsData({
                ...brandsData,
                contactNo: e.target.value
              })}
            />
            <TextField
              label="Website URL"
              type='url'
              rows={1}
              color="secondary"
              required
              value={brandsData.website}
              onChange={(e) => setBrandsData({
                ...brandsData,
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
                  value={brandsData.category}
                  onChange={(e) => setBrandsData({
                    ...brandsData,
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
              // disabled={brandsData.name === '' || brandsData.contactNo === '' || brandsData.website === '' || brandsData.category === '' || brandsData.logo === '' ? true : false}
              onClick={onAddBrand}
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
                        All Brands
                      </MDTypography>
                      <MDButton variant="gradient" color="light"
                        onClick={() => {
                          brandsModalOpen()
                        }}>
                        <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                        &nbsp;ADD BRAND
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

export default Brands;
