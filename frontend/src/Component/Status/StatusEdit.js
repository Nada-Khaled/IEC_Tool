import React, { Component } from "react";
import { Header, Image, Form, Table } from "semantic-ui-react";
import vendor_icon from "../../media/vendor.png";
import "../../StyleSheets/vendor.css";
import $ from "jquery";

// DONE
class StatusEdit extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      statusId: 0,
      statusName: "",
    };
  }

  componentDidMount() {
    this.setState({ statusId: this.props.match.params.id }, async () => {
      const secondFunction = async () => {
        const result = await this.props.refreshToken();
        // do something else here after firstFunction completes
        $.ajax({
          url: `/api-iec/status/${this.state.statusId}`, //TODO: update request URL
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
              statusName: result.status.name,
            });
            return;
          },
          error: (error) => {
            alert(
              "Unable to load status to edit. Please try your request again"
            );
            return;
          },
        });
      };
      secondFunction();
    });
  }

  statusDeleteId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/status/${this.state.statusId}`, //TODO: update request URL
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
          name: this.state.statusName,
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          this.props.history.push("/status");
          return;
        },
        error: (error) => {
          $.ajax({
            url: `/api-iec/status/${this.state.statusId}`, //TODO: update request URL
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
              name: this.state.statusName,
            }),
            xhrFields: {
              withCredentials: true,
            },
            crossDomain: true,
            success: (result) => {
              this.props.history.push("/status");
              return;
            },
            error: (error) => {
              alert(
                "Unable to delete the status. Please try your request again"
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

  statusEditId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/status/${this.state.statusId}`, //TODO: update request URL
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
          name: this.state.statusName,
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          this.props.history.push("/status");
          return;
        },
        error: (error) => {
          alert(
            "Unable to update the status. Please try your request again"
          );
          return;
        },
      });
    };
    secondFunction();
  };

  cancelId = () => {
    this.props.history.push("/status");
  };

  handleStatusName = (event) => {
    this.setState({ statusName: event.target.value });
  };

  render() {
    return (
      <div>
        <div></div>
        <Header as="h2">
          <Image circular src={vendor_icon} /> Status Edit
        </Header>

        <div id="add_status">
          <Form>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Status Name</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      defaultValue={this.state.statusName}
                      onChange={this.handleStatusName}
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            <button id="submitNew" onClick={this.statusEditId}>
              Update
            </button>
            <button id="submitNew" onClick={this.statusDeleteId}>
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

export default StatusEdit;
