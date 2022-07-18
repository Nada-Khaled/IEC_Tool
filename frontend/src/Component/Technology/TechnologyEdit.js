import React, { Component } from 'react';
import { Header, Image, Form, Table} from 'semantic-ui-react'
import technology_icon from '../../media/technology.png';
import '../../StyleSheets/technology.css';
import $ from 'jquery';

class TechnologyEdit extends Component {
  constructor(props){
    super(...arguments);
    this.state = {
      technologyId:0,
      technologyName:''
    }
  }

  /*navTo = (uri) =>{
    window.location.href = window.location.origin + uri;
  }*/

  componentDidMount(){
    this.setState({technologyId: this.props.match.params.id}, async () => {
      const secondFunction = async () => {
        const result = await this.props.refreshToken()
        // do something else here after firstFunction completes
        $.ajax({
          url: `/api-iec/technologies/${this.state.technologyId}`, //TODO: update request URL
          type: "GET",
          beforeSend: function (xhr) {   //Include the bearer token in header
            xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
          },
          success: (result) => {
            this.setState({
              technologyName: result.technology.technology_name
            })
            return;
          },
          error: (error) => {
            alert('Unable to load technology to edit. Please try your request again')
            return;
          }
        })
      }
      secondFunction();
    })
  }

  
  technologyDeleteId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/technologies/${this.state.technologyId}`, //TODO: update request URL
        type: "POST",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          editAction: 'delete',
          technology_name: this.state.technologyName
        }),
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: (result) => {
          this.props.history.push('/technologies');
          return;
        },
        error: (error) => {
          $.ajax({
            url: `/api-iec/technologies/${this.state.technologyId}`, //TODO: update request URL
            type: "POST",
            beforeSend: function (xhr) {   //Include the bearer token in header
              xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
            },
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              editAction: 'deactivate',
              technology_name: this.state.technologyName
            }),
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            success: (result) => {
              this.props.history.push('/technologies');
              return;
            },
            error: (error) => {
              alert('Unable to delete the technology. Please try your request again')
              return;
            }
          })
          return;
        }
      })
    }
    secondFunction();
        
  }

  
  technologyEditId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/technologies/${this.state.technologyId}`, //TODO: update request URL
        type: "POST",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          editAction: 'edit',
          technology_name: this.state.technologyName
        }),
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: (result) => {
          this.props.history.push('/technologies');
          return;
        },
        error: (error) => {
          alert('Unable to update the technology. Please try your request again')
          return;
        }
      })
    }
    secondFunction();
  }

 

  cancelId = ()=>{
    this.props.history.push('/technologies');
  }

  handleTechnologyName = (event) => {
    this.setState({technologyName: event.target.value})
  }
  
  render() {

    return <div>
                <div></div>
                <Header as='h2'>
                    <Image circular src={technology_icon} /> Technology Edit
                </Header>

                
                <div id = "add_technology">
                  <Form>
                    <Table definition>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell width={3}>
                            Technology Name
                          </Table.Cell>
                          <Table.Cell>
                            <input id ='input' defaultValue={this.state.technologyName} onChange={this.handleTechnologyName}/>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                    
                    <button id='submitNew' onClick={this.technologyEditId}>Update</button>
                    <button id='submitNew' onClick={this.technologyDeleteId}>Delete</button>
                    <button id='submitNew' onClick={this.cancelId}>Cancel</button>
                  </Form>
                </div>
                
           </div>
  }
  
}


export default TechnologyEdit;
