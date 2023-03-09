// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox"
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";

// Admin panel React example components
import * as React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Bill from "layouts/discounts/data/discountsDetailCard";
import { useParams } from "react-router-dom"

//firestore
import { db } from "../../../firebase"
import { doc, onSnapshot } from "firebase/firestore";

function Detail() {
  const [data, setData] = React.useState({})
  const [brandData, setBrandData] = React.useState({})
  const [bankData, setBankData] = React.useState({})
  const [cardsData, setCardsData] = React.useState([])
  const { id } = useParams()

  React.useEffect(() => {
    const fetchDataById = onSnapshot(doc(db, "discounts", id),
      (doc) => {
        setData(doc.data())
        setBrandData(doc.data().brand)
        setBankData(doc.data().bank)
        setCardsData(doc.data().bank.cards)
      },
      (error) => {
        console.log("error == ", error.code)
      })
    return () => {
      fetchDataById()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <MDBox>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <MDBox pt={3} px={2}>
                    <MDTypography variant="h6" fontWeight="medium" sx={{ textAlign: 'center' }}>
                      Carousel Detail
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={1} pb={2} px={2}>
                    <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                      {data && <Bill
                        discountTitle={data.title}
                        brandName={brandData.name}
                        brandCategory={brandData.category}
                        brandContactNo={brandData.contactNo}
                        brandWebsite={brandData.website}
                        brandLogo={brandData.logo}
                        bankName={bankData.name}
                        bankAddress={bankData.address}
                        bankContactNo={bankData.contactNo}
                        bankCards={cardsData}
                        bankImage={bankData.image}
                        discountStartDate={data.startDate}
                        discountEndDate={data.endDate}
                        discountLocation={data.locations}
                        discountUrl={data.url}
                        discountImage={data.image}
                        dataId={id}
                      />}
                    </MDBox>
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

export default Detail;
