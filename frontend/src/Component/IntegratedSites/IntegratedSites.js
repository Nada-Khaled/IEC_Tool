import React, { Component } from 'react';
import { Header, Image, Button, Segment, Dimmer, Loader, Form, Divider, Icon, Table} from 'semantic-ui-react'
import {BasicTable} from './BasicTable';
import site_icon from '../../media/integratedSite.png';
import IntegrateSitesExcel from './IntegrateSitesExcel';
import '../../StyleSheets/site.css';
import $ from 'jquery';

class IntegratedSites extends Component {
  constructor(props){
    super(...arguments);
    this.state = {
      sites: [],
      siteCode: '',
      siteName: '',
      version: 0,
      projectId: 0,
      areaId: 0,
      userId: sessionStorage.getItem("user_id"),

      projectOptions:[],
      areaOptions:[],

      //in integrate process
      visitsNumber:1,
      siteProjectId: 0,
      addVisitsNumberCheck: false,

      integrateSitesExcelCheck: false,

      loading: false
    }
    this.integrateSite = this.integrateSite.bind(this)
    this.refreshSites = this.refreshSites.bind(this)
  }

  integrateSite(id){
    if(this.state.addVisitsNumberCheck === false){
      this.setState({
      siteProjectId: id,
      addVisitsNumberCheck: true
    }, async ()=>{
      console.log("id:", this.state.siteProjectId);
    });
    } else{
      this.setState({
        siteProjectId: 0,
        addVisitsNumberCheck: false
      });
    }
  }

  handleVisitsNumber = (event) => {
    this.setState({visitsNumber: event.target.value}, async ()=>{
    console.log("visitsNumber:", this.state.visitsNumber);
    })
  }

  addVisitsNumberShow = ()=> {
    if(this.state.addVisitsNumberCheck){
      return ( <div id = "add_visits_number" >
                <Form>
                  <Divider horizontal>
                      <Header as='h4'>
                        <Icon name='check circle outline' />
                        Adding Number of Visits
                      </Header>
                  </Divider>
                  <Table definition>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell width={3}>
                          Number of Visits
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' type='number' value={this.state.visitsNumber} onChange={this.handleVisitsNumber}/>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  <button id='submitNew' onClick={this.addVisitsNumber}>
                    Submit
                  </button>
                </Form>
              </div>
            );
    }
    else{return(<div></div>)}
    
  }

  addVisitsNumber = (event) => {
    event.preventDefault();
    console.log("siteProjectId:", this.state.siteProjectId);
    $.ajax({
      url: `/api/sites/${this.state.siteProjectId}/integrations`, //TODO: update request URL
      type: "POST",
      beforeSend: function (xhr) {   //Include the bearer token in header
        xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
      },
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        userId: this.state.userId,
        visitsNumber: this.state.visitsNumber
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        $.ajax({
          url: `/api/sites`, //TODO: update request URL
          type: "GET",
          beforeSend: function (xhr) {   //Include the bearer token in header
            xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
          },
          success: (result) => {
            this.setState({ sites: result.sites, addVisitsNumberCheck:false })
            return;
          },
          error: (error) => {
            alert('Unable to load sites. Please try your request again')
            return;
          }
        })
        return;
      },
      error: (error) => {
        alert('Unable to integrate site. Please try your request again')
        return;
      }
    });
  }

  refreshSites(){
    $.ajax({
      url: `/api/sites`, //TODO: update request URL
      type: "GET",
      beforeSend: function (xhr) {   //Include the bearer token in header
        xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
      },
      success: (result) => {
        this.setState({ sites: result.sites })
        return;
      },
      error: (error) => {
        alert('Unable to load sites. Please try your request again')
        return;
      }
    })
  }

  componentDidMount(){
    $.ajax({
      url: `/api/projects`, //TODO: update request URL
      type: "GET",
      beforeSend: function (xhr) {   //Include the bearer token in header
        xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
      },
      success: (result) => {
        this.setState({ projectOptions: result.projects })
        return;
      },
      error: (error) => {
        alert('Unable to load projects. Please try your request again')
        return;
      }
    })
    $.ajax({
      url: `/api/areas`, //TODO: update request URL
      type: "GET",
      beforeSend: function (xhr) {   //Include the bearer token in header
        xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
      },
      success: (result) => {
        this.setState({ areaOptions: result.areas })
        return;
      },
      error: (error) => {
        alert('Unable to load areas. Please try your request again')
        return;
      }
    })
    $.ajax({
      url: `/api/sites`, //TODO: update request URL
      type: "GET",
      beforeSend: function (xhr) {   //Include the bearer token in header
        xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
      },
      success: (result) => {
        this.setState({ sites: result.sites })
        return;
      },
      error: (error) => {
        alert('Unable to load sites. Please try your request again')
        return;
      }
    })
  }
  
  
  LoaderExampleText = () => {
    if (this.state.loading){
      return(
          <div>
            <Segment>
              <Dimmer active>
                <Loader>Loading</Loader>
              </Dimmer>
            </Segment>
          </div>
    
      );
    }else{
      return(<div></div>);
    }
  }
  
  integrateSitesExcel = ()=>{
    if(this.state.integrateSitesExcelCheck === false){
      this.setState({integrateSitesExcelCheck: true});
    }
    else{
      this.setState({integrateSitesExcelCheck: false});
    }
  }

  integrateSitesExcelShow = ()=>{
    if(this.state.integrateSitesExcelCheck){
      return(<div id='upload_templates_id'><IntegrateSitesExcel refreshSites={this.refreshSites} refreshToken={this.props.refreshToken} userId = {this.state.userId}/></div>);
    }
    else{
      return(<div></div>);
    }
  }

  ExportAllSites = ()=>{
    this.setState({loading:true}, async () =>{
      const secondFunction = async () => {
        const result = await this.props.refreshToken()
        // do something else here after firstFunction completes  
        
        let anchor = document.createElement("a");
        document.body.appendChild(anchor);
        let file = `http://localhost:8000/api/excel-sites-addition/${this.state.userId}`;
  
        let headers = new Headers();
        headers.append('Authorization', 'Bearer '+ sessionStorage.getItem("access_token"));
        
        try{
          fetch(file, { headers })
          .then(response => response.blob())
          .then(blobby => {
              let objectUrl = window.URL.createObjectURL(blobby);
  
              anchor.href = objectUrl;
              anchor.download = 'Export All Sites.xlsx';
              anchor.click();
              this.setState({loading:false});
              window.URL.revokeObjectURL(objectUrl);
          });
        }
        catch(e){
          this.setState({loading:false}, async ()=>{
            alert("Failed to export all sites!")
          });
        }
        
      }
      secondFunction();
    })
  }

  render() {
    
    return <div>
                <div></div>
                <Header as='h2'>
                    <Image src={site_icon} /> Integrated Sites
                </Header>
                
                <div style={{margin:"20px"}}>
                <Button.Group widths='1'>
                  <Button id='calendar_button1' size='mini' color='red' onClick={this.ExportAllSites}> Export All Sites - Excel </Button>
                  <Button id='calendar_button1' size='mini' color='red' onClick={this.integrateSitesExcel}> Integrate Sites - Upload Excel </Button>
                </Button.Group>
              </div>

              {this.integrateSitesExcelShow()}
              {this.LoaderExampleText()}
              {this.addVisitsNumberShow()}

              <div id = 'table1'>
                  <BasicTable key ={this.state.sites}  data = {this.state.sites} integrateSite={this.integrateSite} />
              </div>
           </div>
  }
  
}


export default IntegratedSites;
