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
class IecType extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      iecType: [],
      iecTypeName: "",
    };
  }

  componentDidMount() {
    document.getElementById("add_iecType").hidden = true;
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/iecType`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {
          //Include the bearer token in header
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " + sessionStorage.getItem("access_token")
          );
        },
        success: (result) => {
          this.setState({ iecType: result.iecType });
          return;
        },
        error: (error) => {
          alert("Unable to load iecType. Please try your request again");
          return;
        },
      });
    };
    secondFunction();
  }

  new_iecType = () => {
    if (document.getElementById("add_iecType").hidden) {
      document.getElementById("add_iecType").hidden = false;
      document.getElementById("add_iecType").scrollIntoView();
    } else {
      document.getElementById("add_iecType").hidden = true;
      document.getElementById("table1").scrollIntoView();
    }
  };

  addIecType = (event) => {
    console.log("in add IecType:");
    console.log("Bearer " + sessionStorage.getItem("access_token"));
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/iecType`, //TODO: update request URL
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
          name: this.state.iecTypeName,
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          $.ajax({
            url: `/api-iec/iecType`, //TODO: update request URL
            type: "GET",
            beforeSend: function (xhr) {
              //Include the bearer token in header
              xhr.setRequestHeader(
                "Authorization",
                "Bearer " + sessionStorage.getItem("access_token")
              );
            },
            success: (result) => {
              this.setState({ iecType: result.iecType }, async () => {
                document.getElementById("add_iecType").hidden = true;
                document.getElementById("table1").scrollIntoView();
              });
              return;
            },
            error: (error) => {
              alert("Unable to load iecType. Please try your request again");
              return;
            },
          });
          return;
        },
        error: (error) => {
          alert("Unable to add the new iecType. Please try your request again");
          return;
        },
      });
    };
    secondFunction();
  };

  handleIecTypeName = (event) => {
    this.setState({ iecTypeName: event.target.value });
  };

  render() {
    return (
      <div>
        <div></div>
        <Header as="h2">
          <Image circular src={vendor_icon} /> Iec Type
        </Header>
        <div style={{ margin: "20px" }}>
          <Button.Group widths="1">
            <Button
              id="calendar_button1"
              size="mini"
              color="red"
              onClick={this.new_iecType}
            >
              {" "}
              Add a new IEC Type{" "}
            </Button>
          </Button.Group>
        </div>
        <div id="table1">
          <BasicTable key={this.state.iecType} data={this.state.iecType} />
        </div>

        <div style={{ margin: "40px" }}></div>

        <div style={{ margin: "40px" }}></div>

        <div id="add_iecType">
          <Form>
            <Divider horizontal>
              <Header as="h4">
                <Icon name="sign-in" />
                IEC Type Addition
              </Header>
            </Divider>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>IEC Type Name</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      placeholder="IEC Type Name"
                      onChange={this.handleIecTypeName}
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            <button id="submitNew" onClick={this.addIecType}>
              Submit
            </button>
          </Form>
        </div>
      </div>
    );
  }
}

export default IecType;
