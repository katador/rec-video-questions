import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import VideoRec from "./pages/VideoDisplay";

class App extends Component {

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/detail/:id" component={VideoRec} />
        </Switch>
      </div>
    );
  }
}

export default App;
