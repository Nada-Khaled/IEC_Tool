import React, { Component } from 'react';
import { Header, Image, Button, Form, Segment, Dropdown, Table} from 'semantic-ui-react'
import user_icon from '../../media/no_profile_picture.png';
import no_profile_picture from '../../media/no_profile_picture.png';
import '../../StyleSheets/user.css'
import $ from 'jquery';
import CardTemplate from '../CardTemplate';

class UserEdit extends Component {
  constructor(props){
    super(...arguments);
    this.state = {
      userId:0,
      username:'',
      orangeID: 0,
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      phone: '',
      role:'',
      rolesOptions: [
        {
          key: 'is_integration_engineer',
          text: 'is_integration_engineer',
          value: 'is_integration_engineer'
        },
        {
          key: 'is_integration_team_leader',
          text: 'is_integration_team_leader',
          value: 'is_integration_team_leader'
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
        }
      ],

      profile_picture: null,
      imageURL: '',
      user: {}
    }
  }

  /*navTo = (uri) =>{
    window.location.href = window.location.origin + uri;
  }*/

  componentWillUnmount(){
    /*
    window.addEventListener("popstate", () => {
      this.navTo('/users');
    });
    window.onpopstate = e => {
      this.navTo('/users');
    };*/
  }

  componentDidMount(){
    this.setState({userId: this.props.match.params.id}, async () => {
      const secondFunction = async () => {
        const result = await this.props.refreshToken()
        // do something else here after firstFunction completes  
        $.ajax({
          url: `/api-iec/users/${this.state.userId}`, //TODO: update request URL
          type: "GET",
          beforeSend: function (xhr) {   //Include the bearer token in header
            xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
          },
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          
          success: (result) => {
            this.setState({
              user: result.user,
              username: result.user.username,
              orangeID: result.user.orange_id,
              firstName: result.user.first_name,
              lastName: result.user.last_name,
              title: result.user.title,
              email: result.user.email,
              phone: result.user.phone,
              role:result.user.role
            })
            $.ajax({
                url: `/api-iec/users/${this.state.userId}/uploads`, //TODO: update request URL
                type: "GET",
                beforeSend: function (xhr) {   //Include the bearer token in header
                  xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
                },
                processData: false,
                contentType: false,
                cache: false,
                timeout: 800000,
                xhrFields: {
                  withCredentials: true
                },
                crossDomain: true,
                      
                success: (result) => {
                  this.setState({ imageURL: `data:image/jpeg;base64,${result}`})
                  return;
                },
                error: (error) => {
                  this.setState({ imageURL: no_profile_picture })
                  return;
                }
            })
            return;
          },
          error: (error) => {
            alert('Unable to load user to edit. Please try your request again')
            return;
          }
        })
      }
      secondFunction();
    })
  }

  
  userDeleteId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/users/${this.state.userId}`, //TODO: update request URL
        type: "POST",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          req_type: 'delete',
          username: this.state.username,
          orange_id: this.state.orangeID,
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          title: this.state.title,
          email: this.state.email,
          phone: this.state.phone,
          role: this.state.role
        }),
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: (result) => {
          //this.navTo('/users');
          this.props.history.push('/users');
          return;
        },
        error: (error) => {
          $.ajax({
            url: `/api-iec/users/${this.state.userId}`, //TODO: update request URL
            type: "POST",
            beforeSend: function (xhr) {   //Include the bearer token in header
              xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
            },
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              req_type: 'deactivate',
              username: this.state.username,
              orange_id: this.state.orangeID,
              first_name: this.state.firstName,
              last_name: this.state.lastName,
              title: this.state.title,
              email: this.state.email,
              phone: this.state.phone,
              role: this.state.role
            }),
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            success: (result) => {
              //this.navTo('/users');
              this.props.history.push('/users');
              return;
            },
            error: (error) => {
              alert('Unable to delete the user. Please try your request again')
              return;
            }
          })
          return;
        }
      })
    }
    secondFunction();
  }

  
  userEditId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/users/${this.state.userId}`, //TODO: update request URL
        type: "POST",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          req_type: 'edit',
          username: this.state.username,
          orange_id: this.state.orangeID,
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          title: this.state.title,
          email: this.state.email,
          phone: this.state.phone,
          role: this.state.role
        }),
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: (result) => {
          //this.navTo('/users');
          this.props.history.push('/users');
          return;
        },
        error: (error) => {
          alert('Unable to update the user. Please try your request again')
          return;
        }
      })
    }
    secondFunction();
  }

  /*navTo = (uri) =>{
    window.location.href = window.location.origin + uri;
  }*/

  cancelId = ()=>{
    //this.navTo(`/users`)
    this.props.history.push('/users');
    return;
  }

  
  handleFirstName = (event) =>{
    this.setState({firstName:event.target.value})
  }

  handleLastName = (event) =>{
    this.setState({lastName:event.target.value})
  }

  handleTitle = (event) =>{
    this.setState({title:event.target.value})
  }

  handleEmail = (event) =>{
    this.setState({email:event.target.value})
  }

  handlePhone = (event) =>{
    this.setState({phone:event.target.value})
  }

  handleOrangeId = (event) =>{
    this.setState({orangeID:event.target.value})
  }

  handleChangeRole = (event, {value}) =>{
    this.setState({
      role: value
    })
  }

  handleProfilePicture = (event)=>{
    this.setState({profile_picture: event.target.files[0]})
  }



  changeProfilePicture = (e)=>{
    e.preventDefault();
  
    var data1 = new FormData();
    data1.append('file', this.state.profile_picture);
    data1.append('filename', this.state.username);
    
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/users/${this.state.userId}/uploads`, //TODO: update request URL
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
          this.setState({ imageURL: URL.createObjectURL(this.state.profile_picture) })
          return;
        },
        error: (error) => {
          alert('Unable to change profile picture. Please try your request again')
          return;
        }
      })
    }
    secondFunction();
  }


  render() {

    return <div>
                <div id='header'>  
                  <Header as='h2'>
                      <Image circular src={this.state.imageURL} /> {this.state.firstName +" "+ this.state.lastName}
                  </Header>
                </div>

                <div id ='container '>
                  <div className='card'>
                    <CardTemplate
                    name={this.state.firstName +" "+ this.state.lastName}
                    img ={this.state.imageURL}
                    role = {this.state.role}
                    email = {this.state.email}
                    phoneNumber = {this.state.phone} 
                    onClick= {this.editProfilePictureShow}
                    ></CardTemplate>
                  </div>

                  <div className = "form-div">
                    <Form>
                      <Table definition>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell width={3}>
                              Username
                            </Table.Cell>
                            <Table.Cell>
                              {this.state.username}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell width={3}>
                              First Name
                            </Table.Cell>
                            <Table.Cell>
                              <input id ='input' defaultValue={this.state.firstName} onChange={this.handleFirstName}/>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell width={3}>
                              Last Name
                            </Table.Cell>
                            <Table.Cell>
                              <input id ='input' defaultValue={this.state.lastName} onChange={this.handleLastName}/>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell width={3}>
                              Orange ID
                            </Table.Cell>
                            <Table.Cell>
                              <input id ='input' type='number' value={this.state.orangeID} onChange={this.handleOrangeId}/>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell width={3}>
                              Title
                            </Table.Cell>
                            <Table.Cell>
                              <input id ='input' defaultValue={this.state.title} onChange={this.handleTitle}/>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell width={3}>
                              Role
                            </Table.Cell>
                            <Table.Cell>
                              <Dropdown
                                text={this.state.role}
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
                              <input id ='input' defaultValue={this.state.email} onChange={this.handleEmail}/>
                            </Table.Cell>
                          </Table.Row>

                          <Table.Row>
                            <Table.Cell width={3}>
                              Phone
                            </Table.Cell>
                            <Table.Cell>
                              <input id ='input' defaultValue={this.state.phone} onChange={this.handlePhone}/>
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                      
                      <button id='submitEdit' onClick={this.userEditId}>Update</button>
                      <button id='submitEdit' onClick={this.userPasswordReset}>Password Reset</button>
                      <button id='submitEdit' onClick={this.userDeleteId}>Delete</button>
                      <button id='submitEdit' onClick={this.cancelId}>Cancel</button>
                    </Form>
                  </div>

                  <div className='profile_picture_change'>
                    <Segment>
                      <Form>
                        <input type='file' accept="image/*" onChange={this.handleProfilePicture}></input>
                        <Button id='submitUserEdit' onClick={this.changeProfilePicture}>Change Profile Picture</Button>
                      </Form>
                    </Segment>
                  </div>

                  
                </div>
           </div>
  }
  
}


export default UserEdit;


/*
<div id='form-div'>
                    <Segment id="add_user" inverted>
                      <Form id='form' Inverted>
                        <Form.Group>
                          <Form.Field className='form3'>
                              <label id="label">Username</label>
                              <input id ='input' defaultValue={this.state.username} readOnly/>
                          </Form.Field>
                          <Form.Field className='form3'>
                              <label id="label">User ID</label>
                              <input id ='input' type='number' value={this.state.userId} readOnly/>
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field className='form1'>
                              <label id="label">First Name</label>
                              <input id ='input' defaultValue={this.state.firstName} onChange={this.handleFirstName}/>
                          </Form.Field>
                          <Form.Field className='form1'>
                              <label id="label">Last Name</label>
                              <input id ='input' defaultValue={this.state.lastName} onChange={this.handleLastName}/>
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field className='form3'>
                              <label id="label">Title</label>
                              <input id ='input' defaultValue={this.state.title} onChange={this.handleTitle}/>
                          </Form.Field>
                          <Form.Field className='form3'>
                        <label id="label">Role</label>
                        <Dropdown
                          text={this.state.role}
                          selection
                          options={this.state.rolesOptions}
                          onChange={this.handleChangeRole}
                        />
                      </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field className='form1'>
                              <label id="label">E-Mail</label>
                              <input id ='input' defaultValue={this.state.email} onChange={this.handleEmail}/>
                          </Form.Field>
                          <Form.Field className='form1'>
                              <label id="label">Phone</label>
                              <input id ='input' defaultValue={this.state.phone} onChange={this.handlePhone}/>
                          </Form.Field>
                        </Form.Group>
                      
                        <div>
                          <Button id='submitUserEdit' content='Primary' floated='right' type='submit' onClick={this.userEditId}>Update</Button>
                          <Button id='submitUserEdit' content='Secondary' floated='right' type='submit' onClick={this.userDeleteId}>Delete</Button>
                          <Button id='submitUserEdit' content='Primary' floated='right' type='submit' onClick={this.cancelId}>Cancel</Button>
                        </div>
                      </Form>
                    </Segment>
                  </div>
                  */