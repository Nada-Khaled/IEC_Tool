import React, { Component } from "react";
import {
  Header,
  Image,
  Button,
  Form,
  Divider,
  Icon,
  Table,
} from "semantic-ui-react";
import { BasicTable } from "./BasicTable";
import vendor_icon from "../../media/vendor.png";
import "../../StyleSheets/vendor.css";
import $ from "jquery";

// DONE
class Status extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      status: [],
      statusName: "",
    };
  }

  componentDidMount() {
    document.getElementById("add_status").hidden = true;
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/status`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {
          //Include the bearer token in header
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " + sessionStorage.getItem("access_token")
          );
        },
        success: (result) => {
          this.setState({ status: result.status });
          return;
        },
        error: (error) => {
          alert("Unable to load status. Please try your request again");
          return;
        },
      });
    };
    secondFunction();
  }

  new_status = () => {
    if (document.getElementById("add_status").hidden) {
      document.getElementById("add_status").hidden = false;
      document.getElementById("add_status").scrollIntoView();
    } else {
      document.getElementById("add_status").hidden = true;
      document.getElementById("table1").scrollIntoView();
    }
  };

  addStatus = (event) => {
    console.log("in add status:")
    console.log("Bearer " + sessionStorage.getItem("access_token"));
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/status`, //TODO: update request URL
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
          name: this.state.statusName,
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          $.ajax({
            url: `/api-iec/status`, //TODO: update request URL
            type: "GET",
            beforeSend: function (xhr) {
              //Include the bearer token in header
              xhr.setRequestHeader(
                "Authorization",
                "Bearer " + sessionStorage.getItem("access_token")
              );
            },
            success: (result) => {
              this.setState({ status: result.status }, async () => {
                document.getElementById("add_status").hidden = true;
                document.getElementById("table1").scrollIntoView();
              });
              return;
            },
            error: (error) => {
              alert(
                "Unable to load status. Please try your request again"
              );
              return;
            },
          });
          return;
        },
        error: (error) => {
          alert(
            "Unable to add the new status. Please try your request again"
          );
          return;
        },
      });
    };
    secondFunction();
  };

  handleStatusName = (event) => {
    this.setState({ statusName: event.target.value });
  };

  render() {
    return (
      <div>
        <div></div>
        <Header as="h2">
          <Image circular src={vendor_icon} /> Status
        </Header>
        <div style={{ margin: "20px" }}>
          <Button.Group widths="1">
            <Button
              id="calendar_button1"
              size="mini"
              color="red"
              onClick={this.new_status}
            >
              {" "}
              Add a new status{" "}
            </Button>
          </Button.Group>
        </div>
        <div id="table1">
          <BasicTable
            key={this.state.status}
            data={this.state.status}
          />
        </div>

        <div style={{ margin: "40px" }}></div>

        <div style={{ margin: "40px" }}></div>

        <div id="add_status">
          <Form>
            <Divider horizontal>
              <Header as="h4">
                <Icon name="sign-in" />
                Status Addition
              </Header>
            </Divider>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Status Name</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      placeholder="Status Name"
                      onChange={this.handleStatusName}
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            <button id="submitNew" onClick={this.addStatus}>
              Submit
            </button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Status;
