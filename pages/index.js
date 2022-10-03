import React, { useState } from 'react';
import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date';
import {useTheme} from 'next-themes'
import {Grid} from '@mui/material'
import Feed from './posts/feed.js'
import Globe from '../components/globe'
import {Typography, Container, Button, Box} from '@mui/material'
import LOGO from '../assets/sigil.png'
import Image from 'next/image'

export default function Home() {

  return (
    <Layout home>
      <Head>
        <title>Phaeros</title>
      </Head>

      <div className={`${utilStyles.home}`}>

      <div className={`${utilStyles.home2}`}>

      <br/>

      <Container  sx={{
        textAlign: "center"
      }}>
      <Box sx={{
        mb: 3,
        mt: 1
      }}>
      <Image src={LOGO}
        alt="logo"
        width={75}
        height={75}/>
      </Box>
      <Typography variant='h3'
        sx={{
          color: 'primary.contrastText',
          fontWeight: 'bold',
          }}>
          Welcome to Phaeros
        </Typography>
        <Typography variant="h6"
                sx={{
                  color: '#acacad',
                  }}>
          Crowdsourced intelligence collection and analysis
        </Typography>
        
        </Container>

        <Globe />

        <br/>


        <div className={`${utilStyles.connect}`}>

        <Link href="/app">
          <Button size='large' variant="outlined" color="success"
            className="Explore-Bounties" sx={{
              backgroundColor: "green",
              fontWeight: "bold",
            }}>
            Connect
          </Button>
        </Link>
        </div>



        </div>

        </div>

    </Layout>
  );
}
