import React, { Component } from 'react';
import { Header, Image, Button, Form, Divider, Icon, Table, Dropdown} from 'semantic-ui-react'
import {BasicTable} from './BasicTable';
import IEC_icon from "../../media/IEC.jpg";
import '../../StyleSheets/IECAdd.css';
import $ from 'jquery';
import {UploadExcel} from './UploadExcel'
import '../../config';

class Iec extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {

      showUploadForm: false,

      iec_id: '',
      iecOptions: [],
      statusOptions: [],
      supplyChainFeedBackOptions: [],
      procurementFeedBackOptions: [],
      decisionSupportFeedBackOptions: [],

      trueFalseOptions:[
        {
          key: 'True',
          text: 'True',
          value: 'True'
        },
        {
          key: 'False',
          text: 'False',
          value: 'False'
        }
      ],

      project_title: '',
      project_description: '',
      project_justification: '',
      finance_number: '',
      request_date: '',
      start_date: '',
      iec_date: '',
      uploaded_iec_attachment: '',
      iec_attachment_name: '',
      project_comment: '',
      supply_chain_feedback_detailed: '',
      procurement_feedback_detailed: '',
      decision_support_feedback_detailed: '',
      capex_egp: '',
      opex_egp: '',
      total: '',
      status_name: '',
      IEC_type_id: '',
      supply_chain_feedback: '',
      procurement_feedback: '',
      decision_support_feedback: '',
      is_annual: '',
      number_of_years: '',

    };
  }

  // ajax calls
  getAllIECs() {

    $.ajax({
            url: `/api-iec/iec`,
            type: "GET",
            beforeSend: function (xhr) {
              //Include the bearer token in header
              xhr.setRequestHeader(
                "Authorization",
                "Bearer " + sessionStorage.getItem("access_token")
              );
            },
            
            success: (result) => {

              console.log('succeeded to get all iecs');
          
              this.setState({ iecOptions: result.iec },async()=>{
                console.log("this.state.iecOptions")
                console.log(this.state.iecOptions)
              });
              return;
            },
            error: (error) => {
              alert("Unable to load IECs. Please try your request again");
              return;
            },
          });
  }

  getAllStatus() {
    $.ajax({
        url: `/api-iec/status`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {
          //Include the bearer token in header
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " + sessionStorage.getItem("access_token")
          );
        },
        success: (result) => {
          
          this.setState({ statusOptions: result.status },async()=>{
            // console.log("this.state.statusOptions")
            // console.log(this.state.statusOptions)
          });
          return;
        },
        error: (error) => {
          alert("Unable to load Status. Please try your request again");
          return;
        },
      });
  }

  getAllDecisionSupportFeedback() {

    $.ajax({
        url: `/api-iec/decisionSupportFeedback`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {
          //Include the bearer token in header
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " + sessionStorage.getItem("access_token")
          );
        },
        success: (result) => {


           // console.log("Got the result from decisionSupportFeedBack");
          // console.log(result)
          // console.log(result.feedback)

          this.setState({ decisionSupportFeedBackOptions: result.feedback },async()=>{
            // console.log("this.state.decisionSupportFeedBackOptions")
            // console.log(this.state.decisionSupportFeedBackOptions)
          });
          return;
        },
        error: (error) => {
          alert("Unable to load Decision Support Feedback. Please try your request again");
          return;
        },
      });
  }

  getAllProcurementFeedback() {
    $.ajax({
        url: `/api-iec/procurementFeedback`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {
          //Include the bearer token in header
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " + sessionStorage.getItem("access_token")
          );
        },
        success: (result) => {
          
           // console.log("Got the result from procurement");
          // console.log(result)
          // console.log(result.feedback)

          this.setState({ procurementFeedBackOptions: result.feedback },async()=>{
            // console.log("this.state.procurementFeedBackOptions")
            // console.log(this.state.procurementFeedBackOptions)
          });
          
          return;
        },
        error: (error) => {
          alert("Unable to load Procurement Feedback. Please try your request again");
          return;
        },
      });
  }

  getAllSupplyChainFeedback() {
    $.ajax({
        url: `/api-iec/supplyChainFeedback`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {
          //Include the bearer token in header
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " + sessionStorage.getItem("access_token")
          );
        },
        success: (result) => {

          // console.log("Got the result from supplyChainFeedback");
          // console.log(result)
          // console.log(result.feedback)

          this.setState({ supplyChainFeedBackOptions: result.feedback },async()=>{
            // console.log("this.state.supplyChainFeedBackOptions")
            // console.log(this.state.supplyChainFeedBackOptions)
          });
          return;
        },
        error: (error) => {
          alert("Unable to load Supply Chain Feedback. Please try your request again");
          return;
        },
      });
  }

  componentDidMount() {
    
    document.getElementById("add_iec").hidden = true;

    document.getElementById('detailedSupplyChainFeedback').hidden = true;
    document.getElementById('detailedDecisionSupportFeedback').hidden = true;
    document.getElementById('detailedProcurementFeedback').hidden = true;
    
    const secondFunction = async () => {
      
      const result = await this.props.refreshToken();

      console.log("test el refresh token:")
      console.log(this.props.refreshToken())
            
      this.getAllIECs();
      this.getAllStatus();
      this.getAllDecisionSupportFeedback();
      this.getAllProcurementFeedback();
      this.getAllSupplyChainFeedback();
    };
    secondFunction();
  }

  new_iec = () => {

    this.setState({
      showUploadForm : false
    })

    if (document.getElementById("add_iec").hidden)
      document.getElementById("add_iec").hidden = false;
    else
      document.getElementById("add_iec").hidden = true;
  };

   modifyIecAttachment = () => {
      
      var fileUpload = this.state.uploaded_iec_attachment;
   
      var data1 = new FormData();
      data1.append('file', fileUpload);
      data1.append('filename', fileUpload.name);
      const secondFunction = async () => {
          
        const result = await this.props.refreshToken();
          
        let anchor = document.createElement("a");
        document.body.appendChild(anchor);
        let file = global.config.BACKEND_IP + `/api-iec/upload-iec-attachment/${this.state.iecId}/${fileUpload.name}`;

        let headers = new Headers();
        headers.append('Authorization', 'Bearer '+ sessionStorage.getItem("access_token"));

        try{
          fetch(file, {method: 'POST', headers , body: data1})
          .then(response => response.blob())
          .then(blobby => {

            console.log('In modifyIecAttachment After fetch')
            console.log(typeof(blobby))
            console.log(blobby)

            // let objectUrl = window.URL.createObjectURL(blobby);
            
            // anchor.href = objectUrl;
            // anchor.download = fileUpload.name;//+'.xlsx';
            // anchor.click();

            // window.URL.revokeObjectURL(objectUrl);
            
            this.GetCurrentIEC()

          }, (error)=>{
            
            this.GetCurrentIEC()
          }
          );
        }
        catch (error){
          
          this.GetCurrentIEC()
        }
        
    }
    secondFunction();
  
  }

  addIec = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken();

      $.ajax({
        url: `/api-iec/iec`, //TODO: update request URL
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
          project_title: this.state.project_title,
          project_description: this.state.project_description,
          project_justification: this.state.project_justification,
          project_comment: this.state.project_comment,
          finance_number: this.state.finance_number,
          request_date: this.state.request_date,
          start_date: this.state.start_date,
          iec_date: this.state.iec_date,
          // uploaded_iec_attachment: this.state.uploaded_iec_attachment,
          // iec_attachment_name: this.state.iec_attachment_name,
          supply_chain_feedback: this.state.supply_chain_feedback,
          procurement_feedback: this.state.procurement_feedback,
          decision_support_feedback: this.state.decision_support_feedback,
          capex_egp: this.state.capex_egp,
          opex_egp: this.state.opex_egp,
          is_annual:this.state.is_annual,
          number_of_years: this.state.number_of_years,
          status_name: this.state.status_name,
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {

          document.getElementById('add_iec').hidden = true;
          // refresh to get all IECs
          this.getAllIECs();
          return;
        },
        error: (error) => {
          alert("Unable to add the IEC. Please try your request again");
          return;
        },
      });
    };
    secondFunction();

