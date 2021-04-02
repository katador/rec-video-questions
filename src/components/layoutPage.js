import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

class LayoutPage extends React.Component {
  render() {
    return (
      <div className={this.props.classes.page}>
        <Container maxWidth="md" className={this.props.classes.pagecontent}>
          {this.props.children}
        </Container>
      </div>
    );
  }
}

const useStyles = (theme) => ({
  page: {
    height: "100vh",
    width: "100vw",
    overflow: "auto",
    position: "fixed",
    backgroundColor: "rgb(204, 204, 204)",
  },
  pagecontent: {
    paddingTop: "30px",
    paddingBottom: "30px",
  },
});

export default withStyles(useStyles)(LayoutPage);
