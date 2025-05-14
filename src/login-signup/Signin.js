import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { toast } from 'material-react-toastify';
import {
  
  InputAdornment,
  IconButton,
  Fade
} from '@mui/material';

import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';

import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

import { Visibility, VisibilityOff } from '@mui/icons-material';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn(props) {
  const navigate = useNavigate();

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [inpval, setInpval] = useState({
    email: "",
    password: '',
    showPassword: false,
    passwordError: false,
    passwordErrorMessage: ''
    
});
const handleChange = (prop) => (event) => {
  setInpval({ ...inpval, [prop]: event.target.value });
};

const handleClickShowPassword = () => {
  setInpval({
    ...inpval,
    showPassword: !inpval.showPassword,
  });
};

const handleMouseDownPassword = (event) => {
  event.preventDefault();
};

const setVal = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;

    setInpval(() => {
        return {
            ...inpval,
            [name]: value,
        };
    });
};


// const handleSubmit = async (e) => {
//   console.log(inpval)
//   e.preventDefault();
//   const { email, password } = inpval;
//   const expiryTime = 8 * 60 * 60; 
//   if (!email) {
//       toast.error("Email is required!");
//       return;
//   } else if (!email.includes("@")) {
//       toast.error("Invalid email format!");
//       return;
//   }

//   if (!password) {
//       toast.error("Password is required!");
//       return;
//   } else if (password.length < 6) {
//       toast.error("Password must be at least 6 characters long!");
//       return;
//   }

  
//   try {

//       const url = `http://127.0.0.1/common/clientlogin/generatetokenforclient`;
//       const data = await fetch(url, {
//           method: "POST",
//           headers: {
//               "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//               email,
//               password,
//               expiryTime,
//           }),
//       });
     
//       const res = await data.json();
//       console.log(res);

//       if (res.status === 200) {
//           localStorage.setItem("clientdatatoken", res.result.token);
//           Cookies.set("clientuserToken", res.result.token);
//           navigate("/home");
//           toast.success("Login Successfully")
//           setInpval({ ...inpval, email: "", password: "" });

//           Cookies.set("clientuserToken", res.result.token);
//       } else if (res.status === 400) {
//           toast.error("Invalid email or password!");
//       } else {
//           toast.error("An error occurred. Please try again.");
//       }
//   } catch (error) {
//       // console.error("Error:", error);
//       toast.error("An error occurred. Please try again.");
//   }
// };

  
const handleSubmit = async (e) => {
  e.preventDefault();
  const { email, password } = inpval;
  const expiryTime = 8 * 60 * 60;

  // Input validation
  if (!email) {
    toast.error("Email is required!");
    return;
  } else if (!email.includes("@")) {
    toast.error("Invalid email format!");
    return;
  }

  if (!password) {
    toast.error("Password is required!");
    return;
  } else if (password.length < 6) {
    toast.error("Password must be at least 6 characters long!");
    return;
  }

  try {
    // Check user status via GET (encode email for URL safety)
    const encodedEmail = encodeURIComponent(email);
    const checkUserUrl = `http://127.0.0.1/common/user/email/getuserbyemail/${email}`;
    
    const checkUserResponse = await fetch(checkUserUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const userData = await checkUserResponse.json();
    console.log("User data:", userData);

    // Handle user status
    if (!userData.user || userData.user.length === 0) {
      toast.error("User not found");
      return;
    }

    // Check if user is active
    if (!userData.user[0].active) {
      toast.error("You don't have access to the client portal. Please contact support.");
      return;
    }

    // If active, proceed with login (POST)
    const loginUrl = `http://127.0.0.1/common/clientlogin/generatetokenforclient`;
    const loginResponse = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, expiryTime }),
    });

    const loginResult = await loginResponse.json();

    if (loginResult.status === 200) {
      localStorage.setItem("clientdatatoken", loginResult.result.token);
      Cookies.set("clientuserToken", loginResult.result.token);
      navigate("/home");
      toast.success("Login Successful");
      setInpval({ ...inpval, email: "", password: "" });
    } else {
      toast.error(loginResult.message || "Login failed");
    }

  } catch (error) {
    console.error("Error:", error);
    toast.error("An error occurred. Please try again.");
  }
};

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          {/* <SitemarkIcon /> */}
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                value={inpval.email}
                onChange={setVal}
              />
              
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              
              <TextField
        value={inpval.password}
        onChange={handleChange('password')}
        error={inpval.passwordError}
        helperText={inpval.passwordErrorMessage}
        name="password"
        placeholder="••••••"
        type={inpval.showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        required
        fullWidth
        variant="outlined"
        color={inpval.passwordError ? 'error' : 'primary'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Fade in={inpval.password.length > 0}>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {inpval.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Fade>
            </InputAdornment>
          ),
        }}
      />
            </FormControl>
            
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign in
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </Link>
          </Box>
         
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}