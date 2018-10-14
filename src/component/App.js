import React, { Component } from "react";
import Dropzone from "react-dropzone";
import FileList from "./FileList";
import firebase from "../firebase";
import uuid from "uuid/v4";
import "./App.css";

class App extends Component {
  state = { user: null, isPublic: true, files: [], comment: "" };
  constructor(props) {
    super(props);

    this.onDropHandler = this.onDrop.bind(this);
    this.onSubmitHandler = this.onSubmit.bind(this);
    this.onRemoveHandler = this.onRemove.bind(this);
    this.onCommentChangeHandler = this.onCommentChange.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
  }

  render() {
    return (
      <div className="App">
        <div>桃栗アップローダー</div>
        {this.state.user ? <Dropzone onDrop={this.onDropHandler} /> : null}
        {this.state.files.map(file => {
          return (
            <p key={file.name}>
              {file.name}
              <span
                className="remove"
                onClick={() => this.onRemoveHandler(file.name)}
              >
                Remove
              </span>
            </p>
          );
        })}
        <input type="checkbox" onChange={this.changeHandler} />
        公開
        <br />
        <input type="text" onChange={this.onCommentChangeHandler} />
        コメント
        <br />
        <div onClick={this.onSubmitHandler}>アップロードする</div>
        <div onClick={this.login}>Auth</div>
        <FileList user={this.state.user} />
      </div>
    );
  }

  login() {
    const provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  onDrop(files, _) {
    this.setState({ files: [...this.state.files, ...files] });
  }

  onSubmit() {
    this.state.files.forEach(file => {
      this.upload(file);
    });
  }

  onRemove(fileName) {
    const index = this.state.files.map(f => f.name).indexOf(fileName);
    if (index === -1) {
      return;
    }
    const newFiles = [...this.state.files];
    newFiles.splice(index, 1);

    this.setState({ files: [...newFiles] });
  }

  onCommentChange(e) {
    this.setState({
      comment: e.target.value
    });
  }

  upload(file) {
    const storageRef = firebase.storage().ref("momokuri-uploader");
    const uid = uuid();
    const extension = file.name.split(".")[1];
    const fileRef = storageRef.child(uid + "." + extension);
    const user = this.state.user;
    const comment = this.state.comment;
    const path = this.state.isPublic ? "public/" : "private/";
    const user_uid = this.state.isPublic ? "" : user.uid + "/";

    fileRef.put(file).then(snapshot => {
      const dbRef = firebase.database().ref(path + uid + "/" + user_uid);
      dbRef.set({
        uid: uid,
        user_uid: user.uid,
        filename: file.name,
        extension: extension,
        comment: comment
      });
    });
  }
}

export default App;
