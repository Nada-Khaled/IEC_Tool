import React, { Component } from 'react';
import { Header, Image, Button, Form, Divider, Icon, Table} from 'semantic-ui-react'
import {BasicTable} from './BasicTable';
import technology_icon from '../../media/technology.png';
import '../../StyleSheets/technology.css';
import $ from 'jquery';

class Technology extends Component {
  constructor(props){
    super(...arguments);
    this.state = {
      technologies: [],
      technologyName:''
    }
  }

  componentDidMount(){
    document.getElementById("add_technology").hidden=true;
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/technologies`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        success: (result) => {
          this.setState({ technologies: result.technologies })
          return;
        },
        error: (error) => {
          alert('Unable to load technologies. Please try your request again')
          return;
        }
      })
    }
    secondFunction();
  }
  
  new_technology = ()=>{
    if (document.getElementById("add_technology").hidden){
      document.getElementById("add_technology").hidden=false;
      document.getElementById("add_technology").scrollIntoView();
    }else{
      document.getElementById("add_technology").hidden=true;
      document.getElementById("table1").scrollIntoView();
    } 
  }

  addTechnology = (event) =>{
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/technologies`, //TODO: update request URL
        type: "POST",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          technology_name: this.state.technologyName
        }),
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: (result) => {
          $.ajax({
            url: `/api-iec/technologies`, //TODO: update request URL
            type: "GET",
            beforeSend: function (xhr) {   //Include the bearer token in header
              xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
            },
            success: (result) => {
              this.setState({ technologies: result.technologies },async ()=> {
                document.getElementById("add_technology").hidden=true;
                document.getElementById("table1").scrollIntoView();
              })
              return;
            },
            error: (error) => {
              alert('Unable to load technologies. Please try your request again')
              return;
            }
          })
          return;
        },
        error: (error) => {
          alert('Unable to add the new technology. Please try your request again')
          return;
        }
      })
    }
    secondFunction();
  }

  handleTechnologyName = (event) => {
    this.setState({technologyName: event.target.value})
  }
  
  render() {
    
    return <div>
                <div></div>
                <Header as='h2'>
                    <Image circular src={technology_icon} /> Technologies
                </Header>
                <div style={{margin:"20px"}}>
                  <Button.Group widths='1'>
                    <Button id='calendar_button1' size='mini' color='red' onClick={this.new_technology}> Add a new Technology </Button>
                  </Button.Group>
                </div>
                <div id = 'table1'>
                    <BasicTable key ={this.state.technologies}  data = {this.state.technologies} />
                </div>

                <div style={{margin:"40px"}}></div>

                <div style={{margin:"40px"}}></div>

              

              <div id = "add_technology">
                <Form>
                  <Divider horizontal>
                      <Header as='h4'>
                        <Icon name='sign-in' />
                        Technology Addition
                      </Header>
                  </Divider>
                  <Table definition>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell width={3}>
                        Technology Name
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' placeholder='Technology Name' onChange={this.handleTechnologyName}/>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  
                  <button id='submitNew' onClick={this.addTechnology}>
                    Submit
                  </button>
                </Form>
              </div>
           </div>
  }
  
}


export default Technology;
