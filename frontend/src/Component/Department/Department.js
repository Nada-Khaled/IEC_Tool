import React, { Component } from 'react';
import { Header, Image, Button, Form, Divider, Icon, Table} from 'semantic-ui-react'
import {BasicTable} from './BasicTable';
import vendor_icon from '../../media/vendor.png';
import '../../StyleSheets/vendor.css';
import $ from 'jquery';

class Department extends Component {
  constructor(props){
    super(...arguments);
    this.state = {
      departments: [],
      departmentName:''
    }
  }

  componentDidMount(){
    document.getElementById("add_department").hidden=true;
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
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
          this.setState({ departments: result.department });
          return;
        },
        error: (error) => {
          alert("Unable to load departments. Please try your request again");
          return;
        },
      });
    }
    secondFunction();
  }
  
  new_department = ()=>{
    if (document.getElementById("add_department").hidden){
      document.getElementById("add_department").hidden=false;
      document.getElementById("add_department").scrollIntoView();
    }else{
      document.getElementById("add_department").hidden=true;
      document.getElementById("table1").scrollIntoView();
    } 
  }

  addDepartment = (event) =>{
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/departments`, //TODO: update request URL
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
          name: this.state.departmentName,
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
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
              this.setState({ departments: result.department }, async () => {
                document.getElementById("add_department").hidden = true;
                document.getElementById("table1").scrollIntoView();
              });
              return;
            },
            error: (error) => {
              alert(
                "Unable to load departments. Please try your request again"
              );
              return;
            },
          });
          return;
        },
        error: (error) => {
          alert(
            "Unable to add the new department. Please try your request again"
          );
          return;
        },
      });
    }
    secondFunction();
  }

  handleDepartmentName = (event) => {
    this.setState({ departmentName: event.target.value });
  }
  
  render() {
    
    return <div>
                <div></div>
                <Header as='h2'>
                    <Image circular src={vendor_icon} /> Departments
                </Header>
                <div style={{margin:"20px"}}>
                  <Button.Group widths='1'>
                    <Button id='calendar_button1' size='mini' color='red' onClick={this.new_department}> Add a new department </Button>
                  </Button.Group>
                </div>
                <div id = 'table1'>
                    <BasicTable key ={this.state.departments}  data = {this.state.departments} />
                </div>

                <div style={{margin:"40px"}}></div>

                <div style={{margin:"40px"}}></div>

              

              <div id = "add_department">
                <Form>
                  <Divider horizontal>
                      <Header as='h4'>
                        <Icon name='sign-in' />
                        Department Addition
                      </Header>
                  </Divider>
                  <Table definition>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell width={3}>
                        Department Name
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' placeholder='Department Name' onChange={this.handleDepartmentName}/>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  
                  <button id='submitNew' onClick={this.addDepartment}>
                    Submit
                  </button>
                </Form>
              </div>
           </div>
  }
  
}


export default Department;
