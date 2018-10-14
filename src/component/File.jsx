import React, { Component } from "react";
import firebase from "../firebase";

export default class File extends Component {
  state = {
    link: null
  };

  componentDidMount() {
    this.downloadLink(this.props.file).then(link => {
      this.setState({ link });
    });
  }

  render() {
    const { file } = this.props;
    return (
      <div>
        {this.state.link ? (
          <a href={this.state.link}>{this.props.file.filename} </a>
        ) : (
          this.props.file.filename
        )}
        {file.comment ? <span>{file.comment}</span> : null}
      </div>
    );
  }

  async downloadLink(file) {
    const storageRef = firebase.storage().ref("momokuri-uploader");
    const fileRef = storageRef.child(file.uid + "." + file.extension);
    const downloadUrl = await fileRef.getDownloadURL();
    return downloadUrl;
  }
}
