// // @mui material components
// import Grid from "@mui/material/Grid";

// // Admin panel React components
// import MDBox from "components/MDBox"
// import Card from "@mui/material/Card";
// import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";
// import Icon from "@mui/material/Icon";
// import { OutlinedInput, InputAdornment, IconButton, DialogActions, Dialog, DialogTitle, DialogContent, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Box, TextField, InputLabel, FormControl } from '@mui/material'
// import CloseIcon from '@mui/icons-material/Close';
// import { styled } from '@mui/material/styles';
// import PropTypes from 'prop-types';

// // Admin panel React example components
// import * as React from 'react';
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import Bill from "layouts/banks/data/banksDetailCard";
// import DataTable from "examples/Tables/DataTable";
// import { useParams, useNavigate } from "react-router-dom"

// // Data
// import cardsNameTable from "layouts/banks/data/cardsNameTable"

// //firestore
// import { db, storage } from "../.../../../../firebase"
// import { doc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
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

// function Detail() {
//   const { id } = useParams()
//   const { columns, rows } = cardsNameTable(id)
//   const [data, setData] = React.useState({})
//   const [bankCardModal, setBankCardModal] = React.useState(false);
//   const [bankCardFile, setBankCardFile] = React.useState('')
//   const [bankCardsData, setBankCardsData] = React.useState([])
//   const [selectedBankName, setSelectedBankName] = React.useState({})
//   const [banksCardData, setBanksCardData] = React.useState({
//     name: '',
//     category: ''
//   })
//   const [banksCardTableData, setBanksCardTableData] = React.useState([])
//   const navigate = useNavigate();

