import React, { Component } from 'react';
import { Header, Image, Button, Form, Divider, Icon, Table} from 'semantic-ui-react'
import {BasicTable} from './BasicTable';
import vendor_icon from '../../media/vendor.png';
import '../../StyleSheets/vendor.css';
import $ from 'jquery';

class Supplier extends Component {
  constructor(props){
    super(...arguments);
    this.state = {
      suppliers: [],
      supplierName:''
    }
  }

  componentDidMount(){
    document.getElementById("add_supplier").hidden=true;
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/suppliers`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {
          //Include the bearer token in header
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " + sessionStorage.getItem("access_token")
          );
        },
        success: (result) => {
          if (result != "no suppliers found")
          {
            this.setState({ suppliers: result.supplier });
            return;
          }
        },
        error: (error) => {
          alert("Unable to load suppliers. Please try your request again");
          return;
        },
      });
    }
    secondFunction();
  }
  
  new_supplier = ()=>{
    if (document.getElementById("add_supplier").hidden){
      document.getElementById("add_supplier").hidden=false;
      document.getElementById("add_supplier").scrollIntoView();
    }else{
      document.getElementById("add_supplier").hidden=true;
      document.getElementById("table1").scrollIntoView();
    } 
  }

  addSupplier = (event) =>{
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/suppliers`, //TODO: update request URL
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
          name: this.state.supplierName,
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          $.ajax({
            url: `/api-iec/suppliers`, //TODO: update request URL
            type: "GET",
            beforeSend: function (xhr) {
              //Include the bearer token in header
              xhr.setRequestHeader(
                "Authorization",
                "Bearer " + sessionStorage.getItem("access_token")
              );
            },
            success: (result) => {
              this.setState({ suppliers: result.supplier }, async () => {
                document.getElementById("add_supplier").hidden = true;
                document.getElementById("table1").scrollIntoView();
              });
              return;
            },
            error: (error) => {
              alert(
                "Unable to load suppliers. Please try your request again"
              );
              return;
            },
          });
          return;
        },
        error: (error) => {
          alert(
            "Unable to add the new supplier. Please try your request again"
          );
          return;
        },
      });
    }
    secondFunction();
  }

  handleSupplierName = (event) => {
    this.setState({ supplierName: event.target.value });
  }
  
  render() {
    
    return <div>
                <div></div>
                <Header as='h2'>
                    <Image circular src={vendor_icon} /> Suppliers
                </Header>
                <div style={{margin:"20px"}}>
                  <Button.Group widths='1'>
                    <Button id='calendar_button1' size='mini' color='red' onClick={this.new_supplier}> Add a new supplier </Button>
                  </Button.Group>
                </div>
                <div id = 'table1'>
                    <BasicTable key ={this.state.suppliers}  data = {this.state.suppliers} />
                </div>

                <div style={{margin:"40px"}}></div>

                <div style={{margin:"40px"}}></div>

              

              <div id = "add_supplier">
                <Form>
                  <Divider horizontal>
                      <Header as='h4'>
                        <Icon name='sign-in' />
                        Supplier Addition
                      </Header>
                  </Divider>
                  <Table definition>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell width={3}>
                        Supplier Name
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' placeholder='Supplier Name' onChange={this.handleSupplierName}/>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  
                  <button id='submitNew' onClick={this.addSupplier}>
                    Submit
                  </button>
                </Form>
              </div>
           </div>
  }
  
}


export default Supplier;
