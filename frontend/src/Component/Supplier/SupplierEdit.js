import React, { Component } from 'react';
import { Header, Image, Form, Table} from 'semantic-ui-react'
import vendor_icon from '../../media/vendor.png';
import '../../StyleSheets/vendor.css';
import $ from 'jquery';

class SupplierEdit extends Component {
  constructor(props){
    super(...arguments);
    this.state = {
      supplierId:0,
      supplierName:''
    }
  }

  componentDidMount(){
    this.setState({supplierId: this.props.match.params.id}, async () => {
      const secondFunction = async () => {
        const result = await this.props.refreshToken()
        // do something else here after firstFunction completes  
        $.ajax({
          url: `/api-iec/suppliers/${this.state.supplierId}`, //TODO: update request URL
          type: "GET",
          beforeSend: function (xhr) {   //Include the bearer token in header
            xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
          },
          success: (result) => {
            this.setState({
              supplierName: result.supplier.name,
            });
            return;
          },
          error: (error) => {
            alert('Unable to load supplier to edit. Please try your request again')
            return;
          }
        })
      }
      secondFunction();
    })
  }

  
  supplierDeleteId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/suppliers/${this.state.supplierId}`, //TODO: update request URL
        type: "POST",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          editAction: 'delete',
          name: this.state.supplierName
        }),
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: (result) => {
          this.props.history.push('/suppliers');
          return;
        },
        error: (error) => {
          $.ajax({
            url: `/api-iec/suppliers/${this.state.supplierId}`, //TODO: update request URL
            type: "POST",
            beforeSend: function (xhr) {   //Include the bearer token in header
              xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
            },
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              editAction: 'deactivate',
              name: this.state.supplierName
            }),
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            success: (result) => {
              this.props.history.push('/suppliers');
              return;
            },
            error: (error) => {
              alert('Unable to delete the supplier. Please try your request again')
              return;
            }
          })
          return;
        }
      })
    }
    secondFunction();        
  }

  
  supplierEditId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/suppliers/${this.state.supplierId}`, //TODO: update request URL
        type: "POST",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          editAction: 'edit',
          name: this.state.supplierName
        }),
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: (result) => {
          this.props.history.push('/suppliers');
          return;
        },
        error: (error) => {
          alert('Unable to update the supplier. Please try your request again')
          return;
        }
      })
    }
    secondFunction();
  }

 

  cancelId = ()=>{
    this.props.history.push('/suppliers');
  }

  handleSupplierName = (event) => {
    this.setState({supplierName: event.target.value})
  }
  
  render() {

    return <div>
                <div></div>
                <Header as='h2'>
                    <Image circular src={vendor_icon} /> Supplier Edit
                </Header>                
                <div id = "add_supplier">
                  <Form>
                    <Table definition>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell width={3}>
                            Supplier Name
                          </Table.Cell>
                          <Table.Cell>
                            <input id ='input' defaultValue={this.state.supplierName} onChange={this.handleSupplierName}/>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                    
                    <button id='submitNew' onClick={this.supplierEditId}>Update</button>
                    <button id='submitNew' onClick={this.supplierDeleteId}>Delete</button>
                    <button id='submitNew' onClick={this.cancelId}>Cancel</button>
                  </Form>
                </div>
                
           </div>
  }
  
}


export default SupplierEdit;
