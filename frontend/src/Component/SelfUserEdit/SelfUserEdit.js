import React, { Component } from 'react';
import {Button, Form, Segment, Divider, Header, Image, Table} from 'semantic-ui-react'
import user_icon from '../../media/no_profile_picture.png';
import CardTemplate from '../CardTemplate';
import no_profile_picture from '../../media/no_profile_picture.png';
import '../../StyleSheets/SelfUserEdit.css';

import $ from 'jquery';



class SelfUserEdit extends Component {
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

      profile_picture: null,
      imageURL: '',

      user: {}
      
    }
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
          success: (result) => {
            this.setState({
              user: result.user,
              username: result.user.username,
              orangeID:result.user.orange_id,
              firstName: result.user.first_name,
              lastName: result.user.last_name,
              title: result.user.title,
              email: result.user.email,
              phone: result.user.phone,
              role: result.user.role
            }, async ()=> {
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
                              
                success: (result) => {
                  this.setState({ imageURL: `data:image/jpeg;base64,${result}`  })
                  return;
                },
                error: (error) => {
                  this.setState({ imageURL: no_profile_picture })
                  return;
                }
              })
              
            })
            return ;
          },
          error: (error) => {
            alert('Unable to load User Account. Please try your request again')
            return;
          }
        })
      }
      secondFunction();
    }) 
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
          delete: 'edit',
          user_id: this.state.userId,
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
          this.props.history.push('/');
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


  cancelId = ()=>{
    this.props.history.push('/');
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
                              {this.state.role}
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
                      <button id='submitEdit' onClick={this.userPasswordReset}>Change Password</button>
                      <button id='submitEdit' onClick={this.cancelId}>Cancel</button>
                    </Form>
                  </div>

                  <Divider horizontal/>
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


export default SelfUserEdit;
