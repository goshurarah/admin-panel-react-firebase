// Admin panel React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import { Icon } from "@mui/material";
import { Link } from "react-router-dom";
import MDButton from "components/MDButton";
import * as React from "react"
import { Button, DialogContentText, DialogActions, Dialog, DialogTitle, DialogContent } from '@mui/material'

// Admin panel React context
import { useMaterialUIController } from "context";

//firestore
import { db } from "../.../../../../firebase"
import { getDocs, collection, doc, onSnapshot, setDoc, arrayRemove } from "firebase/firestore";

function Data() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [data, setData] = React.useState([])
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const [carouselId, setCarouselId] = React.useState('');
  const [dbCarouselSale, setDbCarouselSale] = React.useState({})

  React.useEffect(() => {
    const fetchData = onSnapshot(collection(db, "carousels"),
      (snapshot) => {
        const carouselList = snapshot.docs.map((items) => {
          return { id: items.id, ...items.data() }
        })
        let carouselData = {}
        for (let i = 0; i < carouselList.length; i++) {
          Object.assign(carouselData, carouselList[i]);
        }
        setCarouselId(carouselData.id)
        let carousels = carouselList.map((items) => {
          return items.carousels
        })
        let saleName = carousels.flat(Infinity)
        setData(saleName)
      },
      (error) => {
        console.log("error == ", error)
      })
    return () => {
      fetchData()
    }
  }, [])

  const onDeleteCarousels = async (e) => {
    e.preventDefault()
    //post data into firestore
    const deleteData = {
      carousels: arrayRemove(dbCarouselSale)
    }
    try {
      const delDocRef = doc(db, "carousels", carouselId)
      await setDoc(delDocRef, deleteData, { merge: true })
      deleteAlertClose()
    }
    catch (error) {
      console.error("error== ", error);
    }
  }

  const SR_NO = ({ srNo }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography variant="body2" fontWeight="small">
          {srNo}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
  const BRAND_NAME = ({ name, image }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox >
    </MDBox>
  );

  const deleteAlertOpen = (index) => {
    setDeleteAlert(true)
    let dbSaleData = data.filter((items, itemsIndex) => {
      if (index === itemsIndex) {
        return items
      }
    })
    let dbSale = {}
    for (let i = 0; i < dbSaleData.length; i++) {
      Object.assign(dbSale, dbSaleData[i]);
    }
    setDbCarouselSale(dbSale)
  }
  const deleteAlertClose = () => setDeleteAlert(false);
  return {
    columns: [
      { Header: "SR NO#", accessor: "srNo", width: '10%', align: "left" },
      { Header: "Brand Name", accessor: "brand", align: "left" },
      { Header: "Action", accessor: "action", align: "right" }

    ],
    rows: [...data.map((items, index) => {
      return ({
        srNo: <SR_NO srNo={index + 1} />,
        brand: <BRAND_NAME image={items.sale.brand.logo} name={items.sale.brand.name} />,
        action: (<>
          <Dialog
            open={deleteAlert}
            onClose={deleteAlertClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Alert"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={deleteAlertClose}>Cancel</Button>
              <Button sx={{ color: 'error.main' }} onClick={onDeleteCarousels}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            <Link to={`/admin/carousels/detail/${index}`}>
              <MDButton variant="text" color={darkMode ? "white" : "dark"}>
                <Icon>info</Icon>&nbsp;Detail
              </MDButton>
            </Link>
            <MDBox mr={1}>
              <MDButton variant="text" color="error" onClick={() => deleteAlertOpen(index)}>
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
          </MDBox></>),
      })
    })]
  }
}
export default Data