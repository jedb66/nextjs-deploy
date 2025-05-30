import React from 'react'
import {
    Card, CardActions, CardContent, CardMedia, Button,
    Typography, Grid
} from '@mui/material'

export async function getData() {
    // Debug: log the API URL
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/attractions`
        console.log('Fetching:', url)
        // Use { cache: 'no-store' } for SSR fetch in Next.js app directory
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }
        return res.json()
    } catch (err) {
        // Log error for debugging
        console.error('Fetch error:', err)
        return []
    }
}

export default async function page() {
    if (!process.env.NEXT_PUBLIC_API_URL) {
        // Log missing env
        console.error('NEXT_PUBLIC_API_URL is not set')
        return <div>API URL not configured.</div>
    }
    const data = await getData()
    // Defensive: handle if data is not an array
    if (!Array.isArray(data)) {
        return <div>Failed to load attractions.</div>
    }
    return (
        <div>
            <Typography variant='h5'>Attractions</Typography>
            <Grid container spacing={1}>
                {data.map(attraction => (
                    <Grid item key={attraction.id} xs={12} md={4}>
                        <Card>
                            <CardMedia
                                sx={{ height: 140 }}
                                image={attraction.coverimage}
                                title={attraction.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h6"
                                    component="div">
                                    {attraction.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary"
                                    noWrap>
                                    {attraction.detail}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <a href={`/attractions/${attraction.id}`}>
                                    <Button size="small">Learn More</Button>
                                </a>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}
