// // @mui material components
// import Grid from "@mui/material/Grid";

// // Admin panel React components
// import MDBox from "components/MDBox"
// import Card from "@mui/material/Card";
// import MDTypography from "components/MDTypography";

// // Admin panel React example components
// import * as React from 'react';
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import Bill from "layouts/carousels/data/carouselsDetailCard";
// import { useParams } from "react-router-dom"

// //firestore
// import { db } from "../../../firebase"
// import { query, where, collection, getDocs } from "firebase/firestore";

// function Detail() {
//   const [data, setData] = React.useState({})
//   const [brandData, setBrandData] = React.useState({})
//   const { id } = useParams()

//   const fetchDataById = async (id) => {
//     // get data from firestore
//     try {
//       const q = query(collection(db, "sales"), where("brand.uid", "==", id));
//       const querySnapshot = await getDocs(q);
//       querySnapshot.forEach((doc) => {
//         setData(doc.data())
//         setBrandData(doc.data().brand)
//         // console.log(doc.id, " => ", doc.data().brand.uid);
//         // setSaleId(doc.id)
//         // setSaleBrandId(doc.data().brand.uid)
//       });
//     } catch (error) {
//       console.log('error == ', error)
//     }
//   };
//   React.useEffect(() => {
//     fetchDataById(id)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id])

//   return (
//     <>
//       <DashboardLayout>
//         <DashboardNavbar />
//         <MDBox py={3}>
//           <MDBox>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <Card>
//                   <MDBox pt={3} px={2}>
//                     <MDTypography variant="h6" fontWeight="medium" sx={{ textAlign: 'center' }}>
//                       Carousel Detail
//                     </MDTypography>
//                   </MDBox>
//                   <MDBox pt={1} pb={2} px={2}>
//                     <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
//                       <Bill
//                         name={brandData.name}
//                         category={brandData.category}
//                         contactNo={brandData.contactNo}
//                         website={brandData.website}
//                         title={data.title}
//                         location={data.location}
//                         percentage={data.percentage}
//                         saleURL={data.saleURL}
//                         startDate={data.startDate}
//                         endDate={data.endDate}
//                       />
//                     </MDBox>
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
