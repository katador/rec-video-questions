import React from "react";
import { withStyles } from "@material-ui/core/styles";
import questions from "../data/questions.json";
import LayoutPage from "../components/layoutPage.js";
import CardMedia from "../components/cardMedia.js";
import ViewRecVideo from "../components/viewRecVideo.js";

class Home extends React.Component {
  render() {
    return (
      <LayoutPage>
        <h3>Video cuestionario</h3>
        {questions.map((question, index) => {
          return (
            <div key={`card-${index}`} className={this.props.classes.card}>
              <CardMedia path={`/detail/${index}`} question={question.question} imgcover={question.cover}>
                <ViewRecVideo indice={index} display={false}></ViewRecVideo>
              </CardMedia>
            </div>
          );
        })}
      </LayoutPage>
    );
  }
}

const useStyles = (theme) => ({
  card: {
    width: "210px",
    display: "inline-block",
    marginLeft: "5px",
    marginRight: "5px",
    marginTop: "20px",
  },
});

export default withStyles(useStyles)(Home);
