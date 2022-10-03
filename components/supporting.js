import React from "react";
import { Card, Box } from '@mui/material';
import utilStyles from '../styles/utils.module.css';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, push, update, onValue } from "firebase/database";
import Dropdown from 'muicss/lib/react/dropdown';
import DropdownItem from 'muicss/lib/react/dropdown-item';
import { UpdateRounded } from "@mui/icons-material";


const db6 = initializeApp({
    // taiwan supporting
    databaseURL: process.env.NEXT_PUBLIC_DB_6,
  }, 'db6');
  
  const db7 = initializeApp({
    // markets supporting
    databaseURL: process.env.NEXT_PUBLIC_DB_7,
  }, 'db7');
  
  const db2 = initializeApp({
    // taiwan collection
    databaseURL: process.env.NEXT_PUBLIC_DB_2,
  }, 'db2');
  
  const db4 = initializeApp({
    // markets collection
    databaseURL: process.env.NEXT_PUBLIC_DB_4,
  }, 'db4');

export default class Supporting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            count: 0,
            topicPosts: [],
            topicCount: 0
        }

        this.saveSupporting = this.saveSupporting.bind(this);
    }

    addNew(id) {
      let newArray = this.state.posts;
      newArray[newArray.length] = id;
      this.saveSupporting(newArray);
    }

    saveSupporting(newArray) {
      var id = this.props.current;

      console.log(id);

      var database = this.props.database;
      var db =  getDatabase(db7);

      switch(database) {
        case "db1":
          db = getDatabase(db6);
          break;
        case "db2":
          db = getDatabase(db6);
          break;
        case "db3":
          db = getDatabase(db6);
          break;
        case "db4":
          db = getDatabase(db7);
          break;
        case "db5":
          db = getDatabase(db7);
          break;
        default:
          db = getDatabase(db6);
      }

      let updates = {};
      updates[id] = [];

      for (let i = 0; i < newArray.length; i++) {
        updates[id][i] = newArray[i];
      }

      updates[id][99] = newArray.length;

      update(ref(db), updates);
    }

    admin() {
        var id = this.props.current;

        var database = this.props.database;
        var db =  getDatabase(db7);

        switch(database) {
          case "db1":
            db = getDatabase(db6);
            break;
          case "db2":
            db = getDatabase(db6);
            break;
          case "db3":
            db = getDatabase(db6);
            break;
          case "db4":
            db = getDatabase(db7);
            break;
          case "db5":
            db = getDatabase(db7);
            break;
          default:
            db = getDatabase(db6);
        }
        
        const postRef = ref(db);

        return new Promise((resolve) => {
          onValue(postRef, (snapshot) => {
            const data = snapshot.val();
            //console.log("TEST: " + data[1][2]);
            if (data[id]) {
              var count = data[id][99];
              if (this.state.count != count) {
                  let array = [];
                  for (let i = 0; i < count; i++) {
                      array[i] = data[id][i];
                  }
                  this.setState({posts: array, count: count});
              }
            }
            resolve();
          });
        })
    }

    dropdownPrep() {
      var id = this.props.current;

      var database = this.props.database;
      var dbTopic = getDatabase(db2);
      switch(database) {
        case "db2":
          dbTopic = getDatabase(db2);
          break;
        case "db3":
          dbTopic = getDatabase(db2);
          break;
        case "db4":
          dbTopic = getDatabase(db4);
          break;
        case "db5":
          dbTopic = getDatabase(db4);
          break;
        default:
          db = getDatabase(db2);
      }

      const postRef = ref(dbTopic);

      return new Promise((resolve) => {
        onValue(postRef, (snapshot) => {
          const data = snapshot.val();

          var count = data['count'];

          if (this.state.topicCount != count) {
              let array = [];
              for (let i = 1; i < count + 2; i++) {
                  array[i] = i;
              }
              this.setState({topicPosts: array, topicCount: count});
          }
          resolve();
        });
      })
    }

    render() {
        this.admin();
        this.dropdownPrep();

        return (
            <div className={`${utilStyles.supportingContainer}`}>
            <Card sx={{
                backgroundColor: 'black',
                color: "white",
              }}>
                Supporting Intel: 

                    {this.state.posts.map((element, index) => (
                        <Card className={`${utilStyles.supporting}`} sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            pl: 1,
                            pr: 1,
                            ml: 1,
                            mr: 1
                        }}>{element}</Card>
                    ))}
                    
                    <Card className={`${utilStyles.supporting}`} sx={{
                        backgroundColor: '#0c6900',
                        color: 'white',
                        pl: 1,
                        pr: 1,
                        ml: 1,
                        mr: 1
                    }}>
                    <Dropdown color="default" label="+" placement="right">
                      {this.state.topicPosts.map((element, index) => (
                        <DropdownItem className={`${utilStyles.supportingNew}`} onClick={() => (this.addNew(index))}>{index}</DropdownItem>
                      ))}
                    </Dropdown>
                    </Card>
              </Card>
              </div>
        )
    }
}