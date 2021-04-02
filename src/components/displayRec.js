import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

class Botones extends React.Component {
  constructor(props) {
    super(props);
    this.state = {time:this.props.timeText}
    var _this = this;
    var duration = this.props.timeNumer;
    var timer =  duration,
      minutes,
      seconds;
    setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      _this.setState({ time:  minutes + ":" + seconds });
      if (--timer < 0) {
        timer = duration;
      }
    }, 1000);
  }
  render() {  
    return (
      <div className={this.props.classes.displayrec}>
        <span id="time">{this.state.time}</span> <FiberManualRecordIcon className={this.props.classes.rec} />
      </div>
    );
  }
}

const useStyles = (theme) => ({
  displayrec: {
    position: "absolute",
    right: "10px",
    top: "5px",
    fontSize: "11px",
    color: "white",
    display: "flex",
    alignItems: "center",
    paddingTop: "10px",
    zIndex: "300",
  },
  rec: {
    color: "red",
    paddingLeft: "5px",
  },
});

export default withStyles(useStyles)(Botones);
