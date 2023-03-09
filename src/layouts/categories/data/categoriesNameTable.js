// Admin panel React components
import MDBox from "components/MDBox";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import * as React from "react"
import { Button, CircularProgress, OutlinedInput, InputAdornment, Icon, IconButton, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, Typography, Box, TextField, InputLabel, FormControl } from '@mui/material'
import { green } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import MDSnackbar from "components/MDSnackbar";
import MDTypography from "components/MDTypography";
import CheckIcon from '@mui/icons-material/Check';

// Admin panel React context
import { useMaterialUIController } from "context";

//firestore
import { db, storage } from "../.../../../../firebase"
import { getDocs, onSnapshot, collection, deleteDoc, doc, getDoc, setDoc, query, where, arrayRemove, arrayUnion } from "firebase/firestore";
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

function Data() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [data, setData] = React.useState([])
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const [categoryModal, setCategoryModal] = React.useState(false);
  const [categoryNotification, setCategoryNotification] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [imageProgress, setImageProgress] = React.useState(0);
  const [imageProgressValue, setImageProgressValue] = React.useState(0);
  const [deleteDataId, setDeleteDataId] = React.useState('');
  const [updateDataId, setUpdateDataId] = React.useState('');
  const [brandId, setBrandId] = React.useState('')
  const [saleId, setSaleId] = React.useState('')
  const [carouselId, setCarouselId] = React.useState('')
  const [carouselData, setCarouselData] = React.useState({})
  const [carouselBrandData, setCarouselBrandData] = React.useState({})
  const [discountsId, setDiscountsId] = React.useState('')
  const [categoryValue, setCategoryValue] = React.useState('')
  const [categoryValueDel, setCategoryValueDel] = React.useState('')
  const [dbCategoryData, setDbCategoryData] = React.useState({});
  const [categoryFile, setCategoryFile] = React.useState('')

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
            setDbCategoryData((prev) => ({
              ...prev,
              image: downloadURL
            }))
          });
        }
      );
    }
    categoryFile && uploadCategoryFile()
  }, [categoryFile])

  React.useEffect(() => {
    const fetchData = onSnapshot(collection(db, "categories"),
      (snapshot) => {
        const catData = snapshot.docs.map((items) => {
          return { id: items.id, ...items.data() }
        })
        setData(catData)
      },
      (error) => {
        console.log("error == ", error.code)
      })
    return () => {
      fetchData()
    }
  }, [])

  const fetchAllCollectionsCategories = async () => {
    // get data from database
    try {
      const getCategory = await getDoc(doc(db, "categories", updateDataId));
      if (getCategory.exists()) {
        setDbCategoryData(getCategory.data())
      } else {
        console.log("No such document!");
      }

      const q1 = query(collection(db, "brands"), where("category", "==", categoryValue));
      const querySnapshot1 = await getDocs(q1);
      querySnapshot1.forEach((doc) => {
        setBrandId(doc.id)
      });

      const q2 = query(collection(db, "sales"), where("brand.category", "==", categoryValue));
      const querySnapshot2 = await getDocs(q2);
      querySnapshot2.forEach((doc) => {
        setSaleId(doc.id)
        setCarouselData(doc.data())
        setCarouselBrandData(doc.data().brand)
      });

      const getAllDocs = await getDocs(collection(db, "carousels"));
      const dbData = getAllDocs.docs.map((items) => ({ id: items.id }))
      let carouselIdObj = {}
      for (let i = 0; i < dbData.length; i++) {
        Object.assign(carouselIdObj, dbData[i]);
      }
      setCarouselId(carouselIdObj.id)

      const query3 = query(collection(db, "discounts"), where("brand.category", "==", categoryValue));
      const querySnapshotCarousel3 = await getDocs(query3);
      querySnapshotCarousel3.forEach((doc) => {
        setDiscountsId(doc.id)
      })
    } catch (error) {
      console.log('error == ', error)
    }
  };
  React.useEffect(() => {
    fetchAllCollectionsCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateDataId])

  const delAllCollectionsCategories = async () => {
    // get data from database
    try {
      const q1 = query(collection(db, "brands"), where("category", "==", categoryValueDel));
      const querySnapshot1 = await getDocs(q1);
      querySnapshot1.forEach((doc) => {
        setBrandId(doc.id)
      });

      const q2 = query(collection(db, "sales"), where("brand.category", "==", categoryValueDel));
      const querySnapshot2 = await getDocs(q2);
      querySnapshot2.forEach((doc) => {
        setSaleId(doc.id)
        setCarouselData(doc.data())
        setCarouselBrandData(doc.data().brand)
      });

      const getAllDocs = await getDocs(collection(db, "carousels"));
      const dbData = getAllDocs.docs.map((items) => ({ id: items.id }))
      let carouselIdObj = {}
      for (let i = 0; i < dbData.length; i++) {
        Object.assign(carouselIdObj, dbData[i]);
      }
      setCarouselId(carouselIdObj.id)

      const query3 = query(collection(db, "discounts"), where("brand.category", "==", categoryValueDel));
      const querySnapshotCarousel3 = await getDocs(query3);
      querySnapshotCarousel3.forEach((doc) => {
        setDiscountsId(doc.id)
      })
    } catch (error) {
      console.log('error == ', error)
    }
  };
  React.useEffect(() => {
    delAllCollectionsCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteDataId])

  const deleteById = async () => {
    // delete data from firestore
    const deleteData = {
      carousels: arrayRemove({ sale: carouselData })
    }
    try {
      if (deleteDataId) {
        const reference = doc(db, 'categories', deleteDataId)
        await deleteDoc(reference)
      }
      if (brandId) {
        const reference = doc(db, 'brands', brandId)
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
      deleteAlertClose()
      setDeleteDataId('')
    } catch (error) {
      console.log('error == ', error)
    }
  };


  const onUpdateCategory = async (e) => {
    e.preventDefault()
    //update data into firestore
    const updateData = {
      name: dbCategoryData.name,
      image: dbCategoryData.image
    }
    const updateCategory = {
      category: dbCategoryData.name
    }
    const deleteSaleCategory = {
      carousels: arrayRemove({
        sale: {
          brand: {
            name: carouselBrandData.name,
            contactNo: carouselBrandData.contactNo,
            website: carouselBrandData.website,
            category: carouselBrandData.category,
            logo: carouselBrandData.logo
          },
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
    const updateSaleCategory = {
      carousels: arrayUnion({
        sale: {
          brand: {
            name: carouselBrandData.name,
            contactNo: carouselBrandData.contactNo,
            website: carouselBrandData.website,
            category: dbCategoryData.name,
            logo: carouselBrandData.logo
          },
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
      if (updateDataId) {
        const categoryDocRef = doc(db, "categories", updateDataId)
        await setDoc(categoryDocRef, updateData, { merge: true })
      }
      if (brandId) {
        const saleDocRef = doc(db, "brands", brandId)
        await setDoc(saleDocRef, updateCategory, { merge: true })
      }
      if (saleId) {
        const saleDocRef = doc(db, "sales", saleId)
        await setDoc(saleDocRef, { brand: updateCategory }, { merge: true })
      }
      if (carouselId) {
        const carouselDelDocRef = doc(db, "carousels", carouselId)
        await setDoc(carouselDelDocRef, deleteSaleCategory, { merge: true })
        const carouselUpdDocRef = doc(db, "carousels", carouselId)
        await setDoc(carouselUpdDocRef, updateSaleCategory, { merge: true })
      }
      if (discountsId) {
        const discountDocRef = doc(db, "discounts", discountsId)
        await setDoc(discountDocRef, { brand: updateCategory }, { merge: true })
      }
      categoryModalClose()
      categoryNotificationOpen()
      setUpdateDataId('')
      setImageProgress(0)
      setImageProgressValue(0)
    }
    catch (error) {
      setError(error.code)
      setLoading(false)
    }
  }

  const SR_NO = ({ srNo }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography variant="body2" fontWeight="small">
          {srNo}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
  const CATEGORY_NAME = ({ name, image }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox >
    </MDBox>
  );

  const deleteAlertOpen = (items) => {
    setDeleteAlert(true)
    setDeleteDataId(items.id)
    setCategoryValueDel(items.name)
  }
  const deleteAlertClose = () => {
    setDeleteAlert(false)
    setDeleteDataId('')
    setCategoryValueDel('')
  };
  const categoryModalOpen = (items) => {
    setCategoryModal(true)
    setUpdateDataId(items.id)
    setCategoryValue(items.name)
  };
  const categoryModalClose = () => {
    setCategoryModal(false)
    setUpdateDataId('')
    setCategoryValue('')
    setLoading(false)
    setError('')
    setImageProgress(0)
    setImageProgressValue(0)
  };
  const categoryNotificationOpen = () => setCategoryNotification(true);
  const categoryNotificationClose = () => setCategoryNotification(false);
  return {
    columns: [
      { Header: "SR NO#", accessor: "srNo", width: '10%', align: "left" },
      { Header: "Category Name", accessor: "category", align: "left" },
      { Header: "Action", accessor: "action", align: "right" }

    ],
    rows: [...data.map((items, index) => {
      return ({
        srNo: <SR_NO srNo={index + 1} />,
        category: <CATEGORY_NAME image={items.image} name={items.name} />,
        action: (<>
          <MDSnackbar
            color="success"
            icon="check"
            title="Successfully Update"
            // content="Hello, world! This is a categoryNotification message"
            // dateTime="11 mins ago"
            open={categoryNotification}
            onClose={categoryNotificationClose}
            close={categoryNotificationClose}
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
              <Button sx={{ color: 'error.main' }} onClick={deleteById}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <BootstrapDialog
            onClose={categoryModalClose}
            aria-labelledby="customized-dialog-title"
            open={categoryModal}
          >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={categoryModalClose}>
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
                  label="Category Name"
                  type="text"
                  color="secondary"
                  focused
                  required
                  value={dbCategoryData.name}
                  onChange={(e) => setDbCategoryData({
                    ...dbCategoryData,
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
                  onClick={onUpdateCategory}
                >Update</MDButton>
              }
            </DialogActions>
          </BootstrapDialog>

          <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            <MDBox mr={1}>
              <MDButton variant="text" color="error" onClick={() => deleteAlertOpen(items)}>
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
            <MDButton variant="text" color={darkMode ? "white" : "dark"} onClick={() => categoryModalOpen(items)}>
              <Icon>edit</Icon>&nbsp;edit
            </MDButton>
          </MDBox></>),
      })
    })]
  }
}
export default Data