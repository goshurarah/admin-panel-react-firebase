// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// Admin panel React example components
import * as React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { CircularProgress, OutlinedInput, DialogActions, InputAdornment, Card, Icon, IconButton, Dialog, DialogTitle, DialogContent, Typography, Box, TextField, InputLabel, FormControl } from '@mui/material'
import { green } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import DataTable from "examples/Tables/DataTable";
import MDSnackbar from "components/MDSnackbar";
import MDTypography from "components/MDTypography";
import CheckIcon from '@mui/icons-material/Check';

// Data
import categoriesNameTable from "layouts/categories/data/categoriesNameTable";

//firestore
import { db, storage } from "../../firebase"
import { collection, addDoc } from "firebase/firestore";
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

function Categories() {
  const { columns, rows } = categoriesNameTable();
  const [categoryModal, setCategoryModal] = React.useState(false);
  const [categoryNotification, setCategoryNotification] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [imageProgress, setImageProgress] = React.useState(0);
  const [imageProgressValue, setImageProgressValue] = React.useState(0);
  const [brandCategoryData, setBrandCategoryData] = React.useState({
    name: '',
  })
  const [categoryFile, setCategoryFile] = React.useState()

  // categoryFile upload
  React.useEffect(() => {
    const uploadCategoryFile = () => {
      const name = categoryFile.name
      const storageRef = ref(storage, `categories/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, categoryFile);
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
            setBrandCategoryData((prev) => ({
              ...prev,
              image: downloadURL
            }))
          });
        }
      );
    }
    categoryFile && uploadCategoryFile()
  }, [categoryFile])

  const onAddCategory = async (e) => {
    e.preventDefault()
    //post data into firestore
    try {
      setLoading(true)
      await addDoc(collection(db, "categories"), {
        name: brandCategoryData.name,
        image: brandCategoryData.image
      })
      categoryModalClose()
      categoryNotificationOpen()
      setBrandCategoryData({
        name: ''
      })
      setImageProgress(0)
      setImageProgressValue(0)
    }
    catch (error) {
      setError(error.code)
      setLoading(false)
    }
  }

  const categoryModalOpen = () => setCategoryModal(true);
  const categoryModalClose = () => {
    setCategoryModal(false)
    setLoading(false)
    setError('')
    setImageProgress(0)
    setImageProgressValue(0)
  };
  const categoryNotificationOpen = () => setCategoryNotification(true);
  const categoryNotificationClose = () => setCategoryNotification(false);
  return (
    <>
      <MDSnackbar
        color="success"
        icon="check"
        title="Successfully Add"
        // content="Hello, world! This is a categoryNotification message"
        // dateTime="11 mins ago"
        open={categoryNotification}
        onClose={categoryNotificationClose}
        close={categoryNotificationClose}
      />

      <BootstrapDialog
        onClose={categoryModalClose}
        aria-labelledby="customized-dialog-title"
        open={categoryModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={categoryModalClose}>
          <Typography variant="h3" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>Add Category</Typography>
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
              label="Category Name"
              type="text"
              color="secondary"
              required
              value={brandCategoryData.name}
              onChange={(e) => setBrandCategoryData({
                ...brandCategoryData,
                name: e.target.value
              })}
            />
            <Box sx={{ maxWidth: "100%", m: 2 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount" >Image</InputLabel>
                <OutlinedInput
                  sx={{ height: "2.8rem" }}
                  id="outlined-adornment-amount"
                  startAdornment={<><InputAdornment position="start">
                    <input multiple type="file"
                      onChange={(e) => setCategoryFile(e.target.files[0])}
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
                  label="Image"
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
              // disabled={brandCategoryData.name === '' ? true : false}
              onClick={onAddCategory}
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
                        All Categories
                      </MDTypography>
                      <MDButton variant="gradient" color="light"
                        onClick={() => {
                          categoryModalOpen()
                        }}>
                        <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                        &nbsp;ADD CATEGORY
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

export default Categories;
