// @mui material components
import Grid from "@mui/material/Grid";

// Amdin panel React components
import MDBox from "components/MDBox";

// Amdin panel React example components
import * as React from 'react';

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Footer from "examples/Footer";

//firestore
import { messaging } from "../../firebase"
import { getToken } from "firebase/messaging";
import { db } from "../../firebase"
import { collection, doc, setDoc, addDoc, getDocs, arrayUnion } from "firebase/firestore";

// Data
import exportedObject  from "layouts/dashboard/data/reportsBarChartData";
import exportedObject2 from "layouts/dashboard/data/reportsLineChartData";

function Dashboard() {
  const [deviceTokenId, setDeviceTokenId] = React.useState('');
  const { sales, tasks } = exportedObject2;

  React.useEffect(() => {
    async function fetchData() {
      const getAllTokens = await getDocs(collection(db, "deviceTokens"));
      const dbTokenData = getAllTokens.docs.map((items) => ({ id: items.id, ...items.data() }))
      let tokenData = {}
      for (let i = 0; i < dbTokenData.length; i++) {
        Object.assign(tokenData, dbTokenData[i]);
      }
      setDeviceTokenId(tokenData.id)
    }
    fetchData();
  }, [deviceTokenId])

  const requestPermission = async () => {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const tokenGet = await getToken(messaging, { vapidKey: 'BMQlAdg-jDhd55A9MspR3lypmpUbAV4U4vugkXb6cgGgGzzWNAg7lt6pStvc4528_SbDABEac9FUP2Bnaah_An4' })
      if (tokenGet) {
        // console.log('tokenGet == ', tokenGet)

        const updateData = {
          deviceTokens: arrayUnion({ tokenId: tokenGet })
        }
        if (deviceTokenId) {
          const updDocRef = doc(db, "deviceTokens", deviceTokenId)
          await setDoc(updDocRef, updateData, { merge: true })
        }
        if (deviceTokenId === undefined) {
          await addDoc(collection(db, "deviceTokens"), {
            deviceTokens: [{ tokenId: tokenGet }]
          })
        }
      } else {
        console.log('No registration token available');
      }
    } else if (permission === "denied") {
      alert('Notification Permission Denied!');
    }
  }
  React.useEffect(() => {
    requestPermission()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <DashboardLayout>
    <DashboardNavbar />
    <MDBox py={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="dark"
              icon="weekend"
              title="Bookings"
              count={281}
              percentage={{
                color: "success",
                amount: "+55%",
                label: "than lask week",
              }}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              icon="leaderboard"
              title="Today's Users"
              count="2,300"
              percentage={{
                color: "success",
                amount: "+3%",
                label: "than last month",
              }}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="success"
              icon="store"
              title="Revenue"
              count="34k"
              percentage={{
                color: "success",
                amount: "+1%",
                label: "than yesterday",
              }}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="primary"
              icon="person_add"
              title="Followers"
              count="+91"
              percentage={{
                color: "success",
                amount: "",
                label: "Just updated",
              }}
            />
          </MDBox>
        </Grid>
      </Grid>
      <MDBox mt={4.5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={3}>
              <ReportsBarChart
                color="info"
                title="website views"
                description="Last Campaign Performance"
                date="campaign sent 2 days ago"
                chart={exportedObject }
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={3}>
              <ReportsLineChart
                color="success"
                title="daily sales"
                description={
                  <>
                    (<strong>+15%</strong>) increase in today sales.
                  </>
                }
                date="updated 4 min ago"
                chart={sales}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={3}>
              <ReportsLineChart
                color="dark"
                title="completed tasks"
                description="Last Campaign Performance"
                date="just updated"
                chart={tasks}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
    <Footer />
  </DashboardLayout>
  );
}

export default Dashboard;
