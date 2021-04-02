import React, { Component } from "react";
import { IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Play from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import ReplayIcon from "@material-ui/icons/Replay";
import RecDisplay from "../components/displayRec.js";
import VideocamIcon from "@material-ui/icons/Videocam";
import MediaProvider from "../utils/media_provider.js";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

var mediaRecorder;
var recordedBlobs;
var recordedVideo;
var videoMedia;
var recordedVideoStorage;
var tiempoRetro = 3;
var particion = 10;

class ViewRecVideo extends React.Component {
  constructor(props) {
    super(props);

    if (this.validatePlay() && this.props.display) {
      this.state = { error: "La pregunta fue respondida", reloj: tiempoRetro, cam: false, grabar: false, stop: false, play: true, replay: false, view: true };
    } else {
      this.state = { error: "", reloj: tiempoRetro, cam: true, grabar: false, stop: false, play: false, replay: false, view: true };
    }
    this.playRecording = this.playRecording.bind(this);
    this.playStorageVideo = this.playStorageVideo.bind(this);
    this.eventButtonClick = this.eventButtonClick.bind(this);
  }

  render() {
    if (this.props.display) {
      return (
        <>
          {this.state.view && this.state.stop ? <RecDisplay timeText="00:03" timeNumer={3} /> : null}
          {this.state.view ? (
            <IconButton onClick={this.eventButtonClick} className={this.props.classes.btnPlay}>
              {this.state.cam ? <VideocamIcon /> : null}
              {this.state.grabar ? <FiberManualRecordIcon /> : null}
              {this.state.stop ? <StopIcon /> : null}
              {this.state.replay ? <ReplayIcon /> : null}
              {this.state.play ? <Play /> : null}
            </IconButton>
          ) : null}
          <>
            <MsnView error={this.props.classes.error} msn={this.state.error} />
            {this.state.play ? <video id="mostrar"></video> : <video id="grabar"></video>}
          </>
        </>
      );
    } else {
      return (
        <>
          {this.validatePlay() ? (
            <>
              <IconButton onClick={this.playStorageVideo} className={this.props.classes.btnPlay}>
                <Play />
              </IconButton>
              <video id={`${this.props.indice}reproduce`} className={this.props.classes.displayVideo}></video>
            </>
          ) : null}
        </>
      );
    }
  }

  streamCamVideo() {
    var _this = this;
    this.setState({ error: "Solicitando permisos", reloj: tiempoRetro });
    var constraints = {
      audio: true,
      video: {
        width: 1024,
        height: 576,
      },
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (mediaStream) {
        videoMedia = document.getElementById("grabar");
        videoMedia.removeAttribute("controls");
        videoMedia.srcObject = mediaStream;
        window.stream = mediaStream;
        videoMedia.onloadedmetadata = function (e) {
          videoMedia.play();
        };
        _this.setState({ error: "Camara activada - puedes iniciar la grabación", cam: false, grabar: true, stop: false, play: false, replay: false, view: true });

        var timerStream = setInterval(function () {
          _this.setState({ error: "" });
          clearInterval(timerStream);
        }, 1000);
      })
      .catch(function (err) {
        _this.setState({ error: "Se requiere permisos: " + err.message });
      });
  }

  startRecording() {
    var _this = this;
    this.setState({ cam: false, grabar: false, stop: false, play: false, replay: false, view: false });

    var refreshIntervalId = setInterval(() => {
      this.setState({ reloj: this.state.reloj - 1 });
      this.setState({ error: `La grabación inicia en ${this.state.reloj}` });

      if (this.state.reloj == 1) {
        
        clearInterval(refreshIntervalId);
        
        this.setState({ error: "", view: true, stop: true });
        recordedBlobs = [];
        let options = { mimeType: "video/webm;codecs=vp9,opus" };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          this.setState({ error: `${options.mimeType} is not supported` });
          options = { mimeType: "video/webm;codecs=vp8,opus" };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            this.setState({ error: `${options.mimeType} is not supported` });
            options = { mimeType: "video/webm" };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              this.setState({ error: `${options.mimeType} is not supported` });
              options = { mimeType: "" };
            }
          }
        }
        try {
          mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e) {
          this.setState({ error: `${e} Exception while creating MediaRecorder:` });
          return;
        }

        mediaRecorder.onstop = (event) => {
          var _this = this;
          const blob = new Blob(recordedBlobs, { type: "video/webm" });
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            var base64data = reader.result;
            let listString = _this.divider_string(base64data,particion);
            for (var i = 0; i < listString.length; i++){
              localStorage.setItem(`${_this.props.indice}video-${i}`, listString[i]);
            }
        
          };
        };

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
          }
        };
        mediaRecorder.start();

        var stopStream = setInterval(function () {
          clearInterval(stopStream);
          _this.setState({ error: "Grabacion terminada" });
          _this.stopRecording();
        }, 4000);
      }
    }, 1000);
  }

  divider_string(str, num_partes) {
    let slong = str.length;
    let long_partes = parseInt(slong/num_partes);
    let sobrante = slong % num_partes;
    let i = 0;
    let start = 0;
    let arr2 = [];
    while(i < num_partes) {
        if(i < slong) {
            let offset = (sobrante > 0) ? long_partes+1 : long_partes;
            arr2[i] =str.substr(start, offset);
            start += offset;
            sobrante--;
        } else {
            arr2[i] = '';
        }
        i++;
    }
    return arr2;
  }
  stopRecording() {
    this.setState({ grabar: false, stop: false, play: true, replay: false });
    mediaRecorder.stop();
  }

  playRecording() {
    this.setState({ grabar: false, stop: false, play: false, replay: true });
    var stringVideo = '';
    for (var i = 0; i < particion; i++){
      stringVideo += localStorage.getItem(`${this.props.indice}video-${i}`);
    }
    const bold = stringVideo;
    recordedVideo = document.getElementById("mostrar");
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = bold;
    recordedVideo.controls = true;
    recordedVideo.play();

  }

  rePlayRecording() {
    localStorage.removeItem(`${this.props.indice}video`);
    this.setState({ error: "", cam: true, grabar: false, stop: false, play: false, replay: false });   
    this.streamCamVideo();
  }
  playStorageVideo() {
    var stringVideo = '';
    for (var i = 0; i < particion; i++){
      stringVideo += localStorage.getItem(`${this.props.indice}video-${i}`);
    }

    const bold = stringVideo;
    recordedVideoStorage = document.getElementById(`${this.props.indice}reproduce`);
    recordedVideoStorage.src = bold;
    recordedVideoStorage.controls = false;
    recordedVideoStorage.play();
  }

  validatePlay() {
    const local = localStorage.getItem(`${this.props.indice}video-0`);
    if (local) {
      return true;
    } else {
      return false;
    }
  }

  eventButtonClick() {
    let click;
    click = this.state.cam ? this.streamCamVideo() : null;
    click = this.state.grabar ? this.startRecording() : null;
    click = this.state.stop ? this.stopRecording() : null;
    click = this.state.play ? this.playRecording() : null;
    click = this.state.replay ? this.rePlayRecording() : null;
    return click;
  }
}

class MsnView extends Component {
  render() {
    return this.props.msn ? <div className={this.props.error}>{this.props.msn}</div> : "";
  }
}




const useStyles = (theme) => ({
  btnPlay: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    backgroundColor: "white",
    zIndex: "200",
    "&:hover": {
      backgroundColor: "red",
      color: "white",
    },
  },
  displayVideo:{
    position: "absolute",
    left: "-200px",
  },
  error: {
    backgroundColor: "#d74747",
    color: "white",
    padding: "5px",
    fontSize: "12px",
    position: "absolute",
    width: "100%",
    bottom: "0px",
    zIndex: "99",
  },
});

export default withStyles(useStyles)(ViewRecVideo);
