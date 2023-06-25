import Grid from '@mui/material/Unstable_Grid2'
import MediaCard from '../components/MediaCard';
import Login from '../components/Login';
import { useState } from 'react';

export default function Home() {
    let [onLogin, setOnLogin] = useState(null);


    function login() {
        setOnLogin(<Login />)
    }
    return (
        <Grid container spacing={2} sx={{
            padding: '40px',
            margin: '0px'
        }}>
            <Grid item xs={3}>
                <MediaCard />
            </Grid>
            <Grid item xs={3}>
                <MediaCard />
            </Grid>
            <Grid item xs={3}>
                <MediaCard />
            </Grid>
            <Grid item xs={3}>
                <MediaCard />
            </Grid>
            <Grid item xs={3}>
                <MediaCard />
            </Grid>
            <Grid item xs={3}>
                <MediaCard />
            </Grid>
            <Grid item xs={3}>
                <MediaCard />
            </Grid>
            <Grid item xs={3}>
                <MediaCard />
                <button onClick={login}>Login</button>
            </Grid>
            <Grid item xs={3}>
                {onLogin}
            </Grid>
        </Grid >

    );
}