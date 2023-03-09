// // @mui material components
// import Grid from "@mui/material/Grid";

// // Admin panel React components
// import MDBox from "components/MDBox";
// import MDButton from "components/MDButton";

// // Admin panel React example components
// import * as React from 'react';
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import { CircularProgress, OutlinedInput, InputAdornment, Card, Icon, IconButton, DialogActions, Dialog, DialogTitle, Stack, Paper, DialogContent, TextField, Table, TableBody, TableCell, TableContainer, TableRow, Divider, Typography, Box, InputLabel, FormControl, MenuItem, Select } from '@mui/material'
// import { green } from '@mui/material/colors';
// import CloseIcon from '@mui/icons-material/Close';
// import { styled } from '@mui/material/styles';
// import PropTypes from 'prop-types';
// import DataTable from "examples/Tables/DataTable";
// import MDSnackbar from "components/MDSnackbar";
// import MDTypography from "components/MDTypography";

// // Data
// import carouselsNameTable from "layouts/carousels/data/carouselsNameTable";

// //firestore
// import { db } from "../../firebase"
// import { collection, doc, addDoc, getDoc, getDocs, arrayUnion } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// //modal Styles
// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   '& .MuiDialogContent-root': {
//     padding: theme.spacing(2),
//   },
//   '& .MuiDialogActions-root': {
//     padding: theme.spacing(1),
//   },
// }));
// function BootstrapDialogTitle(props) {
//   const { children, onClose, ...other } = props;
//   return (
//     <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
//       {children}
//       {onClose ? (
//         <IconButton
//           aria-label="close"
//           onClick={onClose}
//           sx={{
//             position: 'absolute',
//             right: 8,
//             top: 8,
//             color: (theme) => theme.palette.grey[500],
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       ) : null}
//     </DialogTitle>
//   );
// }
// BootstrapDialogTitle.propTypes = {
//   children: PropTypes.node,
//   onClose: PropTypes.func.isRequired,
// };

// function Carousels() {
//   const { columns, rows } = carouselsNameTable();
//   const [carouselModal, setCarouselModal] = React.useState(false);
//   const [carouselNotification, setCarouselNotification] = React.useState(false);
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState('');
//   const [selectedSale, setSelectedSale] = React.useState('');
//   const [salesDropdown, setSalesDropdown] = React.useState([])
//   const [salesTableData, setSalesTableData] = React.useState([])
//   const [salesDbData, setSalesDbData] = React.useState({})

//   const fetchAllSales = async (selectedSale) => {
//     // get data from database
//     const getAllDocs = await getDocs(collection(db, "sales"));
//     const dbData = getAllDocs.docs.map((items) => ({ id: items.id, ...items.data() }))
//     let allSalesTitle = dbData.map((filterItems) => {
//       return {
//         id: filterItems.id,
//         title: filterItems.title,
//       }
//     })
//     setSalesDropdown(allSalesTitle)

//     const getSpecificSale = await getDoc(doc(db, "sales", selectedSale));
//     if (getSpecificSale.exists()) {
//       setSalesDbData(getSpecificSale.data())
//     } else {
//       console.log("No such document!");
//     }
//   };
//   React.useEffect(() => {
//     fetchAllSales(selectedSale)
//   }, [selectedSale])

//   const onAddCarousel = async (e) => {
//     e.preventDefault()
//     //post data into firestore
//     try {
//       setLoading(true)
//       await addDoc(collection(db, "carousels"), {
//         carousels: arrayUnion(...salesTableData.map((items) => {
//           return {
//             sale: {
//               brand: {
//                 name: items.brand.name,
//                 contactNo: items.brand.contactNo,
//                 website: items.brand.website,
//                 category: items.brand.category,
//                 logo: items.brand.logo,
//                 uid: items.brand.uid
//               },
//               title: items.title,
//               percentage: items.percentage,
//               startDate: items.startDate,
//               endDate: items.endDate,
//               saleURL: items.saleURL,
//               location: items.location,
//               poster: items.poster,
//               banner: items.banner,
//               createdAt: items.createdAt,
//               status: items.status
//             }
//           }
//         }))
//       })
//       carouselModalClose()
//       carouselNotificationOpen()
//       setSelectedSale('')
//       setSalesTableData([])
//           }
//     catch (error) {
//       setError(error.code);
//     }
//   }

//   const onAddCrouselsImage = () => {
//     setSalesTableData([...salesTableData, salesDbData])
//     // setSalesDropdown([...salesDropdown.filter((filterItem) => {
//     //   if (selectedSale !== filterItem.id)
//     //     return {
//     //       id: filterItem.id,
//     //       title: filterItem.title,
//     //     }
//     // })])
//   }

