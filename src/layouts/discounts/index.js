// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { green } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import DataTable from "examples/Tables/DataTable";
import DeleteIcon from '@mui/icons-material/Delete';
import MDSnackbar from "components/MDSnackbar";
import MDTypography from "components/MDTypography";
import CheckIcon from '@mui/icons-material/Check';

// Admin panel React example components
import * as React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Button, Stack, Paper, CircularProgress, Table, TableBody, InputAdornment, TableCell, TableContainer, TableRow, Divider, Typography, Box, InputLabel, OutlinedInput, FormControl, MenuItem, Select, Dialog, DialogTitle, IconButton, DialogContent, TextField, DialogActions, Card, Icon } from '@mui/material'
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";

// Data
import discountsNameTable from "layouts/discounts/data/discountsNameTable";

//firestore
import { db, storage } from "../../firebase"
import { collection, doc, addDoc, getDoc, getDocs, arrayUnion, query, where } from "firebase/firestore";
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

function Discounts() {
  const { columns, rows } = discountsNameTable();
  const { currentUser, role } = useContext(AuthContext)
  const [displayLocationTable, setDisplayLocationTable] = React.useState(false);
  const [displayLocationButton, setDisplayLocationButton] = React.useState(false);
  const [displayCardTable, setDisplayCardTable] = React.useState(false);
  const [displayCardButton, setDisplayCardButton] = React.useState(false);
  const [discountModal, setDiscountModal] = React.useState(false);
  const [discountNotification, setDiscountNotification] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [imageProgress, setImageProgress] = React.useState(0);
  const [imageProgressValue, setImageProgressValue] = React.useState(0);
  const [selectedBank, setSelectedBank] = React.useState('');
  const [selectedBrand, setSelectedBrand] = React.useState('');
  const [selectedCard, setSelectedCard] = React.useState('');
  const [bankDropdown, setBankDropdown] = React.useState([])
  const [brandDropdown, setBrandDropdown] = React.useState([])
  const [cardDropdown, setCardDropdown] = React.useState([])
  const [locationTableData, setLocationTableData] = React.useState([])
  const [discountTableData, setDiscountTableData] = React.useState([])
  const [discountCardData, setDiscountCardData] = React.useState([])
  const [bankDbData, setBankDbData] = React.useState({})
  const [brandDbData, setBrandDbData] = React.useState({})
  const [bannerFile, setBannerFile] = React.useState('')
  const [locationsData, setLocationsData] = React.useState('')
  const [discountsData, setDiscountsData] = React.useState({ percentage: '' })
  const [discountsPostData, setDiscountsPostData] = React.useState({
    title: '',
    url: '',
    startDate: '',
    endDate: '',
    discounts: [],
    days: [],
  })

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
            setDiscountsPostData((prev) => ({
              ...prev,
              image: downloadURL
            }))
          });
        }
      );

    }
    bannerFile && uploadBannerFile()
  }, [bannerFile])

  const fetchAllBanksAndBrands = async (selectedBank, selectedBrand) => {
    // get data from database
    const getAllBanks = await getDocs(collection(db, "banks"));
    const dbBankData = getAllBanks.docs.map((items) => ({ id: items.id, ...items.data() }))
    let allBanksName = dbBankData.map((filterItems) => {
      return {
        id: filterItems.id,
        name: filterItems.name,
      }
    })
    setBankDropdown(allBanksName)
    const getAllBrands = await getDocs(collection(db, "brands"));
    const dbBrandData = getAllBrands.docs.map((items) => ({ id: items.id, ...items.data() }))
    let allBrandsName = dbBrandData.map((filterItems) => {
      return {
        id: filterItems.id,
        name: filterItems.name,
      }
    })
    setBrandDropdown(allBrandsName)

    const getSpecificBank = await getDoc(doc(db, "banks", selectedBank));
    if (getSpecificBank.exists()) {
      setCardDropdown(getSpecificBank.data().cards)
      setBankDbData(getSpecificBank.data())
    } else {
      console.log("No such document!");
    }

    const getSpecificBrandData = await getDoc(doc(db, "brands", selectedBrand));
    if (getSpecificBrandData.exists()) {
      setBrandDbData(getSpecificBrandData.data())
    } else {
      console.log("No such document!");
    }
  };
  React.useEffect(() => {
    role === "admin" && fetchAllBanksAndBrands(selectedBank, selectedBrand)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBank, selectedBrand])

  const fetchAllBanksAndBrands2 = async (selectedBank, selectedBrand) => {
    // get data from database
    const q = query(collection(db, "users"), where("uid", "==", currentUser))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setSelectedBank(doc.data().bankName)
    })

    const q2 = query(collection(db, "banks"), where("name", "==", selectedBank))
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
      setCardDropdown(doc.data().cards)
      setBankDbData(doc.data())
    })

    const getAllBrands = await getDocs(collection(db, "brands"));
    const dbBrandData = getAllBrands.docs.map((items) => ({ id: items.id, ...items.data() }))
    let allBrandsName = dbBrandData.map((filterItems) => {
      return {
        id: filterItems.id,
        name: filterItems.name,
      }
    })
    setBrandDropdown(allBrandsName)

    const getSpecificBrandData = await getDoc(doc(db, "brands", selectedBrand));
    if (getSpecificBrandData.exists()) {
      setBrandDbData(getSpecificBrandData.data())
    } else {
      console.log("No such document!");
    }
  };
  React.useEffect(() => {
    role === "bank" && fetchAllBanksAndBrands2(selectedBank, selectedBrand)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBank, selectedBrand])

  const onAddDiscountsData = async (e) => {
    e.preventDefault()
    //post data into firestore
    try {
      setLoading(true)
      await addDoc(collection(db, "discounts"), {
        title: discountsPostData.title,
        bank: bankDbData,
        brand: {
          name: brandDbData.name,
          contactNo: brandDbData.contactNo,
          website: brandDbData.website,
          category: brandDbData.category,
          logo: brandDbData.logo,
          uid: brandDbData.uid
        },
        locations: locationTableData,
        discounts: arrayUnion(...discountCardData.map((items) => {
          return items
        })),
        url: discountsPostData.url,
        image: discountsPostData.image,
        startDate: discountsPostData.startDate,
        endDate: discountsPostData.endDate,
        status: 'Active',
        createdAt: Date.now(),
        tnc: "Cardholders will need to mention “Lounge Key” to reception staff in order to avail the facility The benefit of access to the Lounge is free for valid/active HBL Visa Platinum Credit Cardholders and their Supplementary Cardholders only Guests are not eligible for complimentary airport lounge access. Entry for guests is subject to rules and regulations of the respective lounge and may vary from lounge to lounge This complimentary privilege is accessible to HBL Platinum Credit Cardholders, irrespective of class of travel or airline Card holder’s visit allocation is limited to 6 free visits per calendar year. All additional visits and guests are charged at $32 per guest, per visit Participating lounges and facilities are subject to change anytime as per Visa policy. Customers should visit www.Loungekey.com/visaplatinummena for updated information prior to travelling All Conditions of Use of LoungeKey available on www.loungekey.com/en/visaplatinummena/conditions-of-use shall apply The above services are provided via third party service providers on a best effort basis. HBL makes no warranties and assumes no liability and responsibility with respect to the service provided by the vendor"
      })
      discountModalClose()
      discountNotificationOpen()
      setDiscountsPostData({
        title: '',
        url: '',
        startDate: '',
        endDate: '',
      })
      setDisplayLocationTable(false)
      setDisplayCardTable(false)
      setDisplayLocationButton(false)
      setDisplayCardButton(false)
      setLocationTableData([])
      setDiscountTableData([])
      setSelectedBank('')
      setSelectedBrand('')
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
      setDiscountTableData([...discountTableData, {
        name: cardObj.name,
        percentage: discountsData.percentage
      }])
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
    let CardsList = discountTableData.filter((filterItems, filterIndex) => {
      if (filterIndex !== index) {
        return filterItems
      }
      return false
    })
    setDiscountTableData([...CardsList])
  }

  const discountModalOpen = () => setDiscountModal(true);
  const discountModalClose = () => {
    setDiscountModal(false)
    setDisplayLocationTable(false)
    setDisplayCardTable(false)
    setDisplayLocationButton(false)
    setDisplayCardButton(false)
    setLocationTableData([])
    setDiscountTableData([])
    setSelectedBank('')
    setSelectedBrand('')
    setLoading(false)
    setError('')
    setImageProgress(0)
    setImageProgressValue(0)
  };
  const discountNotificationOpen = () => setDiscountNotification(true);
  const discountNotificationClose = () => setDiscountNotification(false);
  return (
    <>
      <MDSnackbar
        color="success"
        icon="check"
        title="Successfully Add"
        // content="Hello, world! This is a discountNotification message"
        // dateTime="11 mins ago"
        open={discountNotification}
        onClose={discountNotificationClose}
        close={discountNotificationClose}
      />

      <BootstrapDialog
        onClose={discountModalClose}
        aria-labelledby="customized-dialog-title"
        open={discountModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={discountModalClose}>
        </BootstrapDialogTitle>
        <DialogContent>
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
              value={discountsPostData.title}
              onChange={(e) => setDiscountsPostData({
                ...discountsPostData,
                title: e.target.value
              })}
            />
            {role === 'admin' ? <Box sx={{ maxWidth: "100%", m: 2 }}>
              <FormControl fullWidth >
                <InputLabel id="demo-simple-select-label" sx={{ height: "2.8rem" }} required>Select Bank</InputLabel>
                <Select
                  sx={{ height: "2.8rem" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Select Bank"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                >
                  {bankDropdown.map((items) => {
                    return (
                      <MenuItem key={items.id} value={items.id}>{items.name}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Box> :
              <MDInput
                type="text"
                label="Selected Bank"
                required
                value={selectedBank}
              />
            }
            <Box sx={{ maxWidth: "100%", m: 2 }}>
              <FormControl fullWidth >
                <InputLabel id="demo-simple-select-label" sx={{ height: "2.8rem" }} required>Select Brand</InputLabel>
                <Select
                  sx={{ height: "2.8rem" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Select Brand"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  {brandDropdown.map((items) => {
                    return (
                      <MenuItem key={items.id} value={items.id}>{items.name}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Box>
            <Divider />
            <Paper elevation={5} sx={{ m: 2, borderRadius: '1rem', pb: 2 }}>
              <MDBox pt={2} pb={2} px={2} display="flex" justifyContent={displayLocationButton === false ? "space-between" : "center"} alignItems="center">
                <MDTypography variant="h6" fontWeight="medium">
                  Discount Location
                </MDTypography>
                {displayLocationButton === true ? null : <MDButton variant="gradient" color="light" size="small"
                  onClick={() => {
                    setDisplayLocationTable(true)
                    setDisplayLocationButton(true)
                  }}
                >
                  <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                  &nbsp;ADD LOCATION
                </MDButton>}
              </MDBox>
              {displayLocationTable === false ?
                <Box sx={{ m: 2 }}>
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                      <TableRow sx={{ background: "#3d5afe" }}>
                        <TableCell sx={{ fontWeight: 500, color: "#FFFFFF" }} align="center">No Location Added</TableCell>
                      </TableRow>
                    </Table>
                  </TableContainer>
                </Box> :
                <><MDInput
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
                  </Stack></>}
            </Paper>
            <Divider />
            <Paper elevation={5} sx={{ m: 2, borderRadius: '1rem', pb: 2 }}>
              <MDBox pt={2} pb={2} px={2} display="flex" justifyContent={displayCardButton === false ? "space-between" : "center"} alignItems="center">
                <MDTypography variant="h6" fontWeight="medium">
                  Cards
                </MDTypography>
                {displayCardButton === true ? null : <MDButton variant="gradient" color="light" size="small"
                  onClick={() => {
                    setDisplayCardTable(true)
                    setDisplayCardButton(true)
                  }}
                >
                  <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                  &nbsp;ADD DISCOUNT
                </MDButton>}
              </MDBox>
              {displayCardTable === false ?
                <Box sx={{ m: 2 }}>
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                      <TableRow sx={{ background: "#3d5afe" }}>
                        <TableCell sx={{ fontWeight: 500, color: "#FFFFFF" }} align="center">No Cards Added</TableCell>
                      </TableRow>
                    </Table>
                  </TableContainer>
                </Box> :
                <><Box sx={{ maxWidth: "100%", m: 2 }}>
                  <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label" sx={{ height: "2.8rem" }} required>Select Card</InputLabel>
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
                          {discountTableData.map((items, index) => (
                            <TableRow
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell component="th" scope="row">
                                {index + 1}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {items.name}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {items.percentage}
                              </TableCell>
                              <TableCell component="th" scope="row" align="right">
                                <Button onClick={() => onDelDiscountsOnCardsList(index)}><DeleteIcon color="error" /></Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  <Stack direction="row" sx={{ justifyContent: 'center', p: 1 }} spacing={2}>
                    <MDButton variant="outlined" color="info" size="small"
                      onClick={onSaveDiscountsOnCards}
                    >Save</MDButton>
                  </Stack></>}
            </Paper>
            <Divider />
            <MDInput
              type="url"
              label="Discount URL"
              required
              value={discountsPostData.url}
              onChange={(e) => setDiscountsPostData({
                ...discountsPostData,
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
              value={discountsPostData.startDate}
              onChange={(e) => setDiscountsPostData({
                ...discountsPostData,
                startDate: e.target.value
              })}
            />
            <MDInput
              type="date"
              label="End Date"
              InputLabelProps={{
                shrink: true,
              }}
              value={discountsPostData.endDate}
              onChange={(e) => setDiscountsPostData({
                ...discountsPostData,
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
                  onClick={onAddDiscountsData}
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
                        All Discounts
                      </MDTypography>
                      <MDButton variant="gradient" color="light"
                        onClick={() => {
                          discountModalOpen()
                        }}>
                        <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                        &nbsp;ADD DISCOUNT
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

export default Discounts;
