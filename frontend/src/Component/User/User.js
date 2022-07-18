import React, { Component } from 'react';
import { Header, Image, Button, Form, Segment, Dropdown, Divider, Icon, Table} from 'semantic-ui-react'
import {BasicTable} from './BasicTable';
import user_icon from '../../media/no_profile_picture.png';
import '../../StyleSheets/user.css'
import $ from 'jquery';

class User extends Component {
  constructor(props){
    super(...arguments);
    this.state = {
      users: [],
      UserName: '',
      OrangeID: 0,
      FirstName: '',
      LastName: '',
      Password: '',
      PasswordRe: '',
      ProfilePicture: null,
      Email: '',
      Title: '',
      Phone: '',
      Role:'',
      rolesOptions: [
        {
          key: 'is_integration_engineer',
          text: 'is_integration_engineer',
          value: 'is_integration_engineer'
        },
        {
          key: 'is_audit',
          text: 'is_audit',
          value: 'is_audit'
        },
        {
          key: 'is_manager',
          text: 'is_manager',
          value: 'is_manager'
        },
        {
          key: 'is_admin',
          text: 'is_admin',
          value: 'is_admin'
        },
        {
          key: 'is_super_user',
          text: 'is_super_user',
          value: 'is_super_user'
        }
      ]
    }
  }

