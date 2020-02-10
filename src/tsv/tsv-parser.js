import React, { Component } from 'react';
import { Header, Segment, Form, TextArea, Button } from 'semantic-ui-react';
import ReactJson from 'react-json-view';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { TSV_API_HOST_PORT, TSV_PARSER_API_URI } from './../constants/constant';

let tsvContentText = '';
let thisCtx;
let jsonUrl;

class tsvParser extends Component{
  constructor(props) {
      super(props);
      this.state = {
        resultJson:{},
        errorJson: {},
        url:'',
        hasJsonData: false,
        hasError: false,
        hasUrl: false
      };
    }

    componentDidMount(){
      thisCtx = this;
    }
    tsv2json(){
      if(tsvContentText.length > 0){
         fetch( TSV_API_HOST_PORT+TSV_PARSER_API_URI , {
            method: 'POST',
            body: tsvContentText
          })
          .then((response) => response.json())
          .then((data) => {
            //console.log('data >> '+JSON.stringify(data.errors));
            jsonUrl = window.location.origin+'/json/'+data.msgId;
            let existsJsonData = false;
            if(data.hasOwnProperty('json')){
              existsJsonData = true;
            }
            let existsJsonError = false;
            if(data.hasOwnProperty('errors')){
              existsJsonError = true;
            }
            let existsJsonUrl = false;
            if(data.hasOwnProperty('msgId')){
              existsJsonUrl = true;
            }
            thisCtx.setState({
              resultJson: data.json,
              errorJson: data.errors,
              url: jsonUrl,
              hasUrl: existsJsonUrl,
              hasJsonData : existsJsonData,
              hasError: existsJsonError
            });
          })
          .catch((error) => {
            //console.error('check Error:', JSON.stringify(error));
            thisCtx.setState({
              resultJson: {},
              errorJson: {'error':"Error is converting tsv to Json. Please check all services are up and running !!!"},
              hasError: true
            });
          });
        }
    };

    updateTsvContent(data){
       tsvContentText = data;
    }

    copyUrlToClipboard = (url) => {
      const el = this.state.url
      el.select()
      document.execCommand("copy")
    }

    render() {

      return (
        <div>
          <div>
            <Header as='h3' block>
              TSV to JSON Parser
            </Header>
            <Segment attached>
              <Form>
                <TextArea
                   placeholder='Paste tsv file content here then click submit..'
                   style={{ minHeight: 200 }}
                   rows={1}
                   onChange={(e, { value }) => this.updateTsvContent(value)}
                 />
              </Form>
              <Button content='Submit' color='blue' onClick = {this.tsv2json} />
            </Segment>
          </div>
          { this.state.hasUrl ? (
          <div>
            <Segment clearing>
              <Header as='h4' floated='right'>
                <CopyToClipboard text={this.state.url} >
                   <Button floated='right' >Copy url</Button>
                </CopyToClipboard>
              </Header>
              <Header as='h4' floated='left'>
                {this.state.url}
              </Header>
            </Segment>
          </div>
           ) : " "}
           { this.state.hasJsonData ? (
          <div>
            <Header as='h4' block>
              Result Json
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
      );
    }
}

export default tsvParser;