//   const fetchDataById = async () => {
//     // get data from firestore
//     try {
//       const getSpecificDoc = await getDoc(doc(db, "banks", id));
//       if (getSpecificDoc.exists()) {
//         setData(getSpecificDoc.data())
//       } else {
//         console.log("No such document!");
//       }
//     } catch (error) {
//       console.log('error == ', error)
//     }
//   };
//   React.useEffect(() => {
//     fetchDataById()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   // bankCardFile upload
//   React.useEffect(() => {
//     const uploadBankCardFile = () => {
//       const name = bankCardFile.name
//       const storageRef = ref(storage, `cards/${name}`);;
//       const uploadTask = uploadBytesResumable(storageRef, bankCardFile);
//       uploadTask.on('state_changed',
//         (snapshot) => {
//           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           console.log('Upload is ' + progress + '% done');
//           switch (snapshot.state) {
//             case 'paused':
//               console.log('Upload is paused');
//               break;
//             case 'running':
//               console.log('Upload is running');
//               break;
//             default:
//               break;
//           }
//         },
//         (error) => {
//           console.log("ERROR == ", error)
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             setBanksCardData((prev) => ({
//               ...prev,
//               image: downloadURL
//             }))
//           });
//         }
//       );

//     }
//     bankCardFile && uploadBankCardFile()
//   }, [bankCardFile])

//   const fetchAllBanks = async (id) => {
//     // get data from database
//     try {
//       const bankName = doc(db, "banks", id)
//       const getSpecificBankName = await getDoc(bankName);
//       if (getSpecificBankName.exists()) {
//         setSelectedBankName(getSpecificBankName.data())
//       } else {
//         console.log("No such document!");
//       }

//       const docRef = doc(db, "banks", id)
//       const getSpecificDoc = await getDoc(docRef);
//       if (getSpecificDoc.exists()) {
//         setBankCardsData(getSpecificDoc.data().cards)
//       } else {
//         console.log("No such document!");
//       }
//     } catch (error) {
//       console.log('error == ', error)
//     }
//   };
//   React.useEffect(() => {
//     fetchAllBanks(id)
//   }, [id])

//   const onAddBankCard = async (e) => {
//     e.preventDefault()
//     //post data into firestore
//     const updateData = {
//       cards: arrayUnion(...banksCardTableData.map((items) => {
//         return {
//           name: items.name,
//           category: items.category,
//           image: banksCardData.image,
//         }
//       }))
//     }

//     try {
//       const docRef = doc(db, "banks", id)
//       await setDoc(docRef, updateData, { merge: true })
//       bankCardModalClose()
//       navigate("/banks")
//     }
//     catch (error) {
//       console.error("error== ", error);
//     }
//   }

//   const onAddCards = () => {
//     setBanksCardTableData([...banksCardTableData, {
//       name: banksCardData.name,
//       category: banksCardData.category
//     }])
//     setBanksCardData({
//       name: '',
//       category: ''
//     })
//   }

//   const bankCardModalOpen = () => setBankCardModal(true);
//   const bankCardModalClose = () => {
//     setBankCardModal(false)
//   };
//   return (
//     <>
//       <BootstrapDialog
//         onClose={bankCardModalClose}
//         aria-labelledby="customized-dialog-title"
//         open={bankCardModal}
//       >
//         <BootstrapDialogTitle id="customized-dialog-title" onClose={bankCardModalClose}>
//           <Typography variant="h3" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>Add Bank Card</Typography>
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
//             <TextField
//               label="Bank"
//               InputProps={{
//                 readOnly: true,
//               }}
//               color="secondary"
//               required
//               value={selectedBankName.name}
//             />
//             <Typography variant="body2" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>{selectedBankName.name} Cards</Typography>
//             <Box sx={{ m: 2 }}>
//               <TableContainer component={Paper}>
//                 <Table size="small" aria-label="a dense table">
//                   <TableRow sx={{ bgcolor: 'blue' }}>
//                     <TableCell sx={{ fontWeight: 500, color: "#FFFFFF" }}>Name</TableCell>
//                     <TableCell align="right" sx={{ fontWeight: 500, color: "#FFFFFF" }}>Category</TableCell>
//                   </TableRow>
//                   <TableBody>
//                     {bankCardsData.map((items) => (
//                       <TableRow
//                         key={items.id}
//                         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                       >
//                         <TableCell component="th" scope="row">
//                           {items.name}
//                         </TableCell>
//                         <TableCell align="right">{items.category}</TableCell>
//                       </TableRow>
//                     ))}
//                     {banksCardTableData.map((items) => (
//                       <TableRow
//                         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                       >
//                         <TableCell component="th" scope="row">
//                           {items.name}
//                         </TableCell>
//                         <TableCell align="right">{items.category}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Box>
//             <TextField
//               label="Card Name"
//               type="text"
//               rows={1}
//               color="secondary"
//               required
//               value={banksCardData.name}
//               onChange={(e) => {
//                 setBanksCardData({
//                   ...banksCardData,
//                   name: e.target.value
//                 })
//               }}
//             />
//             <TextField
//               label="Card Category"
//               type="text"
//               rows={1}
//               color="secondary"
//               required
//               value={banksCardData.category}
//               onChange={(e) => {
//                 setBanksCardData({
//                   ...banksCardData,
//                   category: e.target.value
//                 })
//               }}
//             />
//             <Box sx={{ maxWidth: "100%", m: 2 }}>
//               <FormControl fullWidth>
//                 <InputLabel htmlFor="outlined-adornment-amount">Card Image</InputLabel>
//                 <OutlinedInput
//                   sx={{ height: '2.8rem' }}
//                   id="outlined-adornment-amount"
//                   startAdornment={<InputAdornment position="start">
//                     <input multiple type="File"
//                       onChange={(e) => setBankCardFile(e.target.files[0])}
//                     />
//                   </InputAdornment>}
//                   label="Card Image"
//                 />
//               </FormControl>
//             </Box>
//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ justifyContent: 'center' }}>
//           <MDButton variant="outlined" color="info"
//             onClick={onAddCards}
//           >Add Card</MDButton>
//           <MDButton
//             variant="contained" color="info" type="submit" onClick={onAddBankCard}>Save</MDButton>
//         </DialogActions>
//       </BootstrapDialog>

//       <DashboardLayout>
//         <DashboardNavbar />
//         <MDBox py={3}>
//           <MDBox>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <Card>
//                   <MDBox pt={3} px={2}>
//                     <MDTypography variant="h6" fontWeight="medium" sx={{ textAlign: 'center' }}>
//                       Bank Detail
//                     </MDTypography>
//                   </MDBox>
//                   <MDBox pt={1} pb={2} px={2}>
//                     <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
//                       <Bill
//                         name={data.name}
//                         contactNo={data.contactNo}
//                         address={data.address}
//                         dataId={id}
//                       />
//                     </MDBox>
//                   </MDBox>
//                 </Card>
//               </Grid>
//             </Grid>
//           </MDBox>
//         </MDBox>
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
//                         Bank Cards
//                       </MDTypography>
//                       <MDButton variant="gradient" color="light"
//                         onClick={() => {
//                           bankCardModalOpen()
//                         }}>
//                         <Icon sx={{ fontWeight: "bold" }}>add</Icon>
//                         &nbsp;ADD BANK CARD
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
//                       dataId={id}
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

// export default Detail;
