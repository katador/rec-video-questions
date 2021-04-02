import React, { Component } from "react";
import { IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Play from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import ReplayIcon from "@material-ui/icons/Replay";
import RecDisplay from "../components/displayRec.js";
import VideocamIcon from "@material-ui/icons/Videocam";
import MediaUtils from "../utils/media_utils.js";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

var mediaRecorder;
var recordedBlobs;
var recordedVideo;
var videoMedia;
var recordedVideoStorage;

var num_partes = 10;
var wait_time_rec = 5;
var time_rec_second = 3;

var time_loop_rec_second = (time_rec_second + 1) * 1000;

class ViewRecVideo extends React.Component {
  constructor(props) {
    super(props);

    if (MediaUtils.validate_save_storage(`${this.props.indice}video-0`) && this.props.display) {
      this.state = { msn_display: "La pregunta fue respondida", countdown: wait_time_rec, cam: false, grabar: false, stop: false, play: true, replay: false, view: true };
    } else {
      this.state = { msn_display: "", countdown: wait_time_rec, cam: true, grabar: false, stop: false, play: false, replay: false, view: true };
    }
    this.playRecording = this.playRecording.bind(this);
    this.playStorageVideo = this.playStorageVideo.bind(this);
    this.eventButtonClick = this.eventButtonClick.bind(this);
  }

  render() {
    if (this.props.display) {
      return (
        <>
          {this.state.view && this.state.stop ? <RecDisplay timeNumer={time_rec_second} /> : null}
          {this.state.view ? (
            <IconButton onClick={this.eventButtonClick} className={this.props.classes.btnPlay}>
              {this.state.cam ? <VideocamIcon /> : null}
              {this.state.grabar ? <FiberManualRecordIcon /> : null}
              {this.state.stop ? <StopIcon /> : null}
              {this.state.replay ? <ReplayIcon /> : null}
              {this.state.play ? <Play /> : null}
            </IconButton>
          ) : null}
          <MsnView error={this.props.classes.error} msn={this.state.msn_display} />
          {this.state.play ? <video id="mostrar"></video> : <video id="grabar"></video>}
        </>
      );
    } else {
      return (
        <>
          {MediaUtils.validate_save_storage(`${this.props.indice}video-0`) ? (
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
    this.setState({ msn_display: "Solicitando permisos", countdown: wait_time_rec });
    var constraints = {
      audio: true,
      video: {
        width: 720,
        height: 480,
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
        _this.setState({ msn_display: "Camara activada - puedes iniciar la grabación", cam: false, grabar: true, stop: false, play: false, replay: false, view: true });

        var timerStream = setInterval(function () {
          _this.setState({ msn_display: "" });
          clearInterval(timerStream);
        }, 1000);
      })
      .catch(function (err) {
        _this.setState({ msn_display: "Se requiere permisos: " + err.message });
      });
  }
  startRecording() {
    var _this = this;
    this.setState({ cam: false, grabar: false, stop: false, play: false, replay: false, view: false });

    var countdown_record = setInterval(() => {
      this.setState({ countdown: this.state.countdown - 1 });
      this.setState({ msn_display: `La grabación inicia en ${this.state.countdown}` });

      if (this.state.countdown == 1) {
        clearInterval(countdown_record);

        this.setState({ msn_display: "", view: true, stop: true });
        recordedBlobs = [];
        let options = { mimeType: "video/webm;codecs=vp9,opus" };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          this.setState({ msn_display: `${options.mimeType} is not supported` });
          options = { mimeType: "video/webm;codecs=vp8,opus" };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            this.setState({ msn_display: `${options.mimeType} is not supported` });
            options = { mimeType: "video/webm" };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              this.setState({ msn_display: `${options.mimeType} is not supported` });
              options = { mimeType: "" };
            }
          }
        }
        try {
          mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e) {
          this.setState({ msn_display: `${e} Exception while creating MediaRecorder:` });
          return;
        }
        mediaRecorder.onstop = (event) => {
          const blob = new Blob(recordedBlobs, { type: "video/webm" });
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            var base64data = reader.result;
            let array_slice_video = MediaUtils.divider_string(base64data, num_partes);
            MediaUtils.set_string_storage(array_slice_video, `${_this.props.indice}video-`);
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
          _this.setState({ msn_display: "Grabacion terminada" });
          _this.stopRecording();
        }, time_loop_rec_second);
      }
    }, 1000);
  }
  stopRecording() {
    this.setState({ grabar: false, stop: false, play: true, replay: false });
    mediaRecorder.stop();
  }
  playRecording() {
    this.setState({ grabar: false, stop: false, play: false, replay: true });
    const bold = MediaUtils.get_string_storage(num_partes, `${this.props.indice}video-`);
    recordedVideo = document.getElementById("mostrar");
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = bold;
    recordedVideo.controls = true;
    recordedVideo.play();
  }
  rePlayRecording() {
    MediaUtils.remove_string_storage(num_partes, `${this.props.indice}video-`);
    this.setState({ msn_display: "", cam: true, grabar: false, stop: false, play: false, replay: false });
    this.streamCamVideo();
  }
  playStorageVideo() {
    const bold = MediaUtils.get_string_storage(num_partes, `${this.props.indice}video-`);
    recordedVideoStorage = document.getElementById(`${this.props.indice}reproduce`);
    recordedVideoStorage.src = bold;
    recordedVideoStorage.controls = false;
    recordedVideoStorage.play();
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
  displayVideo: {
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
