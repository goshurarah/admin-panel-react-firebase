// // Admin panel React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDAvatar from "components/MDAvatar";
// import { Icon } from "@mui/material";
// import { Link } from "react-router-dom";
// import MDButton from "components/MDButton";
// import * as React from "react"
// import { Button, DialogContentText, DialogActions, Dialog, DialogTitle, DialogContent } from '@mui/material'

// // Admin panel React context
// import { useMaterialUIController } from "context";

// //firestore
// import { db } from "../.../../../../firebase"
// import { getDocs, collection, doc, updateDoc, arrayRemove, query, where } from "firebase/firestore";

// function Data() {

//   const [controller] = useMaterialUIController();
//   const { darkMode } = controller;
//   const [data, setData] = React.useState([])
//   const [deleteAlert, setDeleteAlert] = React.useState(false);
//   const [deleteDataId, setDeleteDataId] = React.useState('');

//   React.useEffect(() => {
//     console.log('deleteDataId == ', deleteDataId)
//   }, [deleteDataId])

//   const fetchData = async (deleteDataId) => {
//     // get data from database
//     try {
//       const getAllDocs = await getDocs(collection(db, "carousels"));
//       const dbData = getAllDocs.docs.map((items) => ({ id: items.id, ...items.data() }))
//       let carousels = dbData.map((items) => {
//         return items.carousels
//       })
//       let saleName = carousels.flat(Infinity)
//       let brandName = saleName.map((items) => {
//         return items.sale
//       })
//       setData(brandName)
//     } catch (error) {
//       console.log('error == ', error)
//     }
//   };
//   React.useEffect(() => {
//     fetchData(deleteDataId)
//   }, [deleteDataId])

//   const onDeleteCarousels = async (e) => {
//     e.preventDefault()
//     //post data into firestore
//     // const deleteData = {
//     //   carousels: arrayRemove({dbSaleData})
//     // }
//     // try {
//     //   const docRef = doc(db, "carousels", dataId)
//     //   await setDoc(docRef, deleteData, { merge: true })
//     //   deleteAlertClose()
//     // }
//     // catch (error) {
//     //   console.error("error== ", error);
//     // }
//   }

//   const SR_NO = ({ srNo }) => (
//     <MDBox display="flex" alignItems="center" lineHeight={1}>
//       <MDBox ml={2} lineHeight={1}>
//         <MDTypography variant="body2" fontWeight="small">
//           {srNo}
//         </MDTypography>
//       </MDBox>
//     </MDBox>
//   );
//   const BRAND_NAME = ({ name, image }) => (
//     <MDBox display="flex" alignItems="center" lineHeight={1}>
//       <MDAvatar src={image} name={name} size="sm" />
//       <MDBox ml={2} lineHeight={1}>
//         <MDTypography display="block" variant="button" fontWeight="medium">
//           {name}
//         </MDTypography>
//       </MDBox >
//     </MDBox>
//   );

//   const deleteAlertOpen = (items) => {
//     setDeleteAlert(true)
//     setDeleteDataId(items.brand.uid)
//   }
//   const deleteAlertClose = () => {
//     setDeleteAlert(false)
//     setDeleteDataId('')
//   };
//   return {
//     columns: [
//       { Header: "SR NO#", accessor: "srNo", width: '10%', align: "left" },
//       { Header: "Brand Name", accessor: "brand", align: "left" },
//       { Header: "Action", accessor: "action", align: "right" }

//     ],
//     rows: [...data.map((items, index) => {
//       return ({
//         srNo: <SR_NO srNo={index + 1} />,
//         brand: <BRAND_NAME image={items.brand.logo} name={items.brand.name} />,
//         action: (<>
//           <Dialog
//             open={deleteAlert}
//             onClose={deleteAlertClose}
//             aria-labelledby="alert-dialog-title"
//             aria-describedby="alert-dialog-description"
//           >
//             <DialogTitle id="alert-dialog-title">
//               {"Alert"}
//             </DialogTitle>
//             <DialogContent>
//               <DialogContentText id="alert-dialog-description">
//                 Are you sure you want to delete this?
//               </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={deleteAlertClose}>Cancel</Button>
//               <Button sx={{ color: 'error.main' }} onClick={onDeleteCarousels}>
//                 Delete
//               </Button>
//             </DialogActions>
//           </Dialog>
//           <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
//             <Link to={`/carousels/detail/${items.brand.uid}`}>
//               <MDButton variant="text" color={darkMode ? "white" : "dark"}>
//                 <Icon>info</Icon>&nbsp;Detail
//               </MDButton>
//             </Link>
//             <MDBox mr={1}>
//               <MDButton variant="text" color="error" onClick={() => deleteAlertOpen(items)}>
//                 <Icon>delete</Icon>&nbsp;delete
//               </MDButton>
//             </MDBox>
//           </MDBox></>),
//       })
//     })]
//   }
// }
// export default Data