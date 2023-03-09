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
import Bill from "layouts/carousels/data/carouselsDetailCard";
import { useParams } from "react-router-dom"

//firestore
import { db } from "../../../firebase"
import { collection, onSnapshot } from "firebase/firestore";

function Detail() {
  const [data, setData] = React.useState({})
  const [brandData, setBrandData] = React.useState({})
  const { id } = useParams()
  const paramsId = Number(id)

  React.useEffect(() => {
    const fetchData = onSnapshot(collection(db, "carousels"),
      (snapshot) => {
        const carouselList = snapshot.docs.map((items) => {
          return { id: items.id, ...items.data() }
        })
        let carousels = carouselList.map((items) => {
          return items.carousels
        })
        let saleName = carousels.flat(Infinity)
        let dbData = saleName.filter((filterItems, filterIndex) => {
          if (filterIndex === paramsId) {
            return filterItems
          }
        })
        let carouselObj = {}
        for (let i = 0; i < dbData.length; i++) {
          Object.assign(carouselObj, dbData[i]);
        }
        setData(carouselObj.sale)
        setBrandData(carouselObj.sale.brand)
      },
      (error) => {
        console.log("error == ", error)
      })
    return () => {
      fetchData()
    }
  }, [paramsId])

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
                        name={brandData.name}
                        category={brandData.category}
                        contactNo={brandData.contactNo}
                        website={brandData.website}
                        title={data.title}
                        location={data.location}
                        percentage={data.percentage}
                        saleURL={data.saleURL}
                        startDate={data.startDate}
                        endDate={data.endDate}
                        banner={data.banner}
                        poster={data.poster}
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
