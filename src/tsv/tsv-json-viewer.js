import React, { Component } from 'react';
import { Header, Segment, Form, TextArea, Button } from 'semantic-ui-react';
import ReactJson from 'react-json-view';
import { TSV_API_HOST_PORT, TSV_JSON_VIEWER_API } from './../constants/constant';

let urlParams;
let thisCtx;


class tsvJsonViewer extends Component{
  constructor(props) {
      super(props);
      urlParams = this.props.match.params;
      this.state = {
        showTsvContent : false,
        hasTsvContent: false,
        tsvContent:'',
        resultJson: {},
        errorJson: {},
        hasJsonData: false,
        hasError: false
      };
    }

    componentDidMount(){
      thisCtx = this;
      let apiUrl = TSV_API_HOST_PORT+TSV_JSON_VIEWER_API+'/'+urlParams.msgId;

      fetch( apiUrl , {
           method: 'GET'
         })
         .then((response) => response.json())
         .then((data) => {
           //console.log('data >> '+data.errors);
           let existsJsonData = false;
           if(data.hasOwnProperty('json')){
             existsJsonData = true;
           }
           let existsJsonError = false;
           if(data.hasOwnProperty('errors')){
             existsJsonError = true;
           }
           let existsTsvContent = false;
           if(data.hasOwnProperty('tsv_content')){
             existsTsvContent = true;
           }
           thisCtx.setState({
             showTsvContent : false,
             resultJson: data.json,
             errorJson: data.errors,
             tsvContent: data.tsv_content,
             hasTsvContent: existsTsvContent,
             hasJsonData : existsJsonData,
             hasError: existsJsonError
           });
         })
         .catch((error) => {
           console.error('Error:', error);
           thisCtx.setState({
             resultJson: {}
           });
         });
    }

    toggleShowTsvContentState(){
      let isVisible = thisCtx.state.showTsvContent;
      thisCtx.setState({showTsvContent: !isVisible});
    };

    render() {

      return (
        <div>
          {this.state.hasTsvContent ? (
          <div>
            <Header as='h3' block>
              { this.state.showTsvContent ? (
              <Button content='Hide Tsv Content' color='blue' onClick = {this.toggleShowTsvContentState} />
              ):(
              <Button content='Show Tsv Content' color='blue' onClick = {this.toggleShowTsvContentState} />
              )}
            </Header>
            {this.state.showTsvContent ? (
            <Segment attached>
              <Form>
                <TextArea
                   style={{ minHeight: 200 }}
                   rows={1}
                   value={this.state.tsvContent}
                 />
              </Form>
            </Segment>
           ):""}
          </div>
          ):""}
           { this.state.hasJsonData ? (
          <div>
            <Header as='h4' block>
              Json
            </Header>
            <ReactJson src={this.state.resultJson} />
          </div>
        ) : " "}
        {this.state.hasError ? (
          <div>
            <Header as='h4' block>
              Errors
            </Header>
            <ReactJson src={this.state.errorJson} />
          </div>
        ) : " "}
      </div>
      )
    }
}

export default tsvJsonViewer;
