import React from "react";
import { Card, CardActions, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

class CardMedia extends React.Component {
  constructor(props) {
    super(props);
    this.state = { msnError: this.props.msn };
  }
  render() {
    return (
      <Card className={this.props.classes.media}>
        <div className={this.props.classes.video} style={{ backgroundImage: `url('${this.props.imgcover}')` }}>
          {this.props.children}
        </div>
        {TitleCard(this.props.path, this.props.classes, this.props.question)}
      </Card>
    );
  }
}

function TitleCard(path, styles, question) {
  const btnAction = (
    <CardActions>
      <Typography className={styles.title}>{question}</Typography>
    </CardActions>
  );
  return path ? (
    <Link to={path} className={styles.card}>
      {btnAction}
    </Link>
  ) : (
    btnAction
  );
}

const useStyles = (theme) => ({
  media: {
    width: "100%",
    display: "inline-block",
  },
  video: {
    height: "400px",
    backgroundColor: "black",
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden",
    zIndex: "50",
  },
  title: {
    fontSize: "13px",
    textAlign: "left",
    paddingLeft: "5px",
    paddingRight: "5px",
    paddingTop: "10px",
    height: "50px",
    color: "#777777",
    lineHeight: "14px",
    textDecoration: "none",
  },
});

export default withStyles(useStyles)(CardMedia);
