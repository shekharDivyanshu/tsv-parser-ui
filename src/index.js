import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import tsvParser from './tsv/tsv-parser';
import tsvJsonViewer from './tsv/tsv-json-viewer';
import * as serviceWorker from './serviceWorker';

const routing = (
  <Router>
    <div>
      <Route exact path="/" component={tsvParser} />
      <Route path="/json/:msgId" component={tsvJsonViewer} />
    </div>
  </Router>
)

ReactDOM.render(
   routing , document.getElementById('root')
);

serviceWorker.unregister();
