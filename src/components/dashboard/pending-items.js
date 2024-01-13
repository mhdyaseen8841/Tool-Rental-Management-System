import { Card, CardContent, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

export const PendingItems = ({ values , ...props }) => {

    return (
        <Grid container spacing={1}>
        {
            values.map((item)=> (
                <Grid item xs={6} sm={3} md={2} xl={1.71} key={item.itemId}>
                <Card
                    sx={{boxShadow:'0 0 2px #aaa9 ' }}
                    {...props}
                >
                    <CardContent>
                        <Grid
                            container
                            sx={{ justifyContent: 'space-between' }}
                        >
                            <Grid item>
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                    variant="overline"
                                    sx={{
                                        textTransform:'uppercase'
                                    }}
                                >
                                    {item.iName}
                                </Typography>
                                <Typography
                                    color="primary"
                                    variant="h4"
                                >
                                    {item.aStock}
                                    
                                </Typography>
                            </Grid>
                        </Grid>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >

                            <Typography
                                color="textSecondary"
                                variant="caption"
                            >
                                Available {item.iName}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
                </Grid>
            ))
    }
    </Grid>
    
  )
}
