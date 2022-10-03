import React, { useState } from 'react';
import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import {Grid} from '@mui/material'
import Feed from '../components/feed.js'
import Post from '../components/post.js'
import LOGO from '../assets/sigil.png'
import Image from 'next/image'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, push, update, onValue } from "firebase/database";

const db1 = initializeApp({
  // landing
  databaseURL: process.env.NEXT_PUBLIC_DB_1,
});

const db2 = initializeApp({
  // taiwan collection
  databaseURL: process.env.NEXT_PUBLIC_DB_2,
}, 'db2');

const db3 = initializeApp({
  // taiwan analysis
  databaseURL: process.env.NEXT_PUBLIC_DB_3,
}, 'db3');

const db4 = initializeApp({
  // markets collection
  databaseURL: process.env.NEXT_PUBLIC_DB_4,
}, 'db4');

const db5 = initializeApp({
  // markets analysis
  databaseURL: process.env.NEXT_PUBLIC_DB_5,
}, 'db5');

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: 'Phaeros',
      mode: 'Terminal',
      id: 'Taiwancol',
      posts: [],
      count: 0,
      database: 'db1'
    }
  }
  
  async getCount() {
    var db =  getDatabase();
    switch(this.state.database) {
      case "db1":
        db = getDatabase(db1);
        break;
      case "db2":
        db = getDatabase(db2);
        break;
      case "db3":
        db = getDatabase(db3);
        break;
      case "db4":
        db = getDatabase(db4);
        break;
      case "db5":
        db = getDatabase(db5);
        break;
      default:
        db = getDatabase(db1);
    }
    const postRef = ref(db);
  
    return new Promise((resolve) => {
      onValue(postRef, (snapshot) => {
        const data = snapshot.val();
        console.log("Count: " + data['count']);
        if (data['count'] != this.state.count) {
          this.setState({posts: Array.from(Array(data['count'] + 1).keys())});
          this.setState({count: data['count']});
        }
        resolve(data['count']);
      });
    })
  }

  changeMode(mode) {
    this.setState({mode: mode});
    if (this.state.topic == 'Taiwan') {
      if (mode == 'Collection') {
        this.setState({database: 'db2'});
      } else {
        this.setState({database: 'db3'});
      }
    } else if (this.state.topic == 'Markets') {
      if (mode == 'Collection') {
        this.setState({database: 'db4'});
      } else {
        this.setState({database: 'db5'});
      }
    }
  }

  changeTopic(topic) {
    this.setState({topic: topic});
    if (topic == 'Taiwan') {
      if (this.state.mode == 'Collection') {
        this.setState({database: 'db2'});
      } else {
        this.setState({database: 'db3'});
      }
    } else if (topic == 'Markets') {
      if (this.state.mode == 'Collection') {
        this.setState({database: 'db4'});
      } else {
        this.setState({database: 'db5'});
      }
    }
  }

  async postCounter() {

  }

  async admin() {
    this.getCount(this.postCounter);
  }

  
  render() {
    this.admin();

    return (
    <Layout home>
      <Head>
        <title>Phaeros</title>
      </Head>


      <Grid container spacing={{ xs: 0, md: 0 }} columns={{ xs: 1, sm: 1, md: 3, lg: 3, xl: 3 }}>
        <Grid item xs={.25} sm={.25} md={.25} lg={.25} xl={.25}>
      <section className={`${utilStyles.investigationTopic}`}>
        <div class="grid grid-cols-1 divide-green-500 divide-y-2">


          <div>
            <div className={`${utilStyles.topicHeader1}`}>
              <Link href="/">
                <Image src={LOGO}
                        alt="logo"
                        width={50}
                        height={50}/>
              </Link>
            </div>

          </div>
          <div></div>
          </div>

          <div class="grid grid-cols-1 divide-black divide-y-2">
          <div >
          <button className={`${utilStyles.invTopicClass}`} onClick={() => this.changeTopic('Taiwan')}>
              Taiwan
          </button>
          </div>

          <div >
          <button className={`${utilStyles.invTopicClass}`} onClick={() => this.changeTopic('Markets')}>
              Markets
          </button>
          </div>

          {/* <div >
          <button className={`${utilStyles.invTopicClass}`} onClick={() => setInv('Iran')}>
              Iran Uprisings
          </button>
          </div>

          <div className={`${utilStyles.bottom}`}>
          <button className={`${utilStyles.invTopicClass}`} onClick={() => setInv('+')}>
              +
          </button>
          </div> */}

          <div className={`${utilStyles.bottom}`}>
          <Link href="/">
          <button className={`${utilStyles.invTopicClass}`} >
              Logout
          </button>
          </Link>
          </div>
          <div></div>
        </div>
      </section>
      </Grid>

      <Grid item xs={.5} sm={.5} md={.5} lg={.5} xl={.5}>
      <section className={`${utilStyles.middleSection}`}>

        <div className={`${utilStyles.topicHeader}`}>
          <text >
            {this.state.topic} {this.state.mode}
          </text>
        </div>

        <div class="grid grid-cols-1 divide-green-500 divide-y-2">
          <div></div>
          <div></div>
        </div>
        <div class="grid grid-cols-1 divide-green-800 divide-y-2">
          <div className={`${utilStyles.topicCard1}`}> 
            <button onClick={() => (this.changeMode('Collection'))}>
              Collection
              {/* <br/>
              <text className={`${utilStyles.topicDesc}`}>
                Atomic primary sources
              </text> */}
            </button>
          </div>

          <div className={`${utilStyles.topicCard22}`}>
            <button className={`${utilStyles.topicCard2}`} onClick={() => (this.changeMode('Analysis'))}>

              Analysis
              {/* <br/>
              <text className={`${utilStyles.topicDesc}`}>
                Making sense of the raw intel
              </text> */}
            </button>
          </div>

          {/* <div className={`${utilStyles.topicCard22}`}>
            <button className={`${utilStyles.topicCard2}`} onClick={() => (setMode('Case File'), setId(inv + 'anl'))}>

              Case File

            </button>
          </div>

          <div className={`${utilStyles.topicCard22}`}>
            <button className={`${utilStyles.topicCard2}`} onClick={() => (setMode('Board'), setId(inv + 'anl'))}>

              Board


            </button>
          </div> */}

          {/* <div className={`${utilStyles.topicCard3}`}>
            <button onClick={() => (setMode('Analysis'), setId('taiwananl'))}>
              <br/>
              Sources
              <br/>
              <text className={`${utilStyles.topicDesc}`}>
                Add an intelligence source
              </text>
            </button>
          </div> */}

          <div></div>

        </div>
      </section>
      </Grid>

      <Grid item xs={2.25} sm={2.25} md={2.25} lg={2.25} xl={2.25}>
      <section className={`${utilStyles.headingMd}`}>


        {/* <div class="grid grid-cols-1 divide-green-700 divide-y-2">
          <div className={`${utilStyles.topicHeader}`}>
            <text >
              {mode}
            </text>
          </div>
          <div></div>
        </div> */}

          <div >
            <div class="overflow-y-auto h-screen">
                <Post postData={this.state.count} database={this.state.database}/>

                {this.state.posts.map((element, index) => (
                    <Feed postData={index} database={this.state.database}/>
                ))}
            </div>
          </div>

          {/* <h2 className={utilStyles.headingLg}> </h2>
          <ul class="grid grid-cols-2 gap-4">
            {allPostsData.map(({ id, date, title }) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href={`/posts/${id}`}>
                  <a>{title}</a>
                </Link>
                <br />
              </li>
            ))}
          </ul> */}

      </section>
      </Grid>
      </Grid>

    </Layout>
  );
  }
}
