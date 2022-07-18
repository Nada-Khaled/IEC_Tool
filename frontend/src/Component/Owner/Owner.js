import React, { Component } from 'react';
import { Header, Image, Button, Form, Divider, Icon, Table, Dropdown} from 'semantic-ui-react'
import {BasicTable} from './BasicTable';
import project_icon from '../../media/project.png';
import '../../StyleSheets/project.css';
import $ from 'jquery';

//! DIDN'T FINISH IT YET
class Owner extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      owners: [],
      ownerName: "",
      department_name: 0,

      departments: [],

      selectTagStyle: {
      input: (base, state) => ({
        ...base,
        '[type="text"]': {
          color: "black",
        },
      }),
      }
    };

  }

  componentDidMount() {


    console.log("Bearer " + sessionStorage.getItem("access_token"))

    document.getElementById("add_owner").hidden = true;
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      
      // load all departments once component is loaded
      $.ajax({
        url: `/api-iec/departments`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {
          //Include the bearer token in header
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " + sessionStorage.getItem("access_token")
          );
        },
        success: (result) => {
          
          // this.setState({ departments: result.department });
          result.department.forEach(element => {
            this.state.departments.push(element.name);
          });
          
          return;
        },
        error: (error) => {
          alert(
            "Unable to load departments list. Please try your request again"
          );
          return;
        },
      });
    };
    secondFunction();
  }

  new_owner = () => {
    if (document.getElementById("add_owner").hidden) {
      document.getElementById("add_owner").hidden = false;
      document.getElementById("add_owner").scrollIntoView();
    } else {
      document.getElementById("add_owner").hidden = true;
      document.getElementById("table1").scrollIntoView();
    }
    console.log("list el departments:")
    console.log(this.state.departments)
  };

  addOwner = (event) => {
    event.preventDefault();
    if (this.state.ownerName === "") {
      alert("please add owner's name");
    }
    if (this.state.department_name === "") {
      alert("please add department name");
    } else {
      const secondFunction = async () => {
        const result = await this.props.refreshToken();

        // save the new owner, then load all owners
        $.ajax({
          url: `/api-iec/owners`, //TODO: update request URL
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
            name: this.state.ownerName,
            department_name: this.state.department_name,
          }),
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          success: (result) => {
            $.ajax({
              url: `/api-iec/owners`, //TODO: update request URL
              type: "GET",
              beforeSend: function (xhr) {
                //Include the bearer token in header
                xhr.setRequestHeader(
                  "Authorization",
                  "Bearer " + sessionStorage.getItem("access_token")
                );
              },
              success: (result) => {
                this.setState({ owners: result.owners }, async () => {
                  document.getElementById("add_owner").hidden = true;
                  document.getElementById("table1").scrollIntoView();
                });
                return;
              },
              error: (error) => {
                alert("Unable to load owners. Please try your request again");
                return;
              },
            });
            return;
          },
          error: (error) => {
            alert("Unable to add the new owner. Please try your request again");
            return;
          },
        });
      };
      secondFunction();
    }
  };

  handleOwnerName = (event) => {
    this.setState({ ownerName: event.target.value });
  };

  handleDepartment = (event) => {
    this.setState({ department_name: event.target.value });
  };

  handleChangeDepartment = (event, { value }) => {
    // eslint-disable-next-line
    alert('Ana DOST 3la 7aga: ', value)
    this.setState({
      // ownerNew: value,
      department_name: value,
    });
  };

  // handleChangeDepartment = (event) => {
  //   this.setState({ department_name: event.target.value });
  // };

  render() {
    return (
      <div>
        <div></div>
        <Header as="h2">
          <Image circular src={project_icon} /> Owners
        </Header>
        <div style={{ margin: "20px" }}>
          <Button.Group widths="1">
            <Button
              id="calendar_button1"
              size="mini"
              color="red"
              onClick={this.new_owner}
            >
              {" "}
              Add a new Owner{" "}
            </Button>
          </Button.Group>
        </div>
        <div id="table1">
          <BasicTable key={this.state.owners} data={this.state.owners} />
        </div>

        <div style={{ margin: "40px" }}></div>

        <div style={{ margin: "40px" }}></div>

        <div id="add_owner">
          <Form>
            <Divider horizontal>
              <Header as="h4">
                <Icon name="sign-in" />
                Owner Addition
              </Header>
            </Divider>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Owner Name</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      placeholder="Owner Name"
                      onChange={this.handleOwnerName}
                    />
                  </Table.Cell>
                </Table.Row>
                {/* <Table.Row>
                  <Table.Cell width={3}>Department</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      placeholder="Department"
                      onChange={this.handleDepartment}
                    />
                  </Table.Cell>
                </Table.Row> */}
                <Table.Row>
                  <Table.Cell width={3}>Department</Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      styles={this.state.selectTagStyle}
                      placeholder="Choose a Department"
                      selection
                      options={this.state.departments}
                      onChange={this.handleChangeDepartment}
                    />
                    {/* <select
                      placeholder="Choose a Department"
                      className="form-select mb-4"
                      onChange={this.handleChangeDepartment}
                    >
                      {this.state.departments.map((dept) => 
                      <option value={dept} key={dept}>
                            {dept}
                          </option>
                       )}
                    </select> */}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            <button id="submitNew" onClick={this.addOwner}>
              Submit
            </button>
          </Form>
        </div>
      </div>
    );
  }
}


export default Owner;
