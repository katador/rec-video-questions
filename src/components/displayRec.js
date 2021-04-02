import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

class Botones extends React.Component {
  constructor(props) {
    super(props);
    this.state = {time:"00:00"}
    var _this = this;
    var duration = this.props.timeNumer;
    var timer =  duration,
      minutes,
      seconds;
   var tiempo =  setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      _this.setState({ time:  minutes + ":" + seconds });
      if (--timer < 0) {
        timer = duration;
      }
      if(seconds == 0){
        clearInterval(tiempo)
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
    backgroundColor:"#3b3b3b6e",
    right: "10px",
    top: "5px",
    fontSize: "11px",
    color: "white",
    display: "flex",
    alignItems: "center",
    padding: "2px 5px 2px 10px",
    zIndex: "300",
    fontWeight:"bold",
    borderRadius:"9px",
    marginTop: "10px"
  },
  rec: {
    color: "red",
    paddingLeft: "5px",
  },
});

export default withStyles(useStyles)(Botones);
