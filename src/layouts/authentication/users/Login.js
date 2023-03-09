import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Authentication
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase"
import { AuthContext } from "context/AuthContext"

// @mui material components
import { CircularProgress, Card, TextField } from '@mui/material';
import { green } from '@mui/material/colors';
import * as React from 'react'

// Amdin panel React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayoutLogin from "layouts/authentication/BasicLayoutLogin"

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

//firestore
import { db } from "../../../firebase"
import { collection, query, where, getDocs } from "firebase/firestore";


const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const [loginError, setLoginError] = useState(false)
  const [loginUser, setLoginUser] = useState({
    email: '',
    password: ''
  })
  const { dispatchAuth, dispatchAuthRole, role } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    //check authentication
    signInWithEmailAndPassword(auth, loginUser.email, loginUser.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // console.log('user == ', user.uid)
        dispatchAuth({ type: 'LOGIN', payload: user.uid })
        const q = query(collection(db, "users"), where("uid", "==", user.uid))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          dispatchAuthRole({ type: 'LOGIN_ROLE', payload: doc.data().role })
        })
        navigate(`/${role}/dashboard`)
        setLoginUser({
          email: '',
          password: ''
        })
        setLoading(false)
      })
      .catch((error) => {
        setLoginError(true)
        setLoading(false)
      });
  }
  return (
    <>
      <BasicLayoutLogin image={bgImage}>
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
              LOGIN
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                {loginError && <MDBox mb={2} p={1}>
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
                    defaultValue="Wrong email or password!"
                    variant="standard"
                  />
                </MDBox>}
                <MDInput
                  value={loginUser.email}
                  onChange={(e) => setLoginUser({
                    ...loginUser,
                    email: e.target.value
                  })}
                  type="email"
                  label="Email"
                  fullWidth
                  required
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  value={loginUser.password}
                  onChange={(e) => setLoginUser({
                    ...loginUser,
                    password: e.target.value
                  })}
                  type="password"
                  label="Password"
                  fullWidth
                  required />
              </MDBox>
              <MDBox mt={4} mb={1} sx={{ display: 'flex', direction: 'row', justifyContent: 'center' }}>
                {loading ?
                  <CircularProgress
                    size={30}
                    sx={{
                      color: green[500],
                      justifyContent: 'center'
                    }}
                  /> : <MDButton
                    // disabled={loginUser.email === '' || loginUser.password === '' ? true : false}
                    variant="gradient" color="info" fullWidth type="submit" onClick={handleLogin}>
                    LOGIN
                  </MDButton>
                }
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </BasicLayoutLogin>
    </>
  );
}

export default Login;