//   const carouselModalOpen = () => setCarouselModal(true);
//   const carouselModalClose = () => {
//     setCarouselModal(false)
//     setLoading(false)
//     setError('')
//   };
//   const carouselNotificationOpen = () => setCarouselNotification(true);
//   const carouselNotificationClose = () => setCarouselNotification(false);
//   return (
//     <>
//       <MDSnackbar
//         color="success"
//         icon="check"
//         title="Successfully Add"
//         // content="Hello, world! This is a carouselNotification message"
//         // dateTime="11 mins ago"
//         open={carouselNotification}
//         onClose={carouselNotificationClose}
//         close={carouselNotificationClose}
//       />

//       <BootstrapDialog
//         onClose={carouselModalClose}
//         aria-labelledby="customized-dialog-title"
//         open={carouselModal}
//       >
//         <BootstrapDialogTitle id="customized-dialog-title" onClose={carouselModalClose}>
//           <Typography variant="h3" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>Add Carousel</Typography>
//         </BootstrapDialogTitle>
//         <DialogContent dividers>
//           <Box
//             component="form"
//             sx={{
//               "& .MuiTextField-root": { m: 2, maxWidth: "100%", display: "flex", direction: "column", justifyContent: "center" },
//             }}
//             noValidate
//             autoComplete="off"
//           >
//             <Box sx={{ maxWidth: "100%", m: 2 }}>
//               <FormControl fullWidth >
//                 <InputLabel id="demo-simple-select-label" sx={{ height: "2.8rem" }} required>Select Sale</InputLabel>
//                 <Select
//                   sx={{ height: "2.8rem" }}
//                   labelId="demo-simple-select-label"
//                   id="demo-simple-select"
//                   label="Select Sale"
//                   value={selectedSale}
//                   onChange={(e) => setSelectedSale(e.target.value)}
//                 >
//                   {salesDropdown.map((items) => {
//                     return (
//                       <MenuItem key={items.id} value={items.id}>{items.title}</MenuItem>
//                     )
//                   })}
//                 </Select>
//               </FormControl>
//             </Box>
//             <Stack direction="row" sx={{ justifyContent: 'center', p: 1 }} spacing={2}>
//               <MDButton variant="outlined" color="info"
//                 onClick={onAddCrouselsImage}
//               >Add Carousel Image</MDButton>
//             </Stack>
//             {selectedSale === '' ? null :
//               <><Typography variant="body2" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>Added Carousels</Typography>
//                 <Box sx={{ m: 2 }}>
//                   <TableContainer component={Paper}>
//                     <Table size="small" aria-label="a dense table">
//                       <TableRow>
//                         <TableCell sx={{ fontWeight: 500 }}>Title</TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 500 }}>Brand</TableCell>
//                       </TableRow>
//                       <TableBody>
//                         {salesTableData.map((items) => (
//                           <TableRow
//                             sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                           >
//                             <TableCell component="th" scope="row">
//                               {items.title}
//                             </TableCell>
//                             <TableCell align="right">{items.brand.name}</TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Box></>}
//             {error === '' ? null :
//               <MDBox mb={2} p={1}>
//                 <TextField
//                   error
//                   id="standard-error"
//                   label="Error"
//                   InputProps={{
//                     sx: {
//                       "& input": {
//                         color: "red"
//                       }
//                     }
//                   }}
//                   // defaultValue="Invalid Data!"
//                   value={error}
//                   variant="standard"
//                 />
//               </MDBox>}
//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ justifyContent: 'center' }}>
//           {loading ?
//             <CircularProgress
//               size={30}
//               sx={{
//                 color: green[500],
//               }}
//             /> : <MDButton variant="contained" color="info" type="submit"
//               onClick={onAddCarousel}
//             >Save</MDButton>
//           }
//         </DialogActions>
//       </BootstrapDialog>

//       <DashboardLayout>
//         <DashboardNavbar />
//         <MDBox py={3}>
//           <MDBox>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <Card>
//                   <MDBox
//                     mx={2}
//                     mt={-3}
//                     py={3}
//                     px={2}
//                     variant="gradient"
//                     bgColor="info"
//                     borderRadius="lg"
//                     coloredShadow="info"
//                   >
//                     <MDBox pt={2} pb={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
//                       <MDTypography variant="h6" fontWeight="medium" color="white">
//                         All Carousels
//                       </MDTypography>
//                       <MDButton variant="gradient" color="light"
//                         onClick={() => {
//                           carouselModalOpen()
//                         }}>
//                         <Icon sx={{ fontWeight: "bold" }}>add</Icon>
//                         &nbsp;ADD Sales
//                       </MDButton>
//                     </MDBox>
//                   </MDBox>
//                   <MDBox pt={3}>
//                     <DataTable
//                       table={{ columns, rows }}
//                       isSorted={false}
//                       entriesPerPage={false}
//                       showTotalEntries={false}
//                       noEndBorder
//                     />
//                   </MDBox>
//                 </Card>
//               </Grid>
//             </Grid>
//           </MDBox>
//         </MDBox>
//         <Footer />
//       </DashboardLayout>

//     </>
//   );
// }

// export default Carousels;
