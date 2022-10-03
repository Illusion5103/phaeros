import fs from 'fs';
import path from 'path';
import utilStyles from '../../styles/utils.module.css';
import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Head from 'next/head';
import Date from '../../components/date';
import React, { useState } from 'react';
import { Formik } from 'formik';
import { Form, Field, ErrorMessage } from 'formik';
import { render } from 'react-dom';
import {Web3Storage} from 'web3.storage';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, push, update, onValue } from "firebase/database";
import { doc, onSnapshot } from "firebase/firestore";
import { LineAxisOutlined } from '@mui/icons-material';
import axios from 'axios';
import { setDefaultOptions } from 'date-fns';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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

const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY});

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
    const paths = getAllPostIds();
    return {
      paths,
      fallback: false,
    };
}

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editFlag: 0,
      id: '',
      cid: 0,
      content: '',
      newData: '',
      initFlag: 0,
      submitCID: undefined
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNew = this.handleNew.bind(this);
  }

  handleChange(event) {
    this.setState({newData: event.target.value});
  }

  async handleSubmit(event) {
    // alert('An edit was submitted: ' + this.state.newData);
    event.preventDefault();

    /// this works, but need to 
    /// 1. save as md, not json
    const str = JSON.stringify(this.state.newData, null, 2);
    const file = new File([str], 'data.json', {type: 'application/json'});
    const cid = await client.put([file], {wrapWithDirectory: false});
    // console.log(cid);
    this.setState({id: cid});
    this.saveCID(cid);
    this.setState({submitCID: cid});
  }
  
  handleNew(event) {
    event.preventDefault();

    this.setState({newData: undefined})
    this.setState({submitCID: undefined})
  }

  async saveCID(cid) {
    var database = this.props.database;
    var db =  getDatabase();
    switch(database) {
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

    // Write the new post's data in the posts list 
    const updates = {};
    // updates['/posts/' + newPostKey] = postData;
    updates[this.props.postData + 1] = cid;
    updates['count'] = this.props.postData + 1;

    return update(ref(db), updates);
  }

  render() {

    if (this.state.submitCID == undefined) {

        return (
          <Layout>
          <Card sx={{
            backgroundColor: "black",
            color: "white",
            padding: 2,
            margin: 2,
          }}>
            <form onSubmit={this.handleSubmit} className={`${utilStyles.form}`}>
              <textarea type="text" value={this.state.newData} onChange={this.handleChange} class="rounded-md appearance-none relative inline-block w-full h-fit px-3 py-2 border border-gray-300 placeholder-gray-500 text-white-900 focus:outline-none focus:ring-green-800 focus:border-green-700 focus:z-10 sm:text-md"/>
              <Box sx={{
                pt: 1.5
              }}>
              <input class="bg-green-700 hover:bg-green-900 text-white font-bold py-1 px-2 rounded" type="submit" value="Post" />
              </Box>
            </form>
            </Card>
          </Layout>   

        )} else {
  
            return (
              <Layout>
              <Card sx={{
                backgroundColor: "black",
                color: "white",
                padding: 2,
                margin: 2,
              }}>
              <form onSubmit={this.handleNew} className={`${utilStyles.form}`}>
              <div>Submission saved! Here is the IPFS CID for reference: {this.state.submitCID} </div>
                  <br/>
                  <Box sx={{
                    pt: 1.5
                  }}>
                  <input class="bg-green-700 hover:bg-green-900 text-white font-bold py-1 px-2 rounded" type="submit" value="New" />
                  </Box>
              </form>
              </Card>
              </Layout>

        )}
  }
}
  