// Amdin panel React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import { Link } from "react-router-dom";
import * as React from "react"
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";

//firestore
import { db } from "../../../firebase"
import { collection, onSnapshot, where, getDocs, query } from "firebase/firestore";

function Data() {
  const [data, setData] = React.useState([])
  const { currentUser, role } = useContext(AuthContext)
  const [brandName, setBrandName] = React.useState('')

  React.useEffect(() => {
    if (role === 'admin') {
      const fetchData = onSnapshot(collection(db, "sales"),
        (snapshot) => {
          const saleList = snapshot.docs.map((items) => {
            return { id: items.id, ...items.data() }
          })
          setData(saleList)
        },
        (error) => {
          console.log("error == ", error)
        })
      return () => {
        fetchData()
      }
    }

    if (role === 'brand') {
      async function fetchData() {
        const q = query(collection(db, "users"), where("uid", "==", currentUser))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setBrandName(doc.data().brandName)
        })

        const q2 = query(collection(db, "sales"), where("brand.name", "==", brandName))
        onSnapshot((q2),
          (snapshot) => {
            const discountList = snapshot.docs.map((items) => {
              return { id: items.id, ...items.data() }
            })
            setData(discountList)
          },
          (error) => {
            console.log("error == ", error)
          })
      }
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandName])

  // React.useEffect(() => {
  //   if (role === 'admin') {
  //     const fetchData = onSnapshot(collection(db, "discounts"),
  //       (snapshot) => {
  //         const discountList = snapshot.docs.map((items) => {
  //           return { id: items.id, ...items.data() }
  //         })
  //         setData(discountList)
  //       },
  //       (error) => {
  //         console.log("error == ", error)
  //       })
  //     return () => {
  //       fetchData()
  //     }
  //   }

  //   if (role === 'bank') {
  //     async function fetchData() {
  //       const q = query(collection(db, "users"), where("uid", "==", currentUser))
  //       const querySnapshot = await getDocs(q);
  //       querySnapshot.forEach((doc) => {
  //         setBankName(doc.data().bankName)
  //       })

  //       const q2 = query(collection(db, "discounts"), where("bank.name", "==", bankName))
  //       onSnapshot((q2),
  //         (snapshot) => {
  //           const discountList = snapshot.docs.map((items) => {
  //             return { id: items.id, ...items.data() }
  //           })
  //           setData(discountList)
  //         },
  //         (error) => {
  //           console.log("error == ", error)
  //         })
  //     }
  //     fetchData()
  //   }
  // }, [bankName])


  const SR_NO = ({ srNo }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography variant="body2" fontWeight="small">
          {srNo}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
  const SALE_NAME = ({ name, image }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox >
    </MDBox>

  );

  return {
    columns: [
      { Header: "SR NO#", accessor: "srNo", width: '10%', align: "left" },
      { Header: "Name", accessor: "sales", align: "left" },
      { Header: "Action", accessor: "action", align: "right" }
    ],
    rows: [...data.map((items, index) => {
      return ({
        srNo: <SR_NO srNo={index + 1} />,
        sales: <SALE_NAME image={items.poster} name={items.title} />,
        action: <Link to={`/${role}/addSale/detail/${items.id}`}><MDButton variant="gradient" color="info" size="small">Detail</MDButton></Link>,
      })
    })]
  }
}
export default Data