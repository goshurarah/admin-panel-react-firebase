import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom"
import * as React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Grid, CardContent, Card, CardMedia, Modal, Stack, Divider, Paper, Table, TableBody, CircularProgress, OutlinedInput, DialogContentText, InputAdornment, IconButton, DialogActions, Dialog, DialogTitle, Button, DialogContent, Typography, Box, TextField, InputLabel, MenuItem, FormControl, Select, TableCell, TableContainer, TableRow, } from '@mui/material'
import { green } from "@mui/material/colors";
import CheckIcon from '@mui/icons-material/Check';

// Admin panel React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import MDInput from "components/MDInput";
import MDAvatar from "components/MDAvatar";

// Admin panel React context
import { useMaterialUIController } from "context";

//firestore
import { db, storage } from "../../../firebase"
import { doc, deleteDoc, getDoc, setDoc, arrayRemove, arrayUnion } from "firebase/firestore";
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

function Bill({ discountTitle, brandName, brandCategory, brandContactNo, brandWebsite, brandLogo, bankName, bankAddress, bankContactNo, bankCards, bankImage, discountStartDate, discountEndDate, discountLocation, discountUrl, discountImage, noGutter, dataId }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [brandLogoModal, setBrandLogoModal] = React.useState(false);
  const [bankImageModal, setBankImageModal] = React.useState(false);
  const [discountImageModal, setDiscountImageModal] = React.useState(false);
  const [discountModal, setDiscountModal] = React.useState(false);
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const [discountNotification, setDiscoutNotification] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [imageProgress, setImageProgress] = React.useState(0);
  const [imageProgressValue, setImageProgressValue] = React.useState(0);
  const [dbDiscountBankData, setDbDiscountBankData] = React.useState({})
  const [dbDiscountBrandData, setDbDiscountBrandData] = React.useState({})

  const [locationTableData, setLocationTableData] = React.useState([])
  const [discountTableData, setDiscountTableData] = React.useState([])
  const [discountTableCardsData, setDiscountTableCardsData] = React.useState([])
  const [selectedCard, setSelectedCard] = React.useState('')
  const [cardDropdown, setCardDropdown] = React.useState([])
  const [locationsData, setLocationsData] = React.useState('')
  const [discountCardData, setDiscountCardData] = React.useState([])
  const [discountsData, setDiscountsData] = React.useState({ percentage: '' })
  const [dbDiscountData, setDbDiscountData] = React.useState({})
  const [bannerFile, setBannerFile] = React.useState('')
  const navigate = useNavigate()
  const role = JSON.parse(localStorage.getItem("role"))

  // bannerFile upload
  React.useEffect(() => {
    const uploadBannerFile = () => {
      const name = bannerFile.name
      const storageRef = ref(storage, `discounts/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, bannerFile);
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
            setDbDiscountData((prev) => ({
              ...prev,
              image: downloadURL
            }))
          });
        }
      );

    }
    bannerFile && uploadBannerFile()
  }, [bannerFile])


  const fetchDataById = async (dataId) => {
    // get data from firestore
    try {
      const getData = await getDoc(doc(db, "discounts", dataId));
      if (getData.exists()) {
        setDbDiscountData(getData.data())
        setDbDiscountBankData(getData.data().bank)
        setDbDiscountBrandData(getData.data().brand)
        setLocationTableData(getData.data().locations)
        setDiscountTableData(getData.data().discounts)
        setDiscountCardData(getData.data().discounts)
        setCardDropdown(getData.data().bank.cards)
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

  React.useEffect(() => {
    let cards = discountCardData.map((items) => { return items.cards })
    let cardsArray = cards.flat(Infinity)
    setDiscountTableCardsData(cardsArray)
  }, [discountCardData])

  const deleteById = async (dataId) => {
    // delete data from firestore
    try {
      const reference = doc(db, 'discounts', dataId)
      await deleteDoc(reference)
      navigate(`/${role}/discounts`)
    } catch (error) {
      console.log('error == ', error)
    }
  };
  React.useEffect(() => {
  }, [dataId])

  const onUpdateDiscountsData = async (e) => {
    e.preventDefault()
    // put data into firestore
    const deleteData = {
      discounts: arrayRemove(...discountTableData)
    }
    const updateData = {
      title: dbDiscountData.title,
      locations: locationTableData,
      discounts: arrayUnion(...discountCardData.map((items) => {
        return items
      })),
      url: dbDiscountData.url,
      image: dbDiscountData.image,
      startDate: dbDiscountData.startDate,
      endDate: dbDiscountData.endDate,
      createdAt: Date.now(),
    }
    try {
      setLoading(true)
      if (dataId) {
        const delDocRef = doc(db, "discounts", dataId)
        await setDoc(delDocRef, deleteData, { merge: true })
      }
      if (dataId) {
        const updDocRef = doc(db, "discounts", dataId)
        await setDoc(updDocRef, updateData, { merge: true })
      }
      discountModalClose()
      discountNotificationOpen()
      setDbDiscountData({
        title: '',
        url: '',
        startDate: '',
        endDate: '',
      })
      setLocationTableData([])
      setDiscountCardData([])
      setImageProgress(0)
      setImageProgressValue(0)
    }
    catch (error) {
      setError(error.code);
      setLoading(false)
    }
  }

  const onSaveLocations = () => {
    if (locationsData === '') {
      return null
    } else {
      setLocationTableData([...locationTableData, locationsData])
      setLocationsData('')
    }
  }
  const onDelLocationList = (index) => {
    let locationList = locationTableData.filter((filterItems, filterIndex) => {
      if (filterIndex !== index) {
        return filterItems
      }
      return false
    })
    setLocationTableData([...locationList])
  }

  const onSaveDiscountsOnCards = () => {
    if (discountsData.percentage === '' && selectedCard === '') {
      return null
    } else {
      let localCardsData = cardDropdown.filter((items, index) => {
        if (index === selectedCard) {
          return items
        }
        return false
      })
      let cardObj = {}
      for (let i = 0; i < localCardsData.length; i++) {
        Object.assign(cardObj, localCardsData[i]);
      }
      setDiscountCardData([...discountCardData, {
        cards: [{
          name: cardObj.name,
          category: cardObj.category,
          image: cardObj.image
        }],
        percentage: discountsData.percentage
      }])
      setSelectedCard('')
      setDiscountsData({ percentage: '' })
    }
  }
  const onDelDiscountsOnCardsList = (index) => {
    let CardsList = discountCardData.filter((filterItems, filterIndex) => {
      if (filterIndex !== index) {
        return filterItems
      }
      return false
    })
    setDiscountCardData([...CardsList])
  }

  const deleteAlertOpen = () => setDeleteAlert(true);
  const deleteAlertClose = () => setDeleteAlert(false);
  const discountModalOpen = () => setDiscountModal(true);
  const discountModalClose = () => {
    setDiscountModal(false)
    setLoading(false)
    setError('')
    setImageProgress(0)
    setImageProgressValue(0)
  };
  const discountNotificationOpen = () => setDiscoutNotification(true);
  const discountNotificationClose = () => setDiscoutNotification(false);
  const brandLogoModalOpen = () => setBrandLogoModal(true);
  const brandLogoModalClose = () => setBrandLogoModal(false);
  const bankImageModalOpen = () => setBankImageModal(true);
  const bankImageModalClose = () => setBankImageModal(false);
  const discountImageModalOpen = () => setDiscountImageModal(true);
  const discountImageModalClose = () => setDiscountImageModal(false);
  return (
    <>
      <MDSnackbar
        color="success"
        icon="check"
        title="Successfully Update"
        // content="Hello, world! This is a discountNotification message"
        // dateTime="11 mins ago"
        open={discountNotification}
        onClose={discountNotificationClose}
        close={discountNotificationClose}
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
        onClose={discountModalClose}
        aria-labelledby="customized-dialog-title"
        open={discountModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={discountModalClose}>
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
              type="text"
              label="Discount Title"
              required
              value={dbDiscountData.title}
              onChange={(e) => setDbDiscountData({
                ...dbDiscountData,
                title: e.target.value
              })}
            />
            <MDInput
              type="text"
              label="Bank"
              InputProps={{
                readOnly: true,
              }}
              required
              value={dbDiscountBankData.name}
            />
            <MDInput
              type="text"
              label="Brand"
              InputProps={{
                readOnly: true,
              }}
              required
              value={dbDiscountBrandData.name}
            />
            <Divider />
            <Paper elevation={5} sx={{ m: 2, borderRadius: '1rem', pb: 2 }}>
              <MDTypography variant="h6" fontWeight="medium" align='center' pt={2}>
                Discount Location
              </MDTypography>
              <MDInput
                type="text"
                label="Sale Locations"
                required
                value={locationsData}
                onChange={(e) => setLocationsData(e.target.value)}
              />
              <Box sx={{ m: 2 }}>
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="a dense table">
                    <TableRow sx={{ background: "#3d5afe" }}>
                      <TableCell sx={{ fontWeight: 500, color: "#FFFFFF" }}>Sr#</TableCell>
                      <TableCell sx={{ fontWeight: 500, color: "#FFFFFF" }}>Outlets</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 500, color: "#FFFFFF" }}>Action</TableCell>
                    </TableRow>
                    <TableBody>
                      {locationTableData.map((items, index) => (
                        <TableRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {items}
                          </TableCell>
                          <TableCell component="th" scope="row" align="right">
                            <Button onClick={() => onDelLocationList(index)}><DeleteIcon color="error" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Stack direction="row" sx={{ justifyContent: 'center', p: 1 }} spacing={2}>
                <MDButton variant="outlined" color="info" size="small"
                  onClick={onSaveLocations}
                >Save</MDButton>
              </Stack>
            </Paper>
            <Divider />
            <Paper elevation={5} sx={{ m: 2, borderRadius: '1rem', pb: 2 }}>
              <MDTypography variant="h6" fontWeight="medium" align='center' pt={2}>
                Cards
              </MDTypography>
              <Box sx={{ maxWidth: "100%", m: 2 }}>
                <FormControl fullWidth >
                  <InputLabel id="demo-simple-select-label" sx={{ height: "2.8rem" }} required>Select Bank</InputLabel>
                  <Select
                    sx={{ height: "2.8rem" }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Select Card"
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.target.value)}
                  >
                    {cardDropdown.map((items, index) => (
                      <MenuItem value={index}>{items.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <MDInput
                type="text"
                label="Discount Percentage"
                required
                value={discountsData.percentage}
                onChange={(e) => setDiscountsData({
                  ...discountsData,
                  percentage: e.target.value
                })}
              />
              <Box sx={{ m: 2 }}>
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="a dense table">
                    <TableRow sx={{ background: "#3d5afe" }}>
                      <TableCell sx={{ fontWeight: 500, color: "#FFFFFF" }}>Sr#</TableCell>
                      <TableCell sx={{ fontWeight: 500, color: "#FFFFFF" }}>Card Name</TableCell>
                      <TableCell sx={{ fontWeight: 500, color: "#FFFFFF" }}>Discount Percentage</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 500, color: "#FFFFFF" }}>Action</TableCell>
                    </TableRow>
                    <TableBody>
                      {discountCardData.map((items, index) => {
                        return (
                          <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {index + 1}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {discountTableCardsData.map((cardItem, cardIndex) => {
                                if (index === cardIndex) {
                                  return cardItem.name
                                }
                                return false
                              })}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {items.percentage}
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                              <Button onClick={() => onDelDiscountsOnCardsList(index)}><DeleteIcon color="error" /></Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Stack direction="row" sx={{ justifyContent: 'center', p: 1 }} spacing={2}>
                <MDButton variant="outlined" color="info" size="small"
                  onClick={onSaveDiscountsOnCards}
                >Save</MDButton>
              </Stack>
            </Paper>
            <Divider />
            <MDInput
              type="url"
              label="Discount URL"
              required
              value={dbDiscountData.url}
              onChange={(e) => setDbDiscountData({
                ...dbDiscountData,
                url: e.target.value
              })}
            />
            <Box sx={{ maxWidth: "100%", m: 2 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount" >Discount Banner</InputLabel>
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
                  label="Discount Banner"
                />
              </FormControl>
            </Box>
            <Typography variant="body1" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>Duration</Typography>
            <MDInput
              type="date"
              label="Start Date"
              InputLabelProps={{
                shrink: true,
              }}
              value={dbDiscountData.startDate}
              onChange={(e) => setDbDiscountData({
                ...dbDiscountData,
                startDate: e.target.value
              })}
            />
            <MDInput
              type="date"
              label="End Date"
              InputLabelProps={{
                shrink: true,
              }}
              value={dbDiscountData.endDate}
              onChange={(e) => setDbDiscountData({
                ...dbDiscountData,
                endDate: e.target.value
              })}
            />
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
                  onClick={onUpdateDiscountsData}
                >Update</MDButton>
              }
            </MDBox>
          </Box>
        </DialogContent>
        <DialogActions>

        </DialogActions>
      </BootstrapDialog>

      <Modal
        open={brandLogoModal}
        onClose={brandLogoModalClose}
        aria-labelledby="brandImageModal-brandImageModal-title"
        aria-describedby="brandImageModal-brandImageModal-description"
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
                src={brandLogo}
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
      <Modal
        open={bankImageModal}
        onClose={bankImageModalClose}
        aria-labelledby="brandImageModal-brandImageModal-title"
        aria-describedby="brandImageModal-brandImageModal-description"
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
                src={bankImage}
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
      <Modal
        open={discountImageModal}
        onClose={discountImageModalClose}
        aria-labelledby="brandImageModal-brandImageModal-title"
        aria-describedby="brandImageModal-brandImageModal-description"
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
                src={discountImage}
                component="img"
                title="Discount Image"
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
              Discount Name:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
                {discountTitle}
              </MDTypography>
            </MDTypography>

            <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
              <MDBox mr={1}>
                <MDButton variant="text" color="error" onClick={deleteAlertOpen}>
                  <Icon>delete</Icon>&nbsp;delete
                </MDButton>
              </MDBox>
              <MDButton variant="text" color={darkMode ? "white" : "dark"} onClick={discountModalOpen}>
                <Icon>edit</Icon>&nbsp;edit
              </MDButton>
            </MDBox>

          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Brand Name:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                {brandName}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Brand Category:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {brandCategory}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Brand Contact No:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {brandContactNo}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={0} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Brand Website:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {brandWebsite}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={0} lineHeight={0} display="flex" flexDirection="row" alignItems="center">
            <MDTypography variant="caption" color="text">
              Brand Logo:&nbsp;&nbsp;&nbsp;
            </MDTypography>
            <MDAvatar sx={{ cursor: "pointer" }} onClick={brandLogoModalOpen} src={brandLogo} size="sm" />
          </MDBox>
          <MDBox mb={1} mt={5} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Bank Name:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {bankName}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Bank Address:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {bankAddress}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={0} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Bank Contact No:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {bankContactNo}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={0} lineHeight={0} display="flex" flexDirection="row" alignItems="center">
            <MDTypography variant="caption" color="text">
              Bank Image:&nbsp;&nbsp;&nbsp;
            </MDTypography>
            <MDAvatar sx={{ cursor: "pointer" }} onClick={bankImageModalOpen} src={bankImage} size="sm" />
          </MDBox>
          <MDBox mb={0} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Bank Cards:&nbsp;&nbsp;&nbsp;
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                {bankCards.map((item, index) => (
                  <Card
                    sx={{
                      width: 220, height: 180, margin: "0.5rem", '&:hover': {
                        transition: "transform 0.3s ease",
                        transform: "scale(1.1)",
                      }
                    }}
                    id={index}
                  >
                    <CardMedia
                      component="img"
                      height="100"
                      sx={{ p: 0.5, m: -0.4 }}
                      image={item.image}
                      alt='Bank Card Image'
                    />
                    <CardContent sx={{ ml: -2 }}>
                      <MDBox mb={1} mt={1} lineHeight={0}>
                        <MDTypography variant="caption" color="text">
                          Bank Card Name:&nbsp;&nbsp;&nbsp;
                          <MDTypography variant="caption" fontWeight="medium">
                            {item.name}
                          </MDTypography>
                        </MDTypography>
                      </MDBox>
                      <MDBox mb={0} lineHeight={0}>
                        <MDTypography variant="caption" color="text">
                          Bank Card Category:&nbsp;&nbsp;&nbsp;
                          <MDTypography variant="caption" fontWeight="medium">
                            {item.category}
                          </MDTypography>
                        </MDTypography>
                      </MDBox>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} mt={5} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Discount Start Date:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {discountStartDate}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Discount End Date:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {discountEndDate}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Discount Locations:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {`${discountLocation}`}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={0} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Discount Website:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {discountUrl}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={0} lineHeight={0} display="flex" flexDirection="row" alignItems="center">
            <MDTypography variant="caption" color="text">
              Discount Image:&nbsp;&nbsp;&nbsp;
            </MDTypography>
            <MDAvatar sx={{ cursor: "pointer" }} onClick={discountImageModalOpen} src={discountImage} size="sm" />
          </MDBox>
          <MDBox mb={0} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Discount Cards:&nbsp;&nbsp;&nbsp;
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                {discountCardData.map((item, index) => (
                  <Card
                    sx={{
                      width: 220, height: 200, margin: "0.5rem", '&:hover': {
                        transition: "transform 0.3s ease",
                        transform: "scale(1.1)",
                      }
                    }}
                    key={index}
                  >
                    {discountTableCardsData.map((cardItem, cardIndex) => {
                      if (cardIndex === index) {
                        return (
                          <CardMedia
                            component="img"
                            height="100"
                            sx={{ p: 0.5, m: -0.4 }}
                            image={cardItem.image}
                            alt='Discount Card Image'
                          />
                        )
                      }
                      return false
                    })}
                    <CardContent sx={{ ml: -2 }}>
                      <MDBox mb={1} mt={1} lineHeight={0}>
                        <MDTypography variant="caption" color="text">
                          Discount Card Name:&nbsp;&nbsp;&nbsp;
                          <MDTypography variant="caption" fontWeight="medium">
                            {discountTableCardsData.map((cardItem, cardIndex) => {
                              if (index === cardIndex) {
                                return cardItem.name
                              }
                              return false
                            })}
                          </MDTypography>
                        </MDTypography>
                      </MDBox>
                      <MDBox mb={1} mt={1} lineHeight={0}>
                        <MDTypography variant="caption" color="text">
                          Discount Card Category:&nbsp;&nbsp;&nbsp;
                          <MDTypography variant="caption" fontWeight="medium">
                            {discountTableCardsData.map((cardItem, cardIndex) => {
                              if (index === cardIndex) {
                                return cardItem.category
                              }
                              return false
                            })}
                          </MDTypography>
                        </MDTypography>
                      </MDBox>
                      <MDBox mb={0} lineHeight={0}>
                        <MDTypography variant="caption" color="text">
                          Discount Card Percentage:&nbsp;&nbsp;&nbsp;
                          <MDTypography variant="caption" fontWeight="medium">
                            {item.percentage}
                          </MDTypography>
                        </MDTypography>
                      </MDBox>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </MDTypography>
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
  discountTitle: PropTypes.string.isRequired,
  brandName: PropTypes.string.isRequired,
  brandCategory: PropTypes.string.isRequired,
  brandContactNo: PropTypes.string.isRequired,
  brandWebsite: PropTypes.string.isRequired,
  bankName: PropTypes.string.isRequired,
  bankAddress: PropTypes.string.isRequired,
  bankContactNo: PropTypes.string.isRequired,
  discountStartDate: PropTypes.string.isRequired,
  discountEndDate: PropTypes.string.isRequired,
  discountUrl: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Bill;
