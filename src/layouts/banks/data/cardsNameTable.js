// Admin panel React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import * as React from "react"
import { CircularProgress, OutlinedInput, DialogContentText, Button, InputAdornment, IconButton, DialogActions, Dialog, DialogTitle, DialogContent, Typography, Box, TextField, InputLabel, FormControl } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import PropTypes from 'prop-types';
import MDSnackbar from "components/MDSnackbar";
import CheckIcon from '@mui/icons-material/Check';

// Admin panel React context
import { useMaterialUIController } from "context";

//firestore
import { db, storage } from "../.../../../../firebase"
import { onSnapshot, doc, deleteDoc, arrayUnion, arrayRemove, collection, setDoc, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

//modal Styles
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function Data(dataId) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [data, setData] = React.useState([])
  const [bankCardModal, setBankCardModal] = React.useState(false);
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const [bankCardNotification, setBankCardNotification] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [imageProgress, setImageProgress] = React.useState(0);
  const [imageProgressValue, setImageProgressValue] = React.useState(0);
  const [selectedBankName, setSelectedBankName] = React.useState({})
  const [discountsId, setDiscountsId] = React.useState('')
  const [delDbBankCard, setDelDbBankCard] = React.useState({})
  const [UpdateDbBankCard, setUpdateDbBankCard] = React.useState({})
  const [bankCardFile, setBankCardFile] = React.useState('')

  // bankCardFile upload
  React.useEffect(() => {
    const uploadBankCardFile = () => {
      const name = bankCardFile.name
      const storageRef = ref(storage, `cards/${name}`);;
      const uploadTask = uploadBytesResumable(storageRef, bankCardFile);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageProgress(progress)
          setImageProgressValue(progress)
        },
        (error) => {
          console.log("ERROR == ", error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // setDelDbBankCard((prev) => ({
            //   ...prev,
            //   image: downloadURL
            // }))
            setUpdateDbBankCard((prev) => ({
              ...prev,
              image: downloadURL
            }))
          });
        }
      );

    }
    bankCardFile && uploadBankCardFile()
  }, [bankCardFile])

  React.useEffect(() => {
    const fetchData = onSnapshot(doc(db, "banks", dataId),
      (doc) => {
        setData(doc.data().cards)
        setSelectedBankName(doc.data())
      },
      (error) => {
        console.log("error == ", error)
      })
    return () => {
      fetchData()
    }
  }, [dataId])

  React.useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "discounts"), where("bank.uid", "==", dataId));
      const querySnapshotCarousel = await getDocs(q);
      querySnapshotCarousel.forEach((doc) => {
        setDiscountsId(doc.id)
      })
    }
    fetchData()
  }, [dataId])

  const onUpdateBankCard = async (e) => {
    e.preventDefault()
    //post data into firestore
    const deleteData = {
      cards: arrayRemove({
        name: delDbBankCard.name,
        category: delDbBankCard.category,
        image: delDbBankCard.image,
      })
    }
    const updateData = {
      cards: arrayUnion({
        name: UpdateDbBankCard.name,
        category: UpdateDbBankCard.category,
        image: UpdateDbBankCard.image,
      })
    }
    try {
      setLoading(true)
      if (dataId) {
        const delDocRef = doc(db, "banks", dataId)
        await setDoc(delDocRef, deleteData, { merge: true })
      }
      if (dataId) {
        const updDocRef = doc(db, "banks", dataId)
        await setDoc(updDocRef, updateData, { merge: true })
      }
      if (discountsId) {
        const carouselDocRef = doc(db, "discounts", discountsId)
        await setDoc(carouselDocRef, { bank: deleteData }, { merge: true })
      }
      if (discountsId) {
        const carouselDocRef = doc(db, "discounts", discountsId)
        await setDoc(carouselDocRef, { bank: updateData }, { merge: true })
      }
      bankCardModalClose()
      bankCardNotificationOpen()
      setImageProgress(0)
      setImageProgressValue(0)
    }
    catch (error) {
      setError(error.code)
      setLoading(false)
    }
  }

  const onDeleteBankCard = async (e, index) => {
    e.preventDefault()
    //post data into firestore
    const deleteData = {
      cards: arrayRemove({
        name: delDbBankCard.name,
        category: delDbBankCard.category,
        image: delDbBankCard.image,
      })
    }
    try {
      if (dataId) {
        const docRef = doc(db, "banks", dataId)
        await setDoc(docRef, deleteData, { merge: true })
      }
      if (discountsId) {
        const reference = doc(db, 'discounts', discountsId)
        await deleteDoc(reference)
      }
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
  const CARD_NAME = ({ name, image }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox >
    </MDBox>
  );
  const CATEGORY = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox >
    </MDBox>
  );

  const bankCardModalOpen = (index) => {
    setBankCardModal(true)
    let dbCardsData = data.filter((items, itemsIndex) => {
      if (index === itemsIndex) {
        return {
          name: items.name,
          category: items.category,
          image: items.image
        }
      }
      return false
    })
    let dbCards = {}
    for (let i = 0; i < dbCardsData.length; i++) {
      Object.assign(dbCards, dbCardsData[i]);
    }
    setDelDbBankCard(dbCards)
    setUpdateDbBankCard(dbCards)
  };
  const bankCardModalClose = () => {
    setBankCardModal(false)
    setLoading(false)
    setError('')
    setImageProgress(0)
    setImageProgressValue(0)
  };
  const deleteAlertOpen = (index) => {
    setDeleteAlert(true)
    let dbCardsData = data.filter((items, itemsIndex) => {
      if (index === itemsIndex) {
        return {
          name: items.name,
          category: items.category,
          image: items.image
        }
      }
      return false
    })
    let dbCards = {}
    for (let i = 0; i < dbCardsData.length; i++) {
      Object.assign(dbCards, dbCardsData[i]);
    }
    setDelDbBankCard(dbCards)
  }
  const deleteAlertClose = () => setDeleteAlert(false);
  const bankCardNotificationOpen = () => setBankCardNotification(true);
  const bankCardNotificationClose = () => setBankCardNotification(false);
  return {
    columns: [
      { Header: "SR NO#", accessor: "srNo", width: '10%', align: "left" },
      { Header: "Card Name", accessor: "cards", align: "left" },
      { Header: "Category", accessor: "category", align: "left" },
      { Header: "Action", accessor: "action", align: "right" }

    ],
    rows: [...data.map((items, index) => {
      return ({
        srNo: <SR_NO srNo={index + 1} />,
        cards: <CARD_NAME image={items.image} name={items.name} />,
        category: <CATEGORY name={items.category} />,
        action: (<>
          <MDSnackbar
            color="success"
            icon="check"
            title="Successfully Update"
            // content="Hello, world! This is a bankCardNotification message"
            // dateTime="11 mins ago"
            open={bankCardNotification}
            onClose={bankCardNotificationClose}
            close={bankCardNotificationClose}
          />
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
              <Button sx={{ color: 'error.main' }} onClick={onDeleteBankCard}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <BootstrapDialog
            onClose={bankCardModalClose}
            aria-labelledby="customized-dialog-title"
            open={bankCardModal}
          >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={bankCardModalClose}>
              <Typography variant="h3" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>Edit</Typography>
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Box
                component="form"
                sx={{
                  "& .MuiTextField-root": { m: 2, maxWidth: "100%", display: "flex", direction: "column", justifyContent: "center" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  label="Bank"
                  InputProps={{
                    readOnly: true,
                  }}
                  color="secondary"
                  required
                  focused
                  value={selectedBankName.name}
                />
                <TextField
                  label="Card Name"
                  type="text"
                  color="secondary"
                  required
                  value={UpdateDbBankCard.name}
                  onChange={(e) => {
                    setUpdateDbBankCard({
                      ...UpdateDbBankCard,
                      name: e.target.value
                    })
                  }}
                />
                <TextField
                  label="Card Category"
                  type="text"
                  color="secondary"
                  required
                  value={UpdateDbBankCard.category}
                  onChange={(e) => {
                    setUpdateDbBankCard({
                      ...UpdateDbBankCard,
                      category: e.target.value
                    })
                  }}
                />
                <Box sx={{ maxWidth: "100%", m: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="outlined-adornment-amount">Card Image</InputLabel>
                    <OutlinedInput
                      sx={{ height: '2.8rem' }}
                      id="outlined-adornment-amount"
                      startAdornment={<><InputAdornment position="start">
                        <input multiple type="File"
                          onChange={(e) => setBankCardFile(e.target.files[0])}
                        />
                      </InputAdornment>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                          <CircularProgress
                            variant="determinate"
                            size={25}
                            sx={{
                              color: green[500],
                            }}
                            value={imageProgress} />
                          <Box
                            sx={{
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                              position: 'absolute',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {imageProgressValue === 100 ? <CheckIcon /> : null}
                          </Box>
                        </Box></>}
                      label="Card Image"
                    />
                  </FormControl>
                </Box>
                {error === '' ? null :
                  <MDBox mb={2} p={1}>
                    <TextField
                      error
                      id="standard-error"
                      label="Error"
                      InputProps={{
                        readOnly: true,
                        sx: {
                          "& input": {
                            color: "red",
                          }
                        }
                      }}
                      // defaultValue="Invalid Data!"
                      value={error}
                      variant="standard"
                    />
                  </MDBox>}
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              {loading ?
                <CircularProgress
                  size={30}
                  sx={{
                    color: green[500],
                  }}
                /> : <MDButton
                  variant="contained" color="info" type="submit" onClick={onUpdateBankCard}>Update</MDButton>
              }
            </DialogActions>
          </BootstrapDialog>

          <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            <MDBox mr={1}>
              <MDButton variant="text" color="error" onClick={() => deleteAlertOpen(index)}>
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
            <MDButton variant="text" color={darkMode ? "white" : "dark"} onClick={() => bankCardModalOpen(index)}>
              <Icon>edit</Icon>&nbsp;edit
            </MDButton>
          </MDBox></>),
      })
    })]
  }
}
export default Data