  componentDidMount(){
    document.getElementById("add_user").hidden=true;
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/users`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        success: (result) => {
          this.setState({ users: result.users })
          return;
        },
        error: (error) => {
          alert('Unable to load users. Please try your request again')
          return;
        }
      })
    }
    secondFunction();
  }
  
  new_user = ()=>{
    if (document.getElementById("add_user").hidden){
      document.getElementById("add_user").hidden=false;
      document.getElementById("add_user").scrollIntoView();
    }else{
      document.getElementById("add_user").hidden=true;
      document.getElementById("table1").scrollIntoView();
    } 
  }

  addUser = (event) =>{
    event.preventDefault();
    let x = 0;
    if(this.state.FirstName !== ''){x = x+1;}
    if(this.state.LastName !== ''){x = x+1;}
    if(this.state.UserName === '' ){
      alert("Please enter a unique Username to be able to add user")
    } else if(x < 1){
      alert("Please enter your name to be able to add user")
    }
    //else if (this.state.OrangeID === 0 || this.state.OrangeID === ''){
    //  alert("Please enter Orange ID to be able to add user")
    //}
    else if(this.state.Email === '' ){
      alert("Please enter your E-mail to be able to add user")
    }
    else if(this.state.Phone === '' ){
      alert("Please enter your phone number to be able to add user")
    } 
    else if(this.state.Password === '' || this.state.PasswordRe === '' || this.state.Password !== this.state.PasswordRe ){
      alert("Please check your password to be able to add user")
    }
    else if (this.state.Role === ''){
      alert("Please choose a role to be able to add user")
    } 
    else{
      const secondFunction = async () => {
        const result = await this.props.refreshToken()
        // do something else here after firstFunction completes  
        $.ajax({
          url: `/api-iec/users`, //TODO: update request URL
          type: "POST",
          beforeSend: function (xhr) {   //Include the bearer token in header
            xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
          },
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify({
            username: this.state.UserName,
            orangeId: this.state.OrangeID, 
            first_name: this.state.FirstName,
            last_name: this.state.LastName,
            password: this.state.Password,
            re_password: this.state.PasswordRe,
            title: this.state.Title,
            email: this.state.Email,
            phone: this.state.Phone,
            role: this.state.Role
          }),
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          success: (result) => {
            if (this.state.ProfilePicture !== null){
              var data1 = new FormData();
              data1.append("file", this.state.ProfilePicture)
              data1.append("filename", this.state.UserName)
              
              $.ajax({
                url: `/api-iec/users/${result.user.id}/uploads`, //TODO: update request URL
                type: "POST",
                beforeSend: function (xhr) {   //Include the bearer token in header
                  xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
                },
                enctype: 'multipart/form-data',
                data: data1,
                processData: false,
                contentType: false,
                cache: false,
                timeout: 800000,
              
                xhrFields: {
                  withCredentials: true
                },
                crossDomain: true,
                success: (result) => {
                  document.getElementById("add_user").hidden=true;
                  $.ajax({
                    url: `/api-iec/users`, //TODO: update request URL
                    type: "GET",
                    beforeSend: function (xhr) {   //Include the bearer token in header
                      xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
                    },
                    success: (result) => {
                      this.setState({ users: result.users },async ()=> {
                        document.getElementById("add_user").hidden=true;
                        document.getElementById("table1").scrollIntoView();
                      })
                      return;
                    },
                    error: (error) => {
                      alert('Unable to load users. Please try your request again')
                      return;
                    }
                  })
                  return;
                },
                error: (error) => {
                  alert('Unable to add the profile picture. Please try your request again')
                  return;
                }
              })
            } else{
              document.getElementById("add_user").hidden=true;
              $.ajax({
                url: `/api-iec/users`, //TODO: update request URL
                type: "GET",
                beforeSend: function (xhr) {   //Include the bearer token in header
                  xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
                },
                success: (result) => {
                  this.setState({ users: result.users },async ()=> {
                    document.getElementById("add_user").hidden=true;
                    document.getElementById("table1").scrollIntoView();
                  })
                  return;
                },
                error: (error) => {
                  alert('Unable to load users. Please try your request again')
                  return;
                }
              })
              return;
            }
            return;
          },
          error: (error) => {
            alert('Unable to add the user. Please try your request again')
            return;
          }
        })
      }
      secondFunction();
    }
  }

  handleUserName = (event) =>{
    this.setState({UserName:event.target.value})
  }

  handleOrangeID = (event) =>{
    this.setState({OrangeID:event.target.value})
  }

  handleFirstName = (event) =>{
    this.setState({FirstName:event.target.value})
  }

  handleLastName = (event) =>{
    this.setState({LastName:event.target.value})
  }

  handleTitle = (event) =>{
    this.setState({Title:event.target.value})
  }

  handleEmail = (event) =>{
    this.setState({Email:event.target.value})
  }

  handlePhone = (event) =>{
    this.setState({Phone:event.target.value})
  }
  handleOrangeID = (event) =>{
    this.setState({OrangeID:event.target.value})
  }

  

  handlePassword = (event) =>{
    this.setState({Password:event.target.value})
  }

  handlePasswordRe = (event) =>{
    this.setState({PasswordRe:event.target.value})
  }

  handleProfilePicture = (event)=>{
    this.setState({ProfilePicture: event.target.files[0]})
  }

  handleChangeRole = (event, {value}) =>{
    this.setState({
      Role: value
    })
  }

  
  render() {
    //console.log("inside render")
    //console.log("window.location.hash = ", window.location.hash)
    
    return <div>
                <div></div>
                <Header as='h2'>
                    <Image circular src={user_icon} /> Users
                </Header>
                <div style={{margin:"20px"}}>
                  <Button.Group widths='1'>
                    <Button id='calendar_button1' size='mini' color='red' onClick={this.new_user}> Add New User </Button>
                  </Button.Group>
                </div>
                <div id = 'table1'>
                  <BasicTable key ={this.state.users}  data = {this.state.users} />
                </div>

                <div style={{margin:"40px"}}></div>

                <div style={{margin:"40px"}}></div>

              

              <div id = "add_user">
                <Form>
                  <Divider horizontal>
                      <Header as='h4'>
                        <Icon name='sign-in' />
                        User Addition
                      </Header>
                  </Divider>
                  <Table definition>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell width={3}>
                          Username
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' placeholder='User Name' onChange={this.handleUserName}/>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={3}>
                          First Name
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' placeholder='First Name' onChange={this.handleFirstName}/>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={3}>
                          Last Name
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' placeholder='Last Name' onChange={this.handleLastName}/>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={3}>
                          Orange ID
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' type='number' placeholder='Orange ID' onChange={this.handleOrangeID}/>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={3}>
                          Password
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' type='password' placeholder='Password' onChange={this.handlePassword}/>
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row>
                        <Table.Cell width={3}>
                          Password Re-enter
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' type='password' placeholder='Password Re-enter' onChange={this.handlePasswordRe}/>
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row>
                        <Table.Cell width={3}>
                          Profile Picture
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' type='file' placeholder="Choose Instructor's Profile Picture" accept="image/*" onChange={this.handleProfilePicture}/>
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row>
                        <Table.Cell width={3}>
                          Title
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' placeholder='Title' onChange={this.handleTitle}/>
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row>
                        <Table.Cell width={3}>
                          Role
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            placeholder='Role'
                            selection
                            options={this.state.rolesOptions}
                            onChange={this.handleChangeRole}
                          />
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row>
                        <Table.Cell width={3}>
                          E-Mail
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' placeholder='E-Mail' onChange={this.handleEmail}/>
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row>
                        <Table.Cell width={3}>
                          Phone
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' placeholder='Phone' onChange={this.handlePhone}/>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  
                  <button id='submitNew' onClick={this.addUser}>
                    Submit
                  </button>
                </Form>
              </div>
           </div>
  }
  
}


export default User;