if(this.state.uploaded_iec_attachment != "")
      this.modifyIecAttachment()
    
  };

  handleProjectTitle = (event) => {
    this.setState({ project_title: event.target.value });
  };

  handleProjectDescription = (event) => {
    this.setState({ project_description: event.target.value });
  };

  handleProjectJustification = (event) => {
    this.setState({ project_justification: event.target.value });
  };

  handleProjectComment = (event) => {
    this.setState({ project_comment: event.target.value });
  };

  handleFinanceNumber = (event) => {
    this.setState({ finance_number: event.target.value });
  };

  handleRequestDate = (event) => {
    this.setState({ request_date: event.target.value });
  };

  handleStartDate = (event) => {
    this.setState({ start_date: event.target.value });
  };

  handleIecDate = (event) => {
    this.setState({ iec_date: event.target.value });
  };

  handleCapexEGP = (event) => {
    this.setState({ capex_egp: event.target.value });
  };

  handleOpexEGP = (event) => {
    this.setState({ opex_egp: event.target.value });
  };

  handleNumberOfYears = (event) => {
    this.setState({ number_of_years: event.target.value });
  };

  handleUploadFile = async (event) => {
   this.setState({

    uploaded_iec_attachment: event.target.files[0],
    iec_attachment_name: event.target.files[0].name,

   }, async()=>{
    console.log("uploaded file is:");
    console.log(typeof(this.state.uploaded_iec_attachment));
    console.log(this.state.uploaded_iec_attachment);
    console.log("iec_attachment_name:");
    console.log(this.state.iec_attachment_name);

   });
}

  //for dropdown
  handleProjectStatus = (event, { value }) => {
    this.setState({ status_name: value }, async () => {});
  };

  handleSupplyChainFeedBack = (event, { value }) => {

    if(value.toLowerCase() == 'Other'.toLowerCase())
      document.getElementById('detailedSupplyChainFeedback').hidden = false;
      else
      {
        document.getElementById('detailedSupplyChainFeedback').hidden = true;
        this.setState({ supply_chain_feedback: value }, async () => {});
      }
  };

  handleDetailedSupplyChainFeedBack = (event) => {

    this.setState({ supply_chain_feedback: event.target.value }, async () => {});
  };

  handleProcurementFeedBack = (event, { value }) => {
    if(value.toLowerCase() == 'Other'.toLowerCase())
      document.getElementById('detailedProcurementFeedback').hidden = false;
    else
    {
      document.getElementById('detailedProcurementFeedback').hidden = true;
      this.setState({ procurement_feedback: value }, async () => {});
    }
  };

  handleDetailedProcurementFeedBack = (event) => {
    this.setState({ procurement_feedback: event.target.value }, async () => {});
  };

  handleDecisionSupportFeedBack = (event, { value }) => {
    if(value.toLowerCase() == 'Other'.toLowerCase())
      document.getElementById('detailedDecisionSupportFeedback').hidden = false;
    else
    {
      document.getElementById('detailedDecisionSupportFeedback').hidden = true;
      this.setState({ decision_support_feedback: value }, async () => {});
    }
  };
 
  handleDetailedDecisionSupportFeedBack = (event) => {
    this.setState({ decision_support_feedback: event.target.value }, async () => {});
  };
  
  handleIsAnnual = (event, { value }) => {
    this.setState({ is_annual: value }, async () => {});
  };


  ExportAllIECs = ()=>{
    // console.log("in export function")
    this.setState({loading:true}, async () =>{
      const secondFunction = async () => {
        const result = await this.props.refreshToken()
        // do something else here after firstFunction completes  
        
        let anchor = document.createElement("a");
        document.body.appendChild(anchor);
        let file = global.config.BACKEND_IP + `/api-iec/excel-iecs-addition/dummyName`;
  
        let headers = new Headers();
        headers.append('Authorization', 'Bearer '+ sessionStorage.getItem("access_token"));
        
        try{
          fetch(file, { headers })
          .then(response => response.blob())
          .then(blobby => {
              let objectUrl = window.URL.createObjectURL(blobby);
  
              anchor.href = objectUrl;
              anchor.download = 'Export All IECs.xlsx';
              anchor.click();
              this.setState({loading:false});
              window.URL.revokeObjectURL(objectUrl);
          }, (error)=>{
            this.setState({loading:false}, async ()=>{
              alert("Failed to export all IECs!")
            });
          });
        }
        catch(e){
          this.setState({loading:false}, async ()=>{
            alert("Failed to export all IECs!")
          });
        }
        
      }
      secondFunction();
    })
  }
  
  UploadIECExcel = ()=>{

    this.setState({
      showUploadForm : true
    })
    document.getElementById("add_iec").hidden = true;
    
  }

  render() {
    return (
      <div>
        <div></div>
        <Header as="h2">
          <Image src={IEC_icon} /> IECs
        </Header>

        <div style={{ margin: "50px" }}>
          <Button.Group widths="1">
            <Button
              id="calendar_button1"
              size="mini"
              color="red"
              onClick={this.new_iec}
            >
              {" "}
              Add New IEC{" "}
            </Button>
            
              <Button id='calendar_button1'
                size='mini'
                color='red'
                onClick={this.ExportAllIECs}> Export All IECs
              </Button>
              <Button 
                id='calendar_button1'
                size='mini'
                color='red'
                onClick={this.UploadIECExcel.bind(this)}> Upload an IEC
              </Button>
          </Button.Group>
        </div>

        {this.state.showUploadForm ? 
            <div id='upload_excel'>
                <UploadExcel refreshIECs={this.getAllIECs}
                refreshToken={this.props.refreshToken}
                iec_attachment_name = {this.state.iec_attachment_name}
                showUploadForm = {this.state.showUploadForm}
                />
            </div>
            :
            <div></div>
        }

        <div id="add_iec">
          <Form>
            <Divider horizontal>
                      <Header as='h4'>
                        <Icon name='sign-in' />
                        IEC Addition
                      </Header>
                  </Divider>
                  <Table definition>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell width={3}>
                          Project Title
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' placeholder='Project Title' onChange={this.handleProjectTitle}/>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={3}>
                          Project Description
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' placeholder='Project Description' onChange={this.handleProjectDescription}/>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={3}>
                          Project Justification
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' placeholder='Project Justification' onChange={this.handleProjectJustification}/>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={3}>
                          Comment
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' placeholder='Comment' onChange={this.handleProjectComment}/>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={3}>
                          Finance Number
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' type='number' placeholder='Finance Number' onChange={this.handleFinanceNumber}/>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={2}>
                          Request Date
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' type='date' placeholder='Request Date' onChange={this.handleRequestDate}/>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={2}>
                          Start Date
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' type='date' placeholder='Start Date' onChange={this.handleStartDate}/>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={2}>
                          IEC Date
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' type='date' placeholder='IEC Date' onChange={this.handleIecDate}/>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={2}>
                          Capex EGP
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' type='number' placeholder='Capex EGP' onChange={this.handleCapexEGP}/>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={2}>
                          Opex EGP
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' type='number' placeholder='Opex EGP' onChange={this.handleOpexEGP}/>
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row>
                        <Table.Cell width={2}>
                          Status
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            placeholder='Status'
                            selection
                            search
                            options={this.state.statusOptions}
                            onChange={this.handleProjectStatus}
                          />
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row>
                        <Table.Cell width={2}>
                          Supply Chain Feedback
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            placeholder='Supply Chain Feedback'
                            selection
                            search
                            options={this.state.supplyChainFeedBackOptions}
                            onChange={this.handleSupplyChainFeedBack}
                          />
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row className='detailedFeedback' id='detailedSupplyChainFeedback'>
                        <Table.Cell width={2}>
                          Detailed Supply Chain Feedback
                        </Table.Cell>
                        <Table.Cell>
                          <input type='text' placeholder='Detailed Feedback'
                            onChange={this.handleDetailedSupplyChainFeedBack}
                          />
                        </Table.Cell>
                      </Table.Row>

                      
                      
                      <Table.Row>
                        <Table.Cell width={2}>
                          Procurement Feedback
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            placeholder='Procurement Feedback'
                            selection
                            search
                            options={this.state.procurementFeedBackOptions}
                            onChange={this.handleProcurementFeedBack}
                          />
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row className='detailedFeedback' id='detailedProcurementFeedback'>
                        <Table.Cell width={2}>
                          Detailed Procurement Feedback
                        </Table.Cell>
                        <Table.Cell>
                          <input type='text' placeholder='Detailed Feedback'
                            onChange={this.handleDetailedProcurementFeedBack}
                          />
                        </Table.Cell>
                      </Table.Row>
                      
                      <Table.Row>
                        <Table.Cell width={2}>
                          Decision Support Feedback
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            placeholder='Decision Support Feedback'
                            selection
                            search
                            options={this.state.decisionSupportFeedBackOptions}
                            onChange={this.handleDecisionSupportFeedBack}
                          />
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row className='detailedFeedback' id='detailedDecisionSupportFeedback'>
                        <Table.Cell width={2}>
                          Detailed Decision Support Feedback
                        </Table.Cell>
                        <Table.Cell>
                          <input type='text' placeholder='Detailed Feedback'
                            onChange={this.handleDetailedDecisionSupportFeedBack}
                          />
                        </Table.Cell>
                      </Table.Row>
                      
                      <Table.Row>
                        <Table.Cell width={2}>
                          Is Annual
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            placeholder='Is Annual'
                            selection
                            search
                            options={this.state.trueFalseOptions}
                            onChange={this.handleIsAnnual}
                          />
                        </Table.Cell>
                      </Table.Row>
                      
                      <Table.Row>
                        <Table.Cell width={2}>
                          Number of Years
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' placeholder='Number Of Years' type='number' onChange={this.handleNumberOfYears}/>
                        </Table.Cell>
                      </Table.Row>
                      
                      

                      <Table.Row>
                        <Table.Cell width={2}>
                          IEC Attachment
                        </Table.Cell>
                        <Table.Cell>
                          <input className='input' type="file" id=""
                        onChange={this.handleUploadFile}/>

                        </Table.Cell>
                      </Table.Row>

                      
                    </Table.Body>
                  </Table>

            <button id="submitNew" onClick={this.addIec}>
              Submit
            </button>
          </Form>
        </div>
        <div id="table1">
          <BasicTable
            key={this.state.iecOptions}
            data={this.state.iecOptions}
          />
        </div>
      </div>
    );
  }
}

export default Iec;
