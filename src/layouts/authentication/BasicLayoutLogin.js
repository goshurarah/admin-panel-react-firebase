// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Amdin panel React components
import MDBox from "components/MDBox";

// // Amdin panel React example components
// import DefaultNavbar from "examples/Navbars/DefaultNavbar/indexLogin";
import PageLayout from "examples/LayoutContainers/PageLayout";

// // Authentication pages components
// import Footer from "layouts/authentication/components/Footer";

function BasicLayoutLogin({ image, children }) {
  return (
    <PageLayout>
      {/* <DefaultNavbar /> */}
      <MDBox
        position="absolute"
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MDBox px={1} width="100%" height="100vh" mx="auto">
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            {children}
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer light /> */}
    </PageLayout>
  );
}

// Typechecking props for the BasicLayout
BasicLayoutLogin.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default BasicLayoutLogin;