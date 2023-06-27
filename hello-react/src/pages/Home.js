import Grid from '@mui/material/Unstable_Grid2'
import MediaCard from '../components/MediaCard';
import Signin from '../components/Signin';
import { useState } from 'react';

export default function Home() {
    let [onSignin, setOnSignin] = useState(null);


    function signin() {
        setOnSignin(<Signin />)
    }
    return (
        <Grid container spacing={2} sx={{
            padding: '40px',
            margin: '0px'
        }}>
            <button onClick={signin}>Login</button>
            {onSignin}

        </Grid >

    );
}