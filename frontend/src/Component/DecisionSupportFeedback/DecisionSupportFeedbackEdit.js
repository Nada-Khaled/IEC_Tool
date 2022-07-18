import React, { Component } from "react";
import {
  Header,
  Image,
  Form,
  Table,
  Dropdown,
  Button,
  Divider,
} from "semantic-ui-react";
import feedBack_icon from "../../media/feedback.jpg";
import "../../StyleSheets/project.css";
import $ from "jquery";

class DecisionSupportFeedbackEdit extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      feedbackId: 0,
      feedbackName: "",

      feedbackOptions: [],
    };
  }
  componentDidMount() {
    this.setState({ feedbackId: this.props.match.params.id }, async () => {
      const secondFunction = async () => {
        const result = await this.props.refreshToken();

        $.ajax({
          url: `/api-iec/decisionSupportFeedback`, //TODO: update request URL
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
              "Unable to load Decision Support Feedback. Please try your request again"
            );
            return;
          },
        });

        $.ajax({
          url: `/api-iec/decisionSupportFeedback/${this.state.feedbackId}`, //TODO: update request URL
          type: "GET",
          beforeSend: function (xhr) {
            //Include the bearer token in header
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + sessionStorage.getItem("access_token")
            );
          },
          success: (result) => {
            this.setState({
              feedbackName: result["feedback"].name,
            });
            return;
          },
          error: (error) => {
            alert(
              "Unable to load Decision Support Feedback to edit. Please try your request again"
            );
            return;
          },
        });
      };
      secondFunction();
    });
  }

  feedBackDeleteId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      // do something else here after firstFunction completes

      $.ajax({
        url: `/api-iec/decisionSupportFeedback/${this.state.feedbackId}`, //TODO: update request URL
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
          editAction: "delete",
          name: this.state.feedbackName,
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          this.props.history.push("/decisionSupportFeedback");
          return;
        },
        error: (error) => {
          $.ajax({
            url: `/api-iec/decisionSupportFeedback/${this.state.feedbackId}`, //TODO: update request URL
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
              editAction: "deactivate",
              name: this.state.feedbackName,
            }),
            xhrFields: {
              withCredentials: true,
            },
            crossDomain: true,
            success: (result) => {
              this.props.history.push("/decisionSupportFeedback");
              return;
            },
            error: (error) => {
              alert(
                "Unable to delete the Decision Support Feedback. Please try your request again"
              );
              return;
            },
          });
          return;
        },
      });
    };
    secondFunction();
  };

  feedBackEditId = (event) => {
    event.preventDefault();
    if (this.state.feedbackName === "") {
      alert("please add Decision Support Feedback");
    } else {
      const secondFunction = async () => {
        const result = await this.props.refreshToken();
        // do something else here after firstFunction completes

        $.ajax({
          url: `/api-iec/decisionSupportFeedback/${this.state.feedbackId}`, //TODO: update request URL
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
            editAction: "edit",
            name: this.state.feedbackName,
          }),
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          success: (result) => {
            this.props.history.push("/decisionSupportFeedback");
            return;
          },
          error: (error) => {
            alert(
              "Unable to update Decision Support Feedback. Please try your request again"
            );
            return;
          },
        });
      };
      secondFunction();
    }
  };

  cancelId = () => {
    // Search for what this line do??????
    this.props.history.push("/decisionSupportFeedback");
  };

  handleFeedBackName = (event) => {
    this.setState({ feedbackName: event.target.value });
  };

  render() {
    return (
      <div>
        <div></div>
        <Header as="h2">
          <Image circular src={feedBack_icon} /> Decision Support Feedback Edit
        </Header>

        <div id="add_feedBack">
          <Form>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Decision Support Feedback</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      defaultValue={this.state.feedbackName}
                      onChange={this.handleFeedBackName}
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            <button id="submitNew" onClick={this.feedBackEditId}>
              Update
            </button>
            <button id="submitNew" onClick={this.feedBackDeleteId}>
              Delete
            </button>
            <button id="submitNew" onClick={this.cancelId}>
              Cancel
            </button>
          </Form>
        </div>
      </div>
    );
  }
}

export default DecisionSupportFeedbackEdit;
