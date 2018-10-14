import React, { Component } from "react";
import File from "./File";
import firebase from "../firebase";

export default class FileList extends Component {
  state = {
    files: []
  };
  componentDidMount() {
    const dbRef = firebase.database().ref("public");
    dbRef.on("value", snapshot => {
      snapshot.forEach(child => {
        console.log(child.val());
        this.setState({
          files: [...this.state.files, child.val()]
        });
      });
    });
  }
  render() {
    return (
      <div>
        {this.state.files.map(file => {
          return <File key={file.uid} file={file} />;
        })}
      </div>
    );
  }
}
