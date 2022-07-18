import React, { Component } from "react";
import { Header, Image, Form, Table } from "semantic-ui-react";
import vendor_icon from "../../media/vendor.png";
import "../../StyleSheets/vendor.css";
import $ from "jquery";

// DONE
class IecTypeEdit extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      iecTypeId: 0,
      iecTypeName: "",
    };
  }

  componentDidMount() {
    this.setState({ iecTypeId: this.props.match.params.id }, async () => {
      const secondFunction = async () => {
        const result = await this.props.refreshToken();
        // do something else here after firstFunction completes
        $.ajax({
          url: `/api-iec/iecType/${this.state.iecTypeId}`, //TODO: update request URL
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
              iecTypeName: result.iecType.name,
            });
            return;
          },
          error: (error) => {
            alert(
              "Unable to load iecType to edit. Please try your request again"
            );
            return;
          },
        });
      };
      secondFunction();
    });
  }

  iecTypeDeleteId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/iecType/${this.state.iecTypeId}`, //TODO: update request URL
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
          name: this.state.iecTypeName,
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          this.props.history.push("/iecType");
          return;
        },
        error: (error) => {
          $.ajax({
            url: `/api-iec/iecType/${this.state.iecTypeId}`, //TODO: update request URL
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
              name: this.state.iecTypeName,
            }),
            xhrFields: {
              withCredentials: true,
            },
            crossDomain: true,
            success: (result) => {
              this.props.history.push("/iecType");
              return;
            },
            error: (error) => {
              alert(
                "Unable to delete the iecType. Please try your request again"
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

  iecTypeEditId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/iecType/${this.state.iecTypeId}`, //TODO: update request URL
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
          name: this.state.iecTypeName,
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          this.props.history.push("/iecType");
          return;
        },
        error: (error) => {
          alert("Unable to update the iecType. Please try your request again");
          return;
        },
      });
    };
    secondFunction();
  };

  cancelId = () => {
    this.props.history.push("/iecType");
  };

  handleIecTypeName = (event) => {
    this.setState({ iecTypeName: event.target.value });
  };

  render() {
    return (
      <div>
        <div></div>
        <Header as="h2">
          <Image circular src={vendor_icon} /> IEC Type Edit
        </Header>

        <div id="add_IecType">
          <Form>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>IEC Type Name</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      defaultValue={this.state.iecTypeName}
                      onChange={this.handleIecTypeName}
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            <button id="submitNew" onClick={this.iecTypeEditId}>
              Update
            </button>
            <button id="submitNew" onClick={this.iecTypeDeleteId}>
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

export default IecTypeEdit;
