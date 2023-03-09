import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase"
import { collection, addDoc, doc, setDoc } from "firebase/firestore";


// @mui material components
import Card from "@mui/material/Card";

// Amdin panel React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { CircularProgress, InputLabel, MenuItem, FormControl, TextField, Select } from '@mui/material'
import { green } from "@mui/material/colors";
import * as React from 'react'

// Authentication layout components
import BasicLayout from "layouts/authentication/BasicLayout"

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Signup() {
  const [loading, setLoading] = React.useState(false);
  const [signupError, setSignupError] = useState(false)
  const [signupCustomError, setSignupCustomError] = useState(false)
  const [signupUser, setSignupUser] = useState({
    email: '',
    password: '',
    role: '',
    bankName: '',
    brandName: '',
    uid: ''
  })
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    //post credentials into authentication

    if (signupUser.bankName !== '' || signupUser.brandName !== '' || signupUser.role === 'admin') {
      try {
        const user = await createUserWithEmailAndPassword(auth, signupUser.email, signupUser.password)
        navigate("/login")
        if (signupUser.role === 'admin' || signupUser.role === 'bank' || signupUser.role === 'brand') {
          let docId = await addDoc(collection(db, 'users'), {
            email: signupUser.email,
            password: signupUser.password,
            role: signupUser.role,
            uid: user.user.uid,
          })
          const updateBankData = {
            bankName: signupUser.bankName.toLowerCase().replace(/\s+/g, '').trim()
          }
          if (signupUser.role === 'bank') {
            const DocRef = doc(db, "users", docId.id)
            await setDoc(DocRef, updateBankData, { merge: true })
          }
          const updateBrandData = {
            brandName: signupUser.brandName.toLowerCase().replace(/\s+/g, '').trim()
          }
          if (signupUser.role === 'brand') {
            const DocRef = doc(db, "users", docId.id)
            await setDoc(DocRef, updateBrandData, { merge: true })
          }
        }
        setSignupUser({
          email: '',
          password: '',
          role: '',
          uid: '',
          bankName: '',
          brandName: '',
        })

        setLoading(false)
      } catch (error) {
        setSignupError(error.code);
        setLoading(false)
      }
    }
    else {
      setSignupCustomError(true)
      setLoading(false)

    }
  }

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h5" fontWeight="medium" color="white" mt={1}>
            SIGN UP
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {signupError && <MDBox mb={2} p={1}>
            <TextField
              fullWidth
              InputProps={{
                readOnly: true,
                sx: {
                  "& input": {
                    color: "red",
                  }
                }
              }}
              error
              label="Error"
              value={signupError}
              variant="standard"
            />
          </MDBox>}
          {signupCustomError === false ? null : <MDBox mb={2} p={1}>
            <TextField
              fullWidth
              InputProps={{
                readOnly: true,
                sx: {
                  "& input": {
                    color: "red",
                  }
                }
              }}
              error
              label="Error"
              value="Please fill input field!"
              variant="standard"
            />
          </MDBox>}
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                value={signupUser.email}
                onChange={(e) => setSignupUser({
                  ...signupUser,
                  email: e.target.value
                })}
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                value={signupUser.password}
                onChange={(e) => setSignupUser({
                  ...signupUser,
                  password: e.target.value
                })}
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                required />
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth variant="standard">
                <InputLabel id="demo-simple-select-label" sx={{ height: "2.8rem" }} required>Select Role</InputLabel>
                <Select
                  sx={{ height: "1.8rem" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={signupUser.role}
                  label="Select Role"
                  onChange={(e) => setSignupUser({
                    ...signupUser,
                    role: e.target.value
                  })}
                >
                  <MenuItem value={'admin'}>admin</MenuItem>
                  <MenuItem value={'bank'}>bank</MenuItem>
                  <MenuItem value={'brand'}>brand</MenuItem>
                </Select>
              </FormControl>
            </MDBox>
            {signupUser.role !== 'bank' ? null : <MDBox mb={2}>
              <MDInput
                value={signupUser.bankName}
                onChange={(e) => setSignupUser({
                  ...signupUser,
                  bankName: e.target.value
                })}
                type="text"
                label="Bank Name"
                variant="standard"
                fullWidth
                required />
            </MDBox>}
            {signupUser.role !== 'brand' ? null : <MDBox mb={2}>
              <MDInput
                value={signupUser.brandName}
                onChange={(e) => setSignupUser({
                  ...signupUser,
                  brandName: e.target.value
                })}
                type="text"
                label="Brand Name"
                variant="standard"
                fullWidth
                required />
            </MDBox>}
            <MDBox mt={4} mb={1} sx={{ display: 'flex', direction: 'row', justifyContent: 'center' }}>
              {loading ?
                <CircularProgress
                  size={30}
                  sx={{
                    color: green[500],
                    justifyContent: 'center'
                  }}
                /> : <MDButton
                  // disabled={signupUser.email === '' || signupUser.password === '' || signupUser.role === '' ? true : false}
                  variant="gradient" color="info" fullWidth type="submit" onClick={handleSignup}>
                  SIGN UP
                </MDButton>
              }
            </MDBox>
          </MDBox>
        </MDBox>
      </Card >
    </BasicLayout>
  );
}

export default Signup;
