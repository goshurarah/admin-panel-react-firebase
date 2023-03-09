// import PropTypes from "prop-types";

// // @mui material components
// import * as React from 'react'

// // Admin panel React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";

// // Admin panel React context
// import { useMaterialUIController } from "context";

// function Bill({ name, category, contactNo, website, title, location, percentage, saleURL, startDate, endDate, noGutter }) {
//   const [controller] = useMaterialUIController();
//   const { darkMode } = controller;
//   return (
//     <>
//       <MDBox
//         component="li"
//         display="flex"
//         justifyContent="space-between"
//         alignItems="flex-start"
//         bgColor={darkMode ? "transparent" : "grey-100"}
//         borderRadius="lg"
//         p={3}
//         mb={noGutter ? 0 : 1}
//         mt={2}
//       >
//         <MDBox width="100%" display="flex" flexDirection="column">
//           <MDBox
//             display="flex"
//             justifyContent="space-between"
//             alignItems={{ xs: "flex-start", sm: "center" }}
//             flexDirection={{ xs: "column", sm: "row" }}
//             mb={2}
//           >
//             <MDTypography variant="caption" color="text">
//               Brand Name:&nbsp;&nbsp;&nbsp;
//               <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
//                 {name}
//               </MDTypography>
//             </MDTypography>
//           </MDBox>
//           <MDBox mb={1} lineHeight={0}>
//             <MDTypography variant="caption" color="text">
//               Brand Category:&nbsp;&nbsp;&nbsp;
//               <MDTypography variant="caption" fontWeight="medium">
//                 {category}
//               </MDTypography>
//             </MDTypography>
//           </MDBox>
//           <MDBox mb={1} lineHeight={0}>
//             <MDTypography variant="caption" color="text">
//               Brand Contact Number:&nbsp;&nbsp;&nbsp;
//               <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
//                 {contactNo}
//               </MDTypography>
//             </MDTypography>
//           </MDBox>
//           <MDBox mb={1} lineHeight={0}>
//             <MDTypography variant="caption" color="text">
//               Brand Website:&nbsp;&nbsp;&nbsp;
//               <MDTypography variant="caption" fontWeight="medium">
//                 {website}
//               </MDTypography>
//             </MDTypography>
//           </MDBox>
//           <MDBox mb={1} lineHeight={0}>
//             <MDTypography variant="caption" color="text">
//               Sale title:&nbsp;&nbsp;&nbsp;
//               <MDTypography variant="caption" fontWeight="medium">
//                 {title}
//               </MDTypography>
//             </MDTypography>
//           </MDBox>
//           <MDBox mb={1} lineHeight={0}>
//             <MDTypography variant="caption" color="text">
//               Sale Location:&nbsp;&nbsp;&nbsp;
//               <MDTypography variant="caption" fontWeight="medium">
//                 {location}
//               </MDTypography>
//             </MDTypography>
//           </MDBox>
//           <MDBox mb={1} lineHeight={0}>
//             <MDTypography variant="caption" color="text">
//               Sale Percentage:&nbsp;&nbsp;&nbsp;
//               <MDTypography variant="caption" fontWeight="medium">
//                 {percentage}
//               </MDTypography>
//             </MDTypography>
//           </MDBox>
//           <MDBox mb={1} lineHeight={0}>
//             <MDTypography variant="caption" color="text">
//               Sale Website:&nbsp;&nbsp;&nbsp;
//               <MDTypography variant="caption" fontWeight="medium">
//                 {saleURL}
//               </MDTypography>
//             </MDTypography>
//           </MDBox>
//           <MDBox mb={1} lineHeight={0}>
//             <MDTypography variant="caption" color="text">
//               Sale Start:&nbsp;&nbsp;&nbsp;
//               <MDTypography variant="caption" fontWeight="medium">
//                 {startDate}
//               </MDTypography>
//             </MDTypography>
//           </MDBox>
//           <MDBox mb={1} lineHeight={0}>
//             <MDTypography variant="caption" color="text">
//               Sale End:&nbsp;&nbsp;&nbsp;
//               <MDTypography variant="caption" fontWeight="medium">
//                 {endDate}
//               </MDTypography>
//             </MDTypography>
//           </MDBox>

//         </MDBox>
//       </MDBox>
//     </>
//   );
// }

// // Setting default values for the props of Bill
// Bill.defaultProps = {
//   noGutter: false,
// };

// // Typechecking props for the Bill
// Bill.propTypes = {
//   name: PropTypes.string.isRequired,
//   category: PropTypes.string.isRequired,
//   contactNo: PropTypes.string.isRequired,
//   website: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   location: PropTypes.string.isRequired,
//   percentage: PropTypes.string.isRequired,
//   saleURL: PropTypes.string.isRequired,
//   startDate: PropTypes.string.isRequired,
//   endDate: PropTypes.string.isRequired,
//   noGutter: PropTypes.bool,
// };

// export default Bill;
