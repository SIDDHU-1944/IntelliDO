import styles from "../components/LandingPage/LandingPage.module.css"
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

export default function LandingPage(){
    const routeTo= useNavigate();
    return (
        <div className={styles.landingPageContainer}>
            <div className={styles.navbar}>
                <h1>INTELLIDO</h1>
            </div>
            <div className={styles.mainConatiner}>
                <div className={styles.leftPanel}>
                    <div className={styles.mainTag} style={{fontSize: "3rem"}}>
                        <h1>Create and Manage tasks</h1>
                        <button></button>
                        <Button variant="contained" onClick={()=>{routeTo("/login")}}>Login/SignUp</Button>
                    </div>
                </div>
                <div className={styles.rightPanel}>
                    <img src="/bgLanding.png" alt="image"/>
                </div>
            </div>
        </div>
    )
}