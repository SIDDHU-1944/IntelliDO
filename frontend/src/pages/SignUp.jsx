import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";


import { useContext, useState } from "react";
import  AuthContext from "../context/AuthContext";


export default function SignUp(){
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [userNameError, setuserNameError] = useState(false);
    const [userNameErrorMessage, setuserNameErrorMessage] = useState('');
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword]= useState(false);

    const validateInputs = ({name,username, email, password}) => {

        let isValid = true;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password || password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!name || name.length < 1) {
            setNameError(true);
            setNameErrorMessage('Name is required.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        if(!username || !/^[a-zA-Z0-9_-]+$/.test(username)){
            setuserNameError(true);
            setuserNameErrorMessage('UserName can only have contain letters, numbers, hyphens (-), and underscores (_).');
            isValid = false;
        }else{
            setuserNameError(false);
            setuserNameErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let name=data.get('name');
        let username= data.get('username');
        let email= data.get('email');
        let password= data.get('password');
        let isValid= validateInputs({name,username, email, password});
        if (!isValid) {
            return;
        }
        handleAuth({name,username, email, password});
    };

    const {handleRegister} = useContext(AuthContext);
    const handleAuth = async({name,username, email, password})=>{
        try{
        let result = await handleRegister(name, username, email,password);
        console.log(result);
        // setMessage(result);
        // setSnakOpen(true);
        }catch(err){
        console.log(err);
        let message= (err.response.data.message);
        // setMessage(message);
        // setSnakOpen(true);
        }
    }
    return (
        <Container maxWidth="xs">
             <Paper elevation={10} sx={{marginTop: 8, padding: 2}}> 
                <Avatar sx={{
                    mx: "auto",
                    bgcolor: 'secondary.main',
                    textAlign: "center",
                    mb:1,
                }}>
                    <LockOutlineIcon/>
                </Avatar>
                <Typography component="h1" variant="h5" sx={{textAlign: "center"}}>
                    Sign Up
                </Typography>
                <Box 
                component="form" 
                onSubmit={handleSubmit}
                noValidate
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: 1,
                }}
                >
                    <FormControl>
                        <FormLabel htmlFor="name">FullName</FormLabel>
                        <TextField
                         placeholder="Enter Fullname"
                         name="name"
                         id="name"
                         autoComplete="name"
                         fullWidth
                         required
                         autoFocus
                         error={nameError}
                         helperText={nameErrorMessage}
                         color={nameError ? 'error' : 'primary'}
                         sx={{mb:2}}
                        ></TextField>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="username">UserName</FormLabel>
                        <TextField
                         placeholder="Enter Username"
                         name="username"
                         id="username"
                         fullWidth
                         required
                         error={userNameError}
                         helperText={userNameErrorMessage}
                         color={userNameError ? 'error' : 'primary'}
                         sx={{mb:2}}
                        ></TextField>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                         placeholder="Enter EmailId"
                         name="email"
                         id="email"
                         fullWidth
                         required
                         type="email"
                         error={emailError}
                         helperText={emailErrorMessage}
                         color={passwordError ? 'error' : 'primary'}
                         sx={{mb:2}}
                        ></TextField>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                         placeholder="Enter password"
                         name="password"
                         id="password"
                         fullWidth
                         required
                         type={showPassword ? "text" : "password"}
                         onChange={(e)=>{setPassword(e.target.value)}}
                         value={password}
                         error={passwordError}
                         helperText={passwordErrorMessage}
                         color={passwordError ? 'error' : 'primary'}
                         sx={{mb:2}}
                         InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword((show) => !show)}
                                edge="end"
                                tabIndex={-1}
                                >
                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                            ),
                         }}
                        >
                        </TextField>
                    </FormControl>

                    <FormControlLabel 
                      control={<Checkbox value="remember" color="primary"/>}
                      label ="Remember me"
                    />

                    <Button type="submit" variant="contained" fullWidth sx={{mt: 1}}>
                        Submit
                    </Button>
                </Box>
                <Grid container justifyContent="space-between" sx={{mt: 1}}>
                    <Grid >
                        <Link component={RouterLink} to="/forgot" sx={{textDecoration: "none"}}>
                            Forgot Password
                        </Link>
                    </Grid>
                    <Grid >
                        <Link component={RouterLink} to="/login" sx={{textDecoration: "none"}}>
                            Sign In
                        </Link>
                    </Grid>
                </Grid>
             </Paper>
        </Container>
    )
}