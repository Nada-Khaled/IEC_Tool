import React, { Component } from 'react';
import { Header , Form, Table, Divider, Icon } from 'semantic-ui-react'
import '../StyleSheets/RegisterForm.css';
import $ from 'jquery';



export default class RegisterForm extends Component {
  constructor(props){
    super(...arguments);
    this.state = {
      //login 
      usernameLogin:'',
      passwordLogin:''
    }
  }

  componentDidMount(){
    
  }
  

  //Logins

  handleUsernameLogin = (event) => {
      this.setState({usernameLogin:event.target.value})
  }

  handlePasswordLogin = (event) => {
    this.setState({passwordLogin: event.target.value})
  }

  handleLogin = () => {
    $.ajax({
      url: `/api-iec/logins`, //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        username: this.state.usernameLogin,
        password: this.state.passwordLogin
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        sessionStorage.setItem("access_token",result.access_token);
        sessionStorage.setItem("refresh_token",result.refresh_token);
        this.props.setToken(result.access_token);
        this.props.history.push('/');
        return;
      },
      error: (error) => {
        alert('Unable to Login. Please check your username / password')
        return;
      }
    })    
  }

  
  
  render() {
    
    return (
      <React.Fragment>
          <div id = "signIn">
            <Form>
              <Divider horizontal>
                  <Header as='h4'>
                    <Icon name='sign-in' />
                    Sign In
                  </Header>
              </Divider>
              <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={3}>
                      Username / E-mail
                    </Table.Cell>
                    <Table.Cell>
                      <input id ='input' placeholder='Username / Email' onChange={this.handleUsernameLogin}/>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={3}>
                      Password
                    </Table.Cell>
                    <Table.Cell>
                      <input id ='input' type='password' placeholder='Password' onChange={this.handlePasswordLogin}/>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              
              <button id='signinsubmit' onClick={this.handleLogin}>
                Sign-in
              </button>
            </Form>
          </div>          
      </React.Fragment>
    )
  }
}
