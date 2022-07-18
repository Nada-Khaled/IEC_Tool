import React, { Component } from 'react';
import { Header, Image, Button, Form, Divider, Icon, Table, Dropdown} from 'semantic-ui-react'
import {BasicTable} from './BasicTable';
import feedBack_icon from "../../media/feedback.jpg";
import '../../StyleSheets/project.css';
import $ from 'jquery';

class SupplyChainFeedback extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      feedbackId: 0,
      feedbackName: "",

      feedbackOptions: [],
    };
  }

  componentDidMount() {
    document.getElementById("add_feedBack").hidden = true;
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/supplyChainFeedback`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {
          //Include the bearer token in header
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " + sessionStorage.getItem("access_token")
          );
        },
        success: (result) => {
          this.setState({ feedbackOptions: result.feedback });
          return;
        },
        error: (error) => {
          alert(
            "Unable to load supplyChainFeedback. Please try your request again"
          );
          return;
        },
      });
    };
    secondFunction();
  }

  new_feedBack = () => {
    if (document.getElementById("add_feedBack").hidden) {
      document.getElementById("add_feedBack").hidden = false;
      document.getElementById("add_feedBack").scrollIntoView();
    } else {
      document.getElementById("add_feedBack").hidden = true;
      document.getElementById("table1").scrollIntoView();
    }
  };

  addFeedBack = (event) => {
    event.preventDefault();
    if (this.state.feedbackName === "") {
      alert("please add a Feedback");
    } else {
      const secondFunction = async () => {
        const result = await this.props.refreshToken();
        // do something else here after firstFunction completes

        $.ajax({
          url: `/api-iec/supplyChainFeedback`, //TODO: update request URL
          type: "POST",
          beforeSend: function (xhr) {
            //Include the bearer token in header
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + sessionStorage.getItem("access_token")
            );
          },
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify({
            name: this.state.feedbackName,
          }),
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          success: (result) => {
            $.ajax({
              url: `/api-iec/supplyChainFeedback`, //TODO: update request URL
              type: "GET",
              beforeSend: function (xhr) {
                //Include the bearer token in header
                xhr.setRequestHeader(
                  "Authorization",
                  "Bearer " + sessionStorage.getItem("access_token")
                );
              },
              success: (result) => {
                this.setState(
                  { feedbackOptions: result.feedback },
                  async () => {
                    document.getElementById("add_feedBack").hidden = true;
                    document.getElementById("table1").scrollIntoView();
                  }
                );
                return;
              },
              error: (error) => {
                alert("Unable to load Supply Chain Feedback. Please try your request again"
                );
                return;
              },
            });
            return;
          },
          error: (error) => {
            alert(
              "Unable to add the new Feedback. Please try your request again"
            );
            return;
          },
        });
      };
      secondFunction();
    }
  };

  handleFeedBackName = (event) => {
    this.setState({ feedbackName: event.target.value });
  };

  render() {
    return (
      <div>
        <Header as="h2">
          <Image circular src={feedBack_icon} /> Supply Chain Feedback
        </Header>
        <div style={{ margin: "20px" }}>
          <Button.Group widths="1">
            <Button
              id="calendar_button1"
              size="mini"
              color="red"
              onClick={this.new_feedBack}
            >
              {" "}
              Add a new Supply Chain Feedback{" "}
            </Button>
          </Button.Group>
        </div>
        <div id="table1">
          <BasicTable
            key={this.state.feedbackOptions}
            data={this.state.feedbackOptions}
          />
        </div>

        <div style={{ margin: "40px" }}></div>

        <div style={{ margin: "40px" }}></div>

        <div id="add_feedBack">
          <Form>
            <Divider horizontal>
              <Header as="h4">
                <Icon name="sign-in" />
                Supply Chain Feedback Addition
              </Header>
            </Divider>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Supply Chain Feedback</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      placeholder="Supply Chain Feedback"
                      onChange={this.handleFeedBackName}
                    />
                  </Table.Cell>
                </Table.Row>
                
              </Table.Body>
            </Table>
            
            <button id="submitNew" onClick={this.addFeedBack}>
              Submit
            </button>
          </Form>
        </div>
      </div>
    );
  }
}

export default SupplyChainFeedback;
