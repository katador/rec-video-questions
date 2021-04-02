import React from "react";
import { withStyles } from "@material-ui/core/styles";
import questions from "../data/questions.json";
import LayoutPage from "../components/layoutPage.js";
import CardMedia from "../components/cardMedia.js";
import ViewRecVideo from "../components/viewRecVideo.js";
import Navigation from "../utils/navigation.js";

class VideoRec extends React.Component {
  render() {
    const { id } = this.props.match.params;
    const question = questions.map((question) => {
      return question;
    });
    return (
      <LayoutPage>
        <>{Navigation.volver("/", this.props.classes)}</>
        <CardMedia imgcover={question[id].cover} question={question[id].question}>
          <ViewRecVideo display={true} indice={id}></ViewRecVideo>
        </CardMedia>
        <>
          {Navigation.BtnBack(id, this.props.classes)} {Navigation.BtnGo(id, this.props.classes, question)}
        </>
      </LayoutPage>
    );
  }
}

const useStyles = (theme) => ({
  linkBack: {
    float: "left",
    display: "block",
    padding: "10px",
  },
  page: {
    paddingTop: "30px",
  },
  btnLeft: {
    float: "left",
    padding: "10px",
  },
  btnRight: {
    float: "right",
    padding: "10px",
  },
  arrow: {
    fontSize: "12px",
  },
});

export default withStyles(useStyles)(VideoRec);
