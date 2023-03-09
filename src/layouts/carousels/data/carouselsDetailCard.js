import PropTypes from "prop-types";

// @mui material components
import * as React from 'react'

// Admin panel React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import { Box, Card, CardMedia, Modal } from '@mui/material'

// Admin panel React context
import { useMaterialUIController } from "context";

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

function Bill({ name, category, contactNo, website, title, location, percentage, saleURL, startDate, endDate, banner, poster, noGutter }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [bannerModal, setBannerModal] = React.useState(false);
  const [posterModal, setPosterModal] = React.useState(false);
  const bannerModalOpen = () => setBannerModal(true);
  const bannerModalClose = () => setBannerModal(false);
  const posterModalOpen = () => setPosterModal(true);
  const posterModalClose = () => setPosterModal(false); 

  return (
    <>
      <Modal
        open={bannerModal}
        onClose={bannerModalClose}
        aria-labelledby="bannerModal-bannerModal-title"
        aria-describedby="bannerModal-bannerModal-description"
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
                src={banner}
                component="img"
                title="Banner"
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
        open={posterModal}
        onClose={posterModalClose}
        aria-labelledby="bannerModal-bannerModal-title"
        aria-describedby="bannerModal-bannerModal-description"
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
                src={poster}
                component="img"
                title="Poster"
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
              Brand Name:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
                {name}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Brand Category:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {category}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Brand Contact Number:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                {contactNo}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Brand Website:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {website}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} mt={4} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Sale title:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {title}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Sale Location:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {location}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Sale Percentage:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {percentage}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Sale Website:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {saleURL}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Sale Start:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {startDate}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={0} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Sale End:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {endDate}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={0} lineHeight={0} display="flex" flexDirection="row" alignItems="center">
            <MDTypography variant="caption" color="text">
              Sale Banner Image:&nbsp;&nbsp;&nbsp;
            </MDTypography>
            <MDAvatar sx={{cursor:"pointer"}} onClick={bannerModalOpen} src={banner} size="sm" />
          </MDBox>
          <MDBox mb={0} lineHeight={0} display="flex" flexDirection="row" alignItems="center">
            <MDTypography variant="caption" color="text">
              Sale Poster Image:&nbsp;&nbsp;&nbsp;
            </MDTypography>
            <MDAvatar sx={{cursor:"pointer"}} onClick={posterModalOpen} src={poster} size="sm" />
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
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  contactNo: PropTypes.string.isRequired,
  website: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  percentage: PropTypes.string.isRequired,
  saleURL: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  banner: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Bill;
