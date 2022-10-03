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
  }

  async getCID(id) {
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
    const postRef = ref(db);

    return new Promise((resolve) => {
      onValue(postRef, (snapshot) => {
        const data = snapshot.val();
        //console.log("CID: " + data[id]);
        resolve(data[id]);
      });
    })
  }
  
  async getData(cid) {
    const url = 'https://' + cid + '.ipfs.dweb.link';
    const res = await this.getIPFS(url);
    if (res == undefined) {
      return "Error! Please try again.";
    }
    return res.toString();
  
  }
  
  async getIPFS(url) {
    try {
      const response = await axios.get(url);

      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  async admin() {
    const cid = await this.getCID(this.props.postData, this.getData);

    const ipfs = await this.getData(cid);

    this.setState({content: ipfs});

    if (this.state.initFlag == 0) {
      if (ipfs != undefined) {
        this.setState({ newData: this.state.content});
        this.setState({ initFlag: 1 });
      }
    }
  }

  render() {
    // call the cid and ipfs stuff, if !data, render a loading thing, if data then do the thing already here
    /// CID and actual article info processing
    this.admin();

    if(!this.state.content) {

      return (
        <Layout>
        <article>
          {/* <div className={utilStyles.lightText}>
            <Date dateString={postData.date} />
          </div> */}
              <Card sx={{
                backgroundColor: "black",
                color: "white",
                padding: 2,
                margin: 2,
              }}> 
                  Loading data from IPFS...
              </Card>
        </article>
      </Layout>
      )
    }

    if (this.state.editFlag == 1 && this.state.submitCID == undefined) {

      return (
        <Layout>
          <br/>
          <br/>
          <form onSubmit={this.handleSubmit} >
            <textarea type="text" value={this.state.newData} onChange={this.handleChange} class="rounded-md appearance-none relative inline-block w-full h-fit px-3 py-2 border border-gray-300 placeholder-gray-500 text-white-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-md"/>
            <br/>
            <br/>
            <br/>
            <input class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" type="submit" value="Submit" />
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 mx-1 rounded" onClick={() => {this.setState({editFlag: 0})}} >Cancel</button>
          </form>
        </Layout>

      )} else if (this.state.editFlag == 1 && this.state.submitCID != undefined) {

        return (
          <Layout>
            <br/>
            <br/>
            <form onSubmit={this.handleSubmit} >
              <textarea type="text" value={this.state.newData} onChange={this.handleChange} class="rounded-md appearance-none relative inline-block w-full h-fit px-3 py-2 border border-gray-300 placeholder-gray-500 text-white-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-md"/>
              <br/>
              <div>Edit successfully saved! Here is the IPFS CID for reference: {this.state.submitCID} </div>
              <br/>
              <input class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" type="submit" value="Submit" />
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 mx-1 rounded" onClick={() => {this.setState({editFlag: 0})}} >Cancel</button>
            </form>
          </Layout>

        )} else {

        return (
          <Layout>
            <article >
              <Card sx={{
                backgroundColor: "black",
                color: "white",
                padding: 2,
                margin: 2,
              }}>
                <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
                <h1>{this.props.cid}</h1>
              </Card>
              {/* <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 mx-1 rounded" onClick={() => {this.setState({editFlag: 1})}} >Edit</button> */}
            </article>
          </Layout>
    )}
  }
}
  