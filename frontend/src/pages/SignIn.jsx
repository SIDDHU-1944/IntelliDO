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

import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";


export default function SignIn(){
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [userNameError, setuserNameError] = useState(false);
    const [userNameErrorMessage, setuserNameErrorMessage] = useState('');
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword]= useState(false);

    const validateInputs = ({username, password}) => {

        let isValid = true;

        if (!password || password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
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
        let username= data.get('username');
        let password= data.get('password');
        let isValid= validateInputs({username, password});
        if (!isValid) {
            return;
        }
        handleAuth({username, password});
    };

    const {handleLogin} = useContext(AuthContext);
    const handleAuth = async({username, password})=>{
        try{
            let result = await handleLogin(username, password);
            // console.log(result);
        }catch(err){
            console.log(err);
            // let message= (err.response.data.message);
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
                    Sign In
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
                    <FormControl sx={{display: "flex"}}>
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
                        <Link component={RouterLink} to="/register" sx={{textDecoration: "none"}}>
                            Sign Up
                        </Link>
                    </Grid>
                </Grid>
             </Paper>
        </Container>
    )
}