import React, { Component } from 'react';
import { Header, Image, Form, Table} from 'semantic-ui-react'
import vendor_icon from '../../media/vendor.png';
import '../../StyleSheets/vendor.css';
import $ from 'jquery';

class DepartmentEdit extends Component {
  constructor(props){
    super(...arguments);
    this.state = {
      departmentId:0,
      departmentName:''
    }
  }

  componentDidMount(){
    this.setState({departmentId: this.props.match.params.id}, async () => {
      const secondFunction = async () => {
        const result = await this.props.refreshToken()
        // do something else here after firstFunction completes  
        $.ajax({
          url: `/api-iec/departments/${this.state.departmentId}`, //TODO: update request URL
          type: "GET",
          beforeSend: function (xhr) {   //Include the bearer token in header
            xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
          },
          success: (result) => {
            this.setState({
              departmentName: result.department.name,
            });
            return;
          },
          error: (error) => {
            alert('Unable to load department to edit. Please try your request again')
            return;
          }
        })
      }
      secondFunction();
    })
  }

  
  departmentDeleteId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/departments/${this.state.departmentId}`, //TODO: update request URL
        type: "POST",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          editAction: 'delete',
          name: this.state.departmentName
        }),
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: (result) => {
          this.props.history.push('/departments');
          return;
        },
        error: (error) => {
          $.ajax({
            url: `/api-iec/departments/${this.state.departmentId}`, //TODO: update request URL
            type: "POST",
            beforeSend: function (xhr) {   //Include the bearer token in header
              xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
            },
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              editAction: 'deactivate',
              name: this.state.departmentName
            }),
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            success: (result) => {
              this.props.history.push('/departments');
              return;
            },
            error: (error) => {
              alert('Unable to delete the department. Please try your request again')
              return;
            }
          })
          return;
        }
      })
    }
    secondFunction();        
  }

  
  departmentEditId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/departments/${this.state.departmentId}`, //TODO: update request URL
        type: "POST",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          editAction: 'edit',
          name: this.state.departmentName
        }),
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: (result) => {
          this.props.history.push('/departments');
          return;
        },
        error: (error) => {
          alert('Unable to update the department. Please try your request again')
          return;
        }
      })
    }
    secondFunction();
  }

 

  cancelId = ()=>{
    this.props.history.push('/departments');
  }

  handleDepartmentName = (event) => {
    this.setState({departmentName: event.target.value})
  }
  
  render() {

    return <div>
                <div></div>
                <Header as='h2'>
                    <Image circular src={vendor_icon} /> Department Edit
                </Header>

                
                <div id = "add_department">
                  <Form>
                    <Table definition>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell width={3}>
                            Department Name
                          </Table.Cell>
                          <Table.Cell>
                            <input id ='input' defaultValue={this.state.departmentName} onChange={this.handleDepartmentName}/>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                    
                    <button id='submitNew' onClick={this.departmentEditId}>Update</button>
                    <button id='submitNew' onClick={this.departmentDeleteId}>Delete</button>
                    <button id='submitNew' onClick={this.cancelId}>Cancel</button>
                  </Form>
                </div>
                
           </div>
  }
  
}


export default DepartmentEdit;
