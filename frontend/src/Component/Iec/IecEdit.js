import React, { Component } from 'react';
import axios from "axios";
import { Header, Image, Form, Table, Dropdown, Button, Divider} from 'semantic-ui-react'
import IEC_icon from '../../media/IEC.jpg';
import '../../StyleSheets/IECEdit.css';
import $ from 'jquery';
import { Thickness } from '@syncfusion/ej2-react-charts';
import '../../config';

class IecEdit extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      userId: sessionStorage.getItem("user_id"),
      isFileReady: false,
      hasAttachment: false,
      no_attachment_warning: "No attachment uploaded",
      defaultIecDepTypeName: "New IEC_Department_Type",

      // Main IEC
      iecId: 0,
      currentIEC: "",
      tech_number: "",
      finance_number: "",
      project_title: "",
      project_description: "",
      justification: "",
      request_date: "",
      start_date: "",
      iec_date: "",
      iec_status:"",
      supply_chain_feedback:"",
      procurement_feedback: '',
      decision_support_feedback: '',
      is_annual: '',
      number_of_years: '',
      iec_attachment_name:"", //need to be handled
      
      
      uploaded_iec_attachment:"", //need to be handled
      
      // helper arrays
      values: [""],
      statusOptions:[],
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

      // IECItems data
      iecDepTypes: [],
      projectsDescription: [],
      finalRates: [],
      capex_egp: [],
      opex_egp: [],
      ownersNames: [],
      allDepartments: [],
      productTypes: [],
      realocationPRs: [],
      realocationPOs: [],
      foreignCurrencies:[],


      // New IEC Item data
      newProjectDescription:'',
      newFinalRate:'',
      newCapex_egp:'',
      newOpex_egp:'',
      newOwner_name:'',
      newDepartment_name:'',
      newProductType_name:'',
      newRealocationPR:'',
      newRealocationPO:'',
      newForeignCurrency_name:'',
    };
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

          this.setState({ supplyChainFeedBackOptions: result.feedback },async()=>{

          });
          return;
        },
        error: (error) => {
          alert("Unable to load Supply Chain Feedback. Please try your request again");
          return;
        },
      });
  }


  GetCurrentIEC = () => {

    // get IEC attachment
    const secondFunction = async () => {
          
        const result = await this.props.refreshToken();
          
        let anchor = document.createElement("a");
        document.body.appendChild(anchor);
        let file = global.config.BACKEND_IP + `/api-iec/download-iec-attachment/${this.state.iecId}`;

        let headers = new Headers();
        headers.append('Authorization', 'Bearer '+ sessionStorage.getItem("access_token"));

        try{
          fetch(file, {method: 'GET', headers})
          .then(response => {

            console.log("typeof(response) before blob ")
              console.log(typeof(response))
              console.log("response")
              console.log(response)


            response.blob()

            if(response == '')
              this.state.hasAttachment = false;
            else
            {
              this.state.hasAttachment = true;
              console.log("typeof(response)")
              console.log(typeof(response))
              console.log("response")
              console.log(response)
              this.state.uploaded_iec_attachment = response['url'];
              // this.state.uploaded_iec_attachment = response.iec_attachment_file;
              // this.state.iec_attachment_name = response.iec_attachment_name;
              console.log("this.state.uploaded_iec_attachment")
              console.log(this.state.uploaded_iec_attachment)
              console.log("this.state.hasAttachment")
              console.log(this.state.hasAttachment)
            }
          })
          
        }
        catch (error){
          
          this.GetCurrentIEC()
        }
        
    }
    secondFunction();



    $.ajax({
          //get all iecDepTypes for the current IEC
          url: `/api-iec/iec/${this.state.iecId}`,
          type: "GET",
          beforeSend: function (xhr) {
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + sessionStorage.getItem("access_token")
            );
          },
          success: (result) => {
            if (
              result.iec.project_title == null ||
              result.iec.project_title == undefined
            )
              result.iec.project_title = "";
            if (
              result.iec.project_description == null ||
              result.iec.project_description == undefined
            )
              result.iec.project_description = "";
            if (
              result.iec.justification == null ||
              result.iec.justification == undefined
            )
              result.iec.justification = "";
            if (
              result.iec.finance_number == null ||
              result.iec.finance_number == undefined
            )
              result.iec.finance_number = "No IEC Number";
            if (
              result.iec.tech_number == null ||
              result.iec.tech_number == undefined
            )
              result.iec.tech_number = "No Tech Number";
            if (result.iec.iec_date == null || result.iec.iec_date == undefined)
              result.iec.iec_date = "";
            if (
              result.iec.start_date == null ||
              result.iec.start_date == undefined
            )
              result.iec.start_date = "";
            if (
              result.iec.request_date == null ||
              result.iec.request_date == undefined
            )
              result.iec.request_date = "";
            // if(
            //   result.iec.attachment != null &&
            //   result.iec.attachment != undefined &&
            //   result.iec.attachment != ''
            // )
            // this.state.hasAttachment = true;
           

            this.setState(
              {
                currentIEC: result.iec,
                iecDepTypes: result.iecDepTypes,

                project_title: result.iec.project_title,
                project_description: result.iec.project_description,
                justification: result.iec.justification,
                finance_number: result.iec.finance_number,
                tech_number: result.iec.tech_number,
                iec_date: result.iec.iec_date,
                start_date: result.iec.start_date,
                request_date: result.iec.request_date,
                iec_status: result.iec.status['name'],
                // I will just receive the attachment name from the API,
                // If the attachment name is clicked, I will make a request to download it
                // iec_attachment: result.iec.attachment,
                supply_chain_feedback: result.iec.supply_chain_feedback["name"],
                procurement_feedback: result.iec.procurement_feedback["name"],
                decision_support_feedback: result.iec.decision_support_feedback["name"],
                is_annual: result.iec.is_annual,
                number_of_years: result.iec.number_of_years,

                // iec_attachment_name: result.iec.attachment_name,
              },
              async () => {

                console.log('project_title: ', this.state.project_title)
                console.log('project_description: ', this.state.project_description)
                console.log('justification: ', this.state.justification)
                console.log('finance_number: ', this.state.finance_number)
                console.log('tech_number: ', this.state.tech_number)
                console.log('iec_date: ', this.state.iec_date)
                console.log('start_date: ', this.state.start_date)
                console.log('is_annual: ', this.state.is_annual)
                console.log('iec_status: ', this.state.iec_status)
                console.log('decision_support_feedback: ', this.state.decision_support_feedback)
                console.log('procurement_feedback: ', this.state.procurement_feedback)
                console.log('supply_chain_feedback: ', this.state.supply_chain_feedback)

                console.log('iec_attachment_name: ', this.state.iec_attachment_name)

                // Step 1
                 var obj={}
                for (var i in this.state.iecDepTypes) {
                  obj = {
                    'key': this.state.iecDepTypes[i].id,
                    'text': this.state.iecDepTypes[i].description,
                    'value':this.state.iecDepTypes[i].description
                  }                  
                  this.state.projectsDescription.push(obj);
                  obj = {
                    'key': this.state.iecDepTypes[i].id,
                    'text': this.state.iecDepTypes[i].final_rate,
                    'value':this.state.iecDepTypes[i].final_rate
                  }
                  this.state.finalRates.push(obj);
                  obj = {
                    'key': this.state.iecDepTypes[i].id,
                    'text': this.state.iecDepTypes[i].owner.name,
                    'value':this.state.iecDepTypes[i].owner.name
                  }
                  this.state.ownersNames.push(obj);
                  obj = {
                    'key': this.state.iecDepTypes[i].id,
                    'text': this.state.iecDepTypes[i].capex_egp,
                    'value':this.state.iecDepTypes[i].capex_egp
                  }
                  this.state.capex_egp.push(obj);
                  obj = {
                    'key': this.state.iecDepTypes[i].id,
                    'text': this.state.iecDepTypes[i].opex_egp,
                    'value':this.state.iecDepTypes[i].opex_egp
                  }
                  this.state.opex_egp.push(obj);
                  obj = {
                    'key': this.state.iecDepTypes[i].id,
                    'text': this.state.iecDepTypes[i].product_type.name,
                    'value':this.state.iecDepTypes[i].product_type.name
                  }
                  this.state.productTypes.push(obj);
                  obj = {
                    'key': this.state.iecDepTypes[i].id,
                    'text': this.state.iecDepTypes[i].need_realocation_PR,
                    'value':this.state.iecDepTypes[i].need_realocation_PR
                  }
                  this.state.realocationPRs.push(obj);
                  obj = {
                    'key': this.state.iecDepTypes[i].id,
                    'text': this.state.iecDepTypes[i].need_realocation_PO,
                    'value':this.state.iecDepTypes[i].need_realocation_PO
                  }
                  this.state.realocationPOs.push(obj);
                }
              }
            );
            return;
          },
          error: (error) => {
            alert("Unable to load IEC Items. Please try your request again");
            return;
          },
        });
  }

  downloadIecAttachment =() =>{

    let anchor = document.createElement("a");
        document.body.appendChild(anchor);
        let file = global.config.BACKEND_IP + `/api-iec/download-iec-attachment/${this.state.iecId}`;
  
        let headers = new Headers();
        headers.append('Authorization', 'Bearer '+ sessionStorage.getItem("access_token"));
        
        try{
          fetch(file, { headers })
          .then(response => response.blob())
          .then(blobby => {
              let objectUrl = window.URL.createObjectURL(blobby);
  
              anchor.href = objectUrl;
              anchor.download = 'IEC_Attachment.pptx';
              anchor.click();
              this.setState({loading:false});
              window.URL.revokeObjectURL(objectUrl);
          }, (error)=>{
            this.setState({loading:false}, async ()=>{
              alert("Failed to download Attachment!")
            });
          });
        }
        catch(e){
          this.setState({loading:false}, async ()=>{
            alert("Failed to export all IECs!")
          });
        }

  }

  componentDidMount() {
    this.setState({ iecId: this.props.match.params.id }, async () => {

    document.getElementById('detailedSupplyChainFeedback').hidden = true;
    document.getElementById('detailedDecisionSupportFeedback').hidden = true;
    document.getElementById('detailedProcurementFeedback').hidden = true;
    

      const secondFunction = async () => {
        const result = await this.props.refreshToken();

        this.GetCurrentIEC();
        this.getAllStatus();
        this.getAllSupplyChainFeedback();
        this.getAllProcurementFeedback();
        this.getAllDecisionSupportFeedback();

        // Get a list of all owners' names
         $.ajax({

          url: `/api-iec/owners`,
          type: "GET",
          beforeSend: function (xhr) {
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + sessionStorage.getItem("access_token")
            );
          },
          success: (result) => {

            this.setState(
              {
                ownersNames: result.owners,
              },async()=>{
            console.log("el mafrod el ownersNames eh: ", this.state.ownersNames)

              });


            // var obj={}
            // for (var i in result.owners) {
            //   obj = {
            //     'key':result.owners[i]['id'],
            //     'value': result.owners[i]['name'],
            //     'text': result.owners[i]['name'],
            //   }
            //   this.state.ownersNames.push(obj);
            // }


            return;
          },
          error: (error) => {
            alert("Unable to load All Owners Names. Please try your request again");
            return;
          },
        });

        // Get a list of all product types
         $.ajax({
          url: `/api-iec/productType`,
          type: "GET",
          beforeSend: function (xhr) {
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + sessionStorage.getItem("access_token")
            );
          },
          success: (result) => {
            
            this.setState(
              {
                productTypes: result.productType,
              },
            );
            
            // var obj={}
            // for (var i in result.productType) {
            //   obj = {
            //     'key':result.productType[i]['id'],
            //     'value': result.productType[i]['name'],
            //     'text': result.productType[i]['name'],
            //   }
            //   this.state.productTypes.push(obj);
            // }
            console.log("el mafrod el productTypes eh: ", this.state.productTypes)

            
            return;
          },
          error: (error) => {
            alert("Unable to load All Product Types. Please try your request again");
            return;
          },
        });

        // Get a list of all departments
         $.ajax({

          url: `/api-iec/departments`,
          type: "GET",
          beforeSend: function (xhr) {
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + sessionStorage.getItem("access_token")
            );
          },
          success: (result) => {
            this.setState(
              {
                allDepartments: result.department,
              }, async()=>{
            console.log("el mafrod el allDepartments eh: ", this.state.allDepartments);

              }
            );

            //   var obj={}
            // for (var i in result.department) {
            //   obj = {
            //     'key':result.department[i]['id'],
            //     'value': result.department[i]['name'],
            //     'text': result.department[i]['name'],
            //   }
            //   this.state.allDepartments.push(obj);
            // }
            return;
          },
          error: (error) => {
            alert("Unable to load All Departments. Please try your request again");
            return;
          },
        });

        // Get a list of all Foreign Currencies
         $.ajax({

          url: `/api-iec/foreignCurrencies`,
          type: "GET",
          beforeSend: function (xhr) {
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + sessionStorage.getItem("access_token")
            );
          },
          success: (result) => {
            this.setState(
              {
                foreignCurrencies: result.foreign_currencies,
              }, async()=>{console.log("el mafrod el currencies eh: ", this.state.foreignCurrencies)},
            );
            
            // var obj={}
            // for (var i in result.foreign_currencies) {
            //   obj = {
            //     'key':result.foreign_currencies[i]['id'],
            //     'value': result.foreign_currencies[i]['name'],
            //     'text': result.foreign_currencies[i]['name'],
            //   }
            //   this.state.foreignCurrencies.push(obj);
            // }
            console.log("el mafrod el currencies eh: ", this.state.foreignCurrencies)
            return;
          },
          error: (error) => {
            alert("Unable to load All Foreign Currencies. Please try your request again");
            return;
          },
        });


      };
      secondFunction();
    });
  }

  
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

  handleNumberOfYears = (event) => {
    this.setState({ number_of_years: event.target.value });
  };



  //for dropdown
  handleMainIecStatus = (event, { value }) => {
    this.setState({ iec_status: value }, async () => {});
  };

  // DONE
  iecDeleteId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken();

      $.ajax({
        url: `/api-iec/iec/${this.state.iecId}`,
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
          editAction: "delete",
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          if(result.success === 'used as a foreign key')
            alert(`Can't delete ${this.state.currentIEC.project_title}, as it has IEC Items`)
          this.props.history.push("/iec");
          return;
        },
        error: (error) => {
          $.ajax({
            url: `/api-iec/iec/${this.state.iecId}`,
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
              editAction: "deactivate",
            }),
            xhrFields: {
              withCredentials: true,
            },
            crossDomain: true,
            success: (result) => {
              this.props.history.push("/iec");
              return;
            },
            error: (error) => {
              alert("Unable to delete the IEC. Please try your request again");
              return;
            },
          });
          return;
        },
      });
    };
    secondFunction();
  };

  // DONE EL7
  // iecEditId = (event) => {

  //   var attachmentName = ''
  //   // the user uploaded a new file,
  //   // I should upload it AND DELETE the old one if exists
  //   //! DIDN'T delete the old one yet
  //   if(this.state.uploaded_iec_attachment != ""){
  //       attachmentName = this.state.uploaded_iec_attachment.name;

  //       var data1 = new FormData();

  //       data1.append('file', this.state.uploaded_iec_attachment);
  //       data1.append('filename', attachmentName);

  //       axios
  //         .post(global.config.BACKEND_IP + "/api-iec/uploadFiles/" + attachmentName, data1)
  //         .then((response) => {
  //           // console.log("FILE UPLOADED B-SALAMA :)");
  //           // console.log(response);
  //         })
  //   }
  //   else
  //       attachmentName = this.state.iec_attachment_name;

  //   event.preventDefault();
  //   const secondFunction = async () => {
  //     const result = await this.props.refreshToken();
  //     $.ajax({
  //       url: `/api-iec/iec/${this.state.iecId}`,
  //       type: "POST",
  //       beforeSend: function (xhr) {
  //         //Include the bearer token in header
  //         xhr.setRequestHeader(
  //           "Authorization",
  //           "Bearer " + sessionStorage.getItem("access_token")
  //         );
  //       },
  //       dataType: "json",
  //       contentType: "application/json",
  //       data: JSON.stringify({
  //         editAction: "edit",
          
  //         project_title: this.state.project_title,
  //         project_description: this.state.project_description,
  //         justification: this.state.justification,
  //         request_date: this.state.request_date,
  //         // start_date: this.state.start_date,
  //         iec_date: this.state.iec_date,
  //         // attachment: this.state.iec_attachment,
  //         attachment_name: attachmentName,
  //         tech_number: this.state.tech_number,
  //         finance_number: this.state.finance_number,

  //       }),
  //       xhrFields: {
  //         withCredentials: true,
  //       },
  //       crossDomain: true,
  //       success: (result) => {
  //         if (result.success !== true) {
  //           alert("Can't update IEC");
  //         } else {
  //           this.props.history.push("/iec");
  //         }
  //         return;
  //       },
  //       error: (error) => {
  //         alert("Unable to update the IEC. Please try your request again");
  //         return;
  //       },
  //     });
  //   };
  //   secondFunction();
  // };
  
  // DONE

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
  
  iecEditId=()=>{

      const secondFunction = async () => {
      const result = await this.props.refreshToken();
      $.ajax({
        url: `/api-iec/iec/${this.state.iecId}`,
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

          editAction: "edit",
          
          project_title: this.state.project_title,
          project_description: this.state.project_description,
          justification: this.state.justification,
          request_date: this.state.request_date,
          start_date: this.state.start_date,
          iec_date: this.state.iec_date,
          // attachment: this.state.iec_attachment,
          // attachment_name: attachmentName,
          tech_number: this.state.tech_number,
          finance_number: this.state.finance_number,
          status: this.state.iec_status,
          procurement_feedback: this.state.procurement_feedback,
          decision_support_feedback: this.state.decision_support_feedback,
          supply_chain_feedback: this.state.supply_chain_feedback,
          is_annual: this.state.is_annual,
          number_of_years: this.state.number_of_years,
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          if (result.success !== true) {
            alert("Can't update IEC");
          } else {
            this.props.history.push("/iec");
          }
          return;
        },
        error: (error) => {
          alert("Unable to update the IEC. Please try your request again");
          return;
        },
      });
    };
    secondFunction();

    if(this.state.uploaded_iec_attachment != "")
      this.modifyIecAttachment()

  }
  
  
  
  cancelId = () => {
    this.props.history.push("/iec");
  };

  // DONE
  showUploadFile =()=>{
    document.getElementById('uploadFile').style.display = 'block';
  }
  
  // DONE
  downloadFile = () => {

    console.log("DOWNLOAD BUTTON CLICKED");

    //! NEED to change this API
    var file_URL = global.config.BACKEND_IP + "/api-iec/downloadFiles/" + this.state.iec_attachment_name;

    // Make a request to the backend to get the file, then open it in a new tab to download it
    axios.get(file_URL).then(() => {
      window.open(file_URL, "_blank");
    });
  };

 // DONE
handleUploadFile = async (event) => {
   this.setState({

    uploaded_iec_attachment: event.target.files[0],
    isFileReady: true,
    iec_attachment_name: event.target.files[0].name,
    no_attachment_warning:''

   }, async()=>{
    console.log("uploaded file is:");
    console.log(typeof(this.state.uploaded_iec_attachment));
    console.log(this.state.uploaded_iec_attachment);
    console.log("iec_attachment_name:");
    console.log(this.state.iec_attachment_name);

   });
}

//!NOT DONE YET
  iecDepTypeEditId =(i, event) =>{
    // event.target ==> el button
    // i ==> index el clicked item
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      $.ajax({
        //edit this URL
        url: `/api-iec/iecDepType/${this.state.iecDepTypes[i].id}`,
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
          editAction: "edit",

          description: this.state.projectsDescription[i].description,
          final_rate: this.state.finalRates[i].final_rate,
          capex_egp: this.state.capex_egp[i].capex_egp,
          opex_egp: this.state.opex_egp[i].opex_egp,
          need_realocation_PR: this.state.need_realocation_PR[i],
          need_realocation_PO: this.state.need_realocation_PO[i],
          // owner & product_type must be a dropdown list to choose ONLY from a given list
          owner_name: this.state.ownersNames[i].value,
          product_type: this.state.productTypes[i].value,

        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          if (result.error !== "") {
            alert(result.error);
          } else {
            this.props.history.push("/iec");
          }
          return;
        },
        error: (error) => {
          alert("Unable to update the IEC. Please try your request again");
          return;
        },
      });
    };
   // secondFunction();

  }

//DONE
  iecDepTypeDeleteId =(i,event)=>{

    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      $.ajax({
        url: `/api-iec/iecDepType/${this.state.iecDepTypes[i].id}`,
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
          editAction: "delete",
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          if (result.error !== "") {
            alert(result.error);
          } else {
            this.props.history.push(`/iec/${this.state.iecId}`);
            // this.props.history.push("/iecEdit");
          }
          return;
        },
        error: (error) => {
          alert("Unable to update this IEC item. Please try your request again");
          return;
        },
      });
    };
    secondFunction();

  }

  deleteNewIecDepType =(i)=>{
    document.getElementById('newItem_'+i).display='none';
  }
  
  //DONE
  cancelDepTypeId = () => {
    this.props.history.push(`/iec/${this.state.iecId}`);
  };

  /* ------------ Beginning of Main IEC functions ------------- */

  // DONE
  handleMainIecProjectTitle = (event) => {
    this.setState({ project_title: event.target.value });
  };
  
  // DONE
  handleMainIecProjectDescription = (event) => {
    this.setState({ project_description: event.target.value });
  };
  
  // DONE
  handleMainIecProjectJustification = (event) => {
    this.setState({ justification: event.target.value });
  };

   //DONE
  handleMainIecTechNumber = (event) => {
    this.setState({ tech_number: event.target.value });
  };

  //DONE
  handleMainIecFinanceNumber = (event) => {
    this.setState({ finance_number: event.target.value });
  };

   // DONE
  handleMainIecRequestDate = (event) => {
    this.setState({ request_date: event.target.value });
  };

  //DONE, but not used yet
  handleMainIecStartDate = (event) => {
    this.setState({ start_date: event.target.value });
  };

  // DONE
  handleMainIecDate = (event) => {
    this.setState({ iec_date: event.target.value });
  };


  /* ------------ End of Main IEC functions ------------- */  
  

  /* ------------ Beginning of IEC Items functions ------------- */

  // replaced values with iecDepTypes
  addIecItem() {
    this.setState((prevState) => ({
      iecDepTypes: [...prevState.iecDepTypes, ""],
    }));
  }

  /* ----------------- Step 2 ------------------ */

  // Done
  handleItemsProjectsDescription = (i, event) => {
    let projectsDescription = [...this.state.projectsDescription];
    projectsDescription[i] = event.target.value;
    this.setState({
      projectsDescription: projectsDescription,
    }, async()=>{
      console.log("this.state.projectsDescription")
      console.log(this.state.projectsDescription)
    });
  };

  // Done
  handleItemsFinalRate = (i, event, { value }) => {
    let finalRates = [...this.state.finalRates];
    finalRates[i] = value;
    this.setState({
      finalRates: finalRates,
    });
  };
  
  // Done
  handleItemsCapexEGP = (i, event, value ) => {
    let capex_egp = [...this.state.capex_egp];
    capex_egp[i] = value;
    this.setState({
      capex_egp: capex_egp,
    }, async()=>{
      console.log("in handle editing capex, i: ", i)
      console.log("in handle editing capex, value: ", value)
      console.log("in handle editing capex, event: ", event)
      console.log("in handle editing capex, event.target: ", event.target)
      console.log("in handle editing capex, event.target.value: ", event.target.value)
    });
  };

  // Done
  handleItemsOpexEGP = (i, event, { value }) => {
    let opex_egp = [...this.state.opex_egp];
    opex_egp[i] = value;
    this.setState({
      opex_egp: opex_egp,
    });
  };

  handleItemsDepartment = (i, event, data) =>{
    let allDepartments = [...this.state.allDepartments];
    allDepartments[i] = data.value;
    this.setState({
      allDepartments: allDepartments,
    })
  }
  
  handleItemsForeignCurrencies = (i, event, data) =>{
    let foreignCurrencies = [...this.state.foreignCurrencies];
    foreignCurrencies[i]['value'] = data.value;
    foreignCurrencies[i]['text ']= data.value;
    this.setState({
      foreignCurrencies: foreignCurrencies,
    })
  }
  
  //! NOT Done, can't get the selected value
  handleItemsOwnerName = (i, event, {value}) =>{
    let ownersNames = [...this.state.ownersNames];
    ownersNames[i] = value;
    this.setState({
      ownersNames: ownersNames,
    }, async()=>{
      console.log("ownersNames")
      console.log(this.state.ownersNames)
    })
  }

//! NOT Done, can't get the selected value
  handleItemsProductType = (i, event, data) =>{
    console.log("in handle items product type")
    console.log("i:")
    console.log(i)
    console.log("event:")
    console.log(event)
    console.log("event.target:")
    console.log(event.target)
    console.log("event.target.Name:")
    console.log(event.target.name)
    console.log("event.target.value")
    console.log(event.target.value)
    console.log("data:")
    console.log(data)
    console.log("data.value:")
    console.log(data.value)
    
    let productTypes = [...this.state.productTypes];
    productTypes[i] = data.value;
    this.setState({
      productTypes: productTypes,
    }, async()=>{
      console.log("this.state.productTypes after editing")
      console.log(this.state.productTypes)
    })
  }

  // Done
  handleItemsNeedRealocationPR = (i, event, {value}) =>{
    let realocationPRs = [...this.state.realocationPRs];
    realocationPRs[i] = value;
    this.setState({
      realocationPRs: realocationPRs,
    })
  }

  // Done
  handleItemsNeedRealocationPO = (i, event, {value}) =>{
    let realocationPOs = [...this.state.realocationPOs];
    realocationPOs[i] = value;
    this.setState({
      realocationPOs: realocationPOs,
    })
  }

  addNewIecDepType(){
    $.ajax({
          url: `/api-iec/iecDepType`,
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
            // editAction: "edit",
            
            iec_parent_id: this.state.iecId,
            description: this.state.newProjectDescription,
            final_rate: this.state.newFinalRate,
            capex_egp: this.state.newCapex_egp,
            opex_egp: this.state.newOpex_egp,
            owner_name: this.state.newOwner_name,
            // department_name: this.state.newDepartment_name,
            productType_name: this.state.newProductType_name,
            realocationPR: this.state.newRealocationPR,
            realocationPO: this.state.newRealocationPO,
            currency_name: this.state.newForeignCurrency_name,

          }),
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,

          //get all iecDepTypes for the current IEC again
          success: (result) => {
            $.ajax({
          url: `/api-iec/iec/${this.state.iecId}`,
          type: "GET",
          beforeSend: function (xhr) {
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + sessionStorage.getItem("access_token")
            );
          },
          success: (result) => {
            if (
              result.iec.project_title == null ||
              result.iec.project_title == undefined
            )
              result.iec.project_title = "";
            if (
              result.iec.project_description == null ||
              result.iec.project_description == undefined
            )
              result.iec.project_description = "";
            if (
              result.iec.justification == null ||
              result.iec.justification == undefined
            )
              result.iec.justification = "";
            if (
              result.iec.finance_number == null ||
              result.iec.finance_number == undefined
            )
              result.iec.finance_number = "No IEC Number";
            if (
              result.iec.tech_number == null ||
              result.iec.tech_number == undefined
            )
              result.iec.tech_number = "No Tech Number";
            if (result.iec.iec_date == null || result.iec.iec_date == undefined)
              result.iec.iec_date = "";
            if (
              result.iec.start_date == null ||
              result.iec.start_date == undefined
            )
              result.iec.start_date = "";
            if (
              result.iec.request_date == null ||
              result.iec.request_date == undefined
            )
              result.iec.request_date = "";
            // if(
            //   result.iec.attachment_name != null &&
            //   result.iec.attachment_name != undefined &&
            //   result.iec.attachment_name != ''
            // )
            // this.state.hasAttachment = true;

            this.setState(
              {
                currentIEC: result.iec,
                iecDepTypes: result.iecDepTypes,

                project_title: result.iec.project_title,
                project_description: result.iec.project_description,
                justification: result.iec.justification,
                finance_number: result.iec.finance_number,
                tech_number: result.iec.tech_number,
                iec_date: result.iec.iec_date,
                start_date: result.iec.start_date,
                request_date: result.iec.request_date,
                // I will just receive the attachment name from the API,
                // If the attachment name is clicked, I will make a request to download it
                // iec_attachment: result.iec.attachment,
                // iec_attachment_name: result.iec.attachment_name,
              },
              async () => {
                
                this.state.projectsDescription = [];
                this.state.finalRates = [];
                this.state.ownersNames = [];
                this.state.capex_egp = [];
                this.state.opex_egp = [];
                this.state.productTypes = [];
                this.state.realocationPRs = [];
                this.state.realocationPOs = [];

                var obj={}

                for (var i in this.state.iecDepTypes) {
                  obj = {
                    'key': this.state.iecDepTypes[i].id,
                    'text': this.state.iecDepTypes[i].description,
                    'value':this.state.iecDepTypes[i].description
                  }                  
                  this.state.projectsDescription.push(obj);
                  obj = {
                    'key': this.state.iecDepTypes[i].id,
                    'text': this.state.iecDepTypes[i].final_rate,
                    'value':this.state.iecDepTypes[i].final_rate
                  }
                  this.state.finalRates.push(obj);
                  obj = {
                    'key': this.state.iecDepTypes[i].owner.id,
                    'text': this.state.iecDepTypes[i].owner.name,
                    'value':this.state.iecDepTypes[i].owner.name
                  }
                  this.state.ownersNames.push(obj);
                  obj = {
                    'key': i,
                    'text': this.state.iecDepTypes[i].capex_egp,
                    'value':this.state.iecDepTypes[i].capex_egp
                  }
                  this.state.capex_egp.push(obj);
                  obj = {
                    'key': i,
                    'text': this.state.iecDepTypes[i].opex_egp,
                    'value':this.state.iecDepTypes[i].opex_egp
                  }
                  this.state.opex_egp.push(obj);
                  obj = {
                    'key': this.state.iecDepTypes[i].product_type.id,
                    'text': this.state.iecDepTypes[i].product_type.name,
                    'value':this.state.iecDepTypes[i].product_type.name
                  }
                  this.state.productTypes.push(obj);
                  obj = {
                    'key': i,
                    'text': this.state.iecDepTypes[i].need_realocation_PR,
                    'value':this.state.iecDepTypes[i].need_realocation_PR
                  }
                  this.state.realocationPRs.push(obj);
                  obj = {
                    'key': i,
                    'text': this.state.iecDepTypes[i].need_realocation_PO,
                    'value':this.state.iecDepTypes[i].need_realocation_PO
                  }
                  this.state.realocationPOs.push(obj);
                }
              }
            );
            return;
          },
          error: (error) => {
            alert("Unable to load IEC Items. Please try your request again");
            return;
          },
        });
          },
          error: (error) => {
            alert("Unable to update the Add new item. Please try your request again");
            return;
          },
    });
  }

  
  // el mafrod DONE
  // atmna y3ny :|
  removeIecItem(i) {
    var deletedItem = this.state.iecDepTypes[i];
    //console.log("el mafrod a delete el item dh:");
    //console.log(deletedItem);

    // event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken();

      $.ajax({
        url: `/api-iec/iecDepType/${deletedItem.id}`,
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
          editAction: "delete",
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          //this.props.history.push("/iec");
          return;
        },
        error: (error) => {
          $.ajax({
            url: `/api-iec/iec/${this.state.iecId}`,
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
              editAction: "deactivate",
            }),
            xhrFields: {
              withCredentials: true,
            },
            crossDomain: true,
            success: (result) => {
              // this.props.history.push("/iec");
              return;
            },
            error: (error) => {
              alert(
                "Unable to delete this Item. Please try your request again"
              );
              return;
            },
          });
          return;
        },
      });
    };
    secondFunction();

    let iecDepTypes = [...this.state.iecDepTypes];
    iecDepTypes.splice(i, 1);

    this.setState({
      iecDepTypes,
    });
  }

  /* ------------ End of IEC Items functions ------------- */

  handlePONumber = (i, event) => {
    let d = [...this.state.poNumber];
    d[i] = event.target.value;
    this.setState({
      poNumber: d,
    });
  };

  handleNewProjectDescription = (event) =>{

    this.setState({
      newProjectDescription:event.target.value
    },async()=>{
      console.log("new desc: ", this.state.newProjectDescription)
    })

  }

  handleNewFinalRate = (event) =>{

    this.setState({
      newFinalRate:event.target.value
    },async()=>{
      console.log("newFinalRate: ", this.state.newFinalRate)
    })

  }

  handleNewCapexEGP = (event) =>{

    this.setState({
      newCapex_egp:event.target.value
    },async()=>{
      console.log("newCapex_egp: ", this.state.newCapex_egp)
    })

  }

  handleNewOpexEGP = (event) =>{

    this.setState({
      newOpex_egp:event.target.value
    },async()=>{
      console.log("newOpex_egp: ", this.state.newOpex_egp)
    })

  }

  handleNewForeignCurrency = (event, {value})  =>{

    console.log("in handle new FC")
    console.log("event ", event)
    console.log("value ", value)

    this.setState({
      newForeignCurrency_name: value
    },async()=>{
      console.log("newForeignCurrency_name: ", this.state.newForeignCurrency_name)
    })

  }

  handleNewOwnerName = (event, {value})  =>{

    this.setState({
      newOwner_name: value
    },async()=>{
      console.log("newOwner_name: ", this.state.newOwner_name)
    })

  }

  // handleNewProductType = (i,event, {value}) =>{
  handleNewProductType = (event, {value})  =>{

    this.setState({
      newProductType_name: value
    },async()=>{
      console.log("newProductType_name: ", this.state.newProductType_name)
    })

  }

   handleNewNeedRealocationPR = (event, {value}) =>{

    this.setState({
      newRealocationPR: value
    },async()=>{
      console.log("newRealocationPR: ", this.state.newRealocationPR)
    })

  }

   handleNewNeedRealocationPO = (event, {value}) =>{

    this.setState({
      newRealocationPO: value
    },async()=>{
      console.log("newRealocationPO: ", this.state.newRealocationPO)
    })

  }

  RenderExistingIecDepType(el, i){

    return(

<div id={`existingItem_`+i}>
  
        <h2>
            IEC_{el.owner.department.name}_{el.product_type.name}
        </h2>
          <div>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Project Description</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      defaultValue={this.state.iecDepTypes[i].description}
                      onChange={this.handleItemsProjectsDescription.bind(this, i)}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>Final Rate</Table.Cell>
                  <Table.Cell>
                    {/* <input
                      // id="input"
                      defaultValue={this.state.iecDepTypes[i].final_rate}
                      onChange={this.handleItemsFinalRate.bind(this, i)}
                    /> */}
                    {this.state.iecDepTypes[i].final_rate}
                  </Table.Cell>
                </Table.Row>
  
                <Table.Row>
                  <Table.Cell width={3}>Capex EGP</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      defaultValue={this.state.iecDepTypes[i].capex_egp + " EGP"}
                      onChange={this.handleItemsCapexEGP.bind(this, i)}
                    />
                  </Table.Cell>
                </Table.Row>
  
                <Table.Row>
                  <Table.Cell width={3}>Capex Foreign</Table.Cell>
                  <Table.Cell>
                    <input
                      readOnly
                      id="input"
                      defaultValue={
                        (
                          this.state.iecDepTypes[i].capex_egp *
                          this.state.iecDepTypes[i].final_rate
                        ).toString() +
                        " " +
                        this.state.iecDepTypes[i].foreign_currency["name"]
                      }
                      // onChange={this.handleCapex.bind(this, i)}
                    />
                  </Table.Cell>
                </Table.Row>
  
                <Table.Row>
                  <Table.Cell width={3}>Opex EGP</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      defaultValue={this.state.iecDepTypes[i].opex_egp + " EGP"}
                      onChange={this.handleItemsOpexEGP.bind(this, i)}
                    />
                  </Table.Cell>
                </Table.Row>
  
                <Table.Row>
                  <Table.Cell width={3}>Opex Foreign</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      readOnly
                      defaultValue={
                        (
                          this.state.iecDepTypes[i].opex_egp *
                          this.state.iecDepTypes[i].final_rate
                        ).toString() +
                        " " +
                        this.state.iecDepTypes[i].foreign_currency["name"]
                      }
                      // onChange={this.handleOpex.bind(this, i)}
                    />
                  </Table.Cell>
                </Table.Row>
  
                <Table.Row>
                  <Table.Cell width={3}>Owner</Table.Cell>
                  <Table.Cell
                        >
                    {/* <input
                      id="input"
                      defaultValue={
                        this.state.iecDepTypes[i].owner["name"]
                      }
                      onChange={this.handleItemsOwnerName.bind(this, i)}
                    /> */}
                    <Dropdown
                        text={this.state.iecDepTypes[i].owner["name"]}
                        selection
                        search
                        options={this.state.ownersNames}
                        onChange={this.handleItemsOwnerName.bind(this, i)}
                      />
                  </Table.Cell>
                </Table.Row>
  
                <Table.Row>
                  <Table.Cell width={3}>Department</Table.Cell>
                   <Table.Cell>
                    {/*<Dropdown
                        text={this.state.iecDepTypes[i].owner["department"]["name"]}
                        selection
                        search
                        options={this.state.allDepartments}
                        onChange={this.handleItemsDepartment.bind(this, i)}
                      />*/}
                  {this.state.iecDepTypes[i].owner["department"]["name"]}
                  </Table.Cell> 
                </Table.Row>
  
                <Table.Row>
                  <Table.Cell width={3}>Product Type</Table.Cell>
                  <Table.Cell>
                    
                    <Dropdown
                        text={this.state.iecDepTypes[i].product_type["name"]}
                        selection
                        search
                        options={this.state.productTypes}
                        onChange={this.handleItemsProductType.bind(this, i)}
                      />
                  </Table.Cell>
                </Table.Row>
  
                <Table.Row>
                  <Table.Cell width={3}>Need Re-allocation PR</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      defaultValue={
                        this.state.iecDepTypes[i].need_realocation_PR
                      }
                      onChange={this.handleItemsNeedRealocationPR.bind(this, i)}
                    />
                  </Table.Cell>
                </Table.Row>
  
                <Table.Row>
                  <Table.Cell width={3}>Need Re-allocation PO</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      defaultValue={
                        this.state.iecDepTypes[i].need_realocation_PO
                      }
                      onChange={this.handleItemsNeedRealocationPO.bind(this, i)}
                    />
                  </Table.Cell>
                </Table.Row>
  
  
  {/* Add & delete buttons */}
                <Table.Row>
                  <Table.Cell width={2} textAlign="center"></Table.Cell>
                  <Table.Cell textAlign="center">
                    {this.state.iecDepTypes.length === 1 ||
                    this.state.iecDepTypes.length === 0 ? (
                      <Button
                        id="add"
                        circular
                        icon="add"
                        onClick={this.addIecItem.bind(this)}
                      />
                    ) : (
                      <React.Fragment>
                        <Button
                          id="remove"
                          circular
                          icon="remove circle"
                          // icon="circular remove"
                          onClick={this.removeIecItem.bind(this, i)}
                        />
                        <Button
                          id="add"
                          circular
                          icon="add"
                          onClick={this.addIecItem.bind(this)}
                        />
                      </React.Fragment>
                    )}
                  </Table.Cell>
                </Table.Row>
  
              </Table.Body>
            </Table>
  
            <button id="submitNew" onClick={this.iecDepTypeEditId.bind(this, i)}>
                Update Item
              </button>
            {/* <button id="submitNew" onClick={this.cancelDepTypeId}>
                Cancel
              </button>
              <button id="submitNew" onClick={this.iecDepTypeDeleteId.bind(this,i)}>
                Delete Item
              </button> */}
  
          </div>
  
          <Divider horizontal />
</div>

    )
  }
  

  RenderNewIecDepType(i){

    return(
<div id={`newItem_`+i}>
  
        <h2>
            {this.state.defaultIecDepTypeName}
        </h2>
          <div>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Project Description</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      //defaultValue={}
                      onChange={this.handleNewProjectDescription}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>Final Rate</Table.Cell>
                  <Table.Cell>
                    <input
                      // id="input"
                      //defaultValue={}
                      onChange={this.handleNewFinalRate}
                    />
                  </Table.Cell>
                </Table.Row>
  
                <Table.Row>
                  <Table.Cell width={3}>Capex EGP</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      //defaultValue={}
                      onChange={this.handleNewCapexEGP}
                    />
                  </Table.Cell>
                </Table.Row>
  
                
                <Table.Row>
                  <Table.Cell width={3}>Opex EGP</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      //defaultValue={}
                      onChange={this.handleNewOpexEGP}
                    />
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  {/* make it a dropdown list */}
                  <Table.Cell width={3}>Foreign Currency</Table.Cell>
                  <Table.Cell>
                    <Dropdown
                        // text={this.state.iecDepTypes[i].owner["name"]}
                        selection
                        search
                        options={this.state.foreignCurrencies}
                        onChange={this.handleNewForeignCurrency}
                      />
                  </Table.Cell>
                </Table.Row>
  
                <Table.Row>
                  <Table.Cell width={3}>Owner</Table.Cell>
                  <Table.Cell>
                    <Dropdown
                        // text={this.state.iecDepTypes[i].owner["name"]}
                        selection
                        search
                        options={this.state.ownersNames}
                        onChange={this.handleNewOwnerName}
                      />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>Product Type</Table.Cell>
                  <Table.Cell>
                    <Dropdown
                        // text={this.state.iecDepTypes[i].product_type["name"]}
                        selection
                        // search
                        options={this.state.productTypes}
                        onChange={this.handleNewProductType}
                      />
                  </Table.Cell>
                </Table.Row>
  
                <Table.Row>
                  <Table.Cell width={3}>Need Re-allocation PR</Table.Cell>
                  <Table.Cell>

                    <Dropdown
                      selection
                      options={this.state.trueFalseOptions}
                      onChange={this.handleNewNeedRealocationPR}
                    />
                  </Table.Cell>
                </Table.Row>
  
                <Table.Row>
                  <Table.Cell width={3}>Need Re-allocation PO</Table.Cell>
                  <Table.Cell>
                    
                    <Dropdown
                      selection
                      options={this.state.trueFalseOptions}
                      onChange={this.handleNewNeedRealocationPO}
                    />
                  </Table.Cell>
                </Table.Row>

<Table.Row>
                  <Table.Cell width={2} textAlign="center"></Table.Cell>
                  <Table.Cell textAlign="center">
                {this.state.iecDepTypes.length === 1 ||
                    this.state.iecDepTypes.length === 0 ? (
                      <Button
                        id="add"
                        circular
                        icon="add"
                        onClick={this.addIecItem.bind(this)}
                      />
                    ) : (
                      <React.Fragment>
                        <Button
                          id="remove"
                          circular
                          icon="remove circle"
                          // icon="circular remove"
                          onClick={this.removeIecItem.bind(this, i)}
                        />
                        <Button
                          id="add"
                          circular
                          icon="add"
                          onClick={this.addIecItem.bind(this)}
                        />
                      </React.Fragment>
                    )}
  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
  
            <button id="submitNew" onClick={this.addNewIecDepType.bind(this)}>
                Add New Item
              </button>
            {/* <button id="submitNew" onClick={this.cancelDepTypeId}>
                Cancel
              </button>
              {/* <button id="submitNew" onClick={this.iecDepTypeDeleteId.bind(this,i)}> *}
              <button id="submitNew" onClick={this.deleteNewIecDepType.bind(this,i)}>
                Delete Item
              </button> */}
  
          </div>
  
          <Divider horizontal />
</div>
)
  }
  
  
  createIecDepTypes() {
    if (this.state.iecDepTypes.length == 0)
      return this.RenderNewIecDepType(0);
   return this.state.iecDepTypes.map((el, i) => (
      <div className="iecItems" key={i}>
        {/* <h2>IEC Item {i + 1}</h2> */}
          {(el !== "") ? this.RenderExistingIecDepType(el, i) : this.RenderNewIecDepType(i)}
      </div>
    ));
  }

  render() {
    return (
      <div>
        <div></div>
        <Header as="h2">
          <Image src={IEC_icon} /> IEC Edit
        </Header>

        {this.state.iecId !== 0 && (
          <div id="edit_iec">
            <Form>
              <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Project Title</Table.Cell>
                    <Table.Cell>
                      <input
                        id="input"
                        defaultValue={this.state.project_title}
                        onChange={this.handleMainIecProjectTitle}
                      />
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>Project Description</Table.Cell>
                    <Table.Cell>
                      <input
                        id="input"
                        defaultValue={this.state.project_description}
                        onChange={this.handleMainIecProjectDescription}
                      />
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>Project Justification</Table.Cell>
                    <Table.Cell>
                      <input
                        id="input"
                        defaultValue={this.state.justification}
                        onChange={this.handleMainIecProjectJustification}
                      />
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>Tech Number</Table.Cell>
                    <Table.Cell>
                      <input
                        id="input"
                        defaultValue={this.state.tech_number} //msh byzhr el value ely f-el BE
                        onChange={this.handleMainIecTechNumber}
                      />
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>Finance Number</Table.Cell>
                    <Table.Cell>
                      <input
                        id="input"
                        defaultValue={this.state.finance_number} //msh byzhr el value ely f-el BE
                        onChange={this.handleMainIecFinanceNumber}
                      />
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>Request Date</Table.Cell>
                    <Table.Cell>
                      <input
                        id="input"
                        type="date"
                        defaultValue={this.state.request_date}
                        onChange={this.handleMainIecRequestDate}
                      />
                    </Table.Cell>
                  </Table.Row>

                  {/*!!!!!!!!!!!*/}
                  {/* <Table.Raw>
                    <Table.Cell>Start Date</Table.Cell>
                    <Table.Cell>
                      <input
                        id="input"
                        type="date"
                        defaultValue={this.state.start_date}
                        onChange={this.handleMainIecStartDate}
                      />
                    </Table.Cell>
                  </Table.Raw> */}

                  <Table.Row>
                    <Table.Cell>IEC Date</Table.Cell>
                    <Table.Cell>
                      <input
                        id="input"
                        type="date"
                        defaultValue={this.state.currentIEC["iec_date"]}
                        onChange={this.handleMainIecDate}
                      />
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell width={2}>
                      Status
                    </Table.Cell>
                    <Table.Cell>
                      <Dropdown
                        placeholder={this.state.iec_status}
                        selection
                        search
                        options={this.state.statusOptions}
                        onChange={this.handleMainIecStatus}
                      />
                    </Table.Cell>
                  </Table.Row>

                  
                      <Table.Row>
                        <Table.Cell width={2}>
                          Supply Chain Feedback
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            placeholder={this.state.supply_chain_feedback}
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
                            placeholder={this.state.procurement_feedback}
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
                            placeholder={this.state.decision_support_feedback}
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
                          {this.state.is_annual ? <Dropdown
                            placeholder='True'
                            selection
                            search
                            options={this.state.trueFalseOptions}
                            onChange={this.handleIsAnnual}
                          />:
                          <Dropdown
                            placeholder='False'
                            selection
                            search
                            options={this.state.trueFalseOptions}
                            onChange={this.handleIsAnnual}
                          />}
                          
                        </Table.Cell>
                      </Table.Row>
                      
                      <Table.Row>
                        <Table.Cell width={2}>
                          Number of Years
                        </Table.Cell>
                        <Table.Cell>
                          <input id ='input' defaultValue={this.state.number_of_years}
                           type='number' onChange={this.handleNumberOfYears}/>
                        </Table.Cell>
                      </Table.Row>
            
                  <Table.Row>
                    <Table.Cell>IEC Attachment</Table.Cell>
                    <Table.Cell>
                      {
                      this.state.hasAttachment ? this.state.no_attachment_warning:
                      <button id="" className="attachmentBtn" 
                      onClick={this.downloadIecAttachment}>
                        Download Attachment
                      </button>
                      
                   
                      // <React.Fragment>                        
                      //   {this.state.iec_attachment_name}

                      //   <button id="" className="attachmentBtn" onClick={this.downloadFile}>
                      //     Download Attachment
                      //   </button>
                      // </React.Fragment>
                      
                      
                      }
                      <button id="" className="attachmentBtn" 
                      onClick={this.showUploadFile}>
                        Upload Attachment
                      </button>
                      <input className='input' type="file" id="uploadFile"
                        onChange={this.handleUploadFile}/>

                    </Table.Cell>
                  </Table.Row>
</Table.Body>
              </Table>
                  <button id="submitNew" onClick={this.iecEditId}>
              Update
            </button>
            <button id="submitNew" onClick={this.iecDeleteId}>
              Delete
            </button>
            <button id="submitNew" onClick={this.cancelId}>
              Cancel
            </button>


                
            </Form>
          </div>
        )}

        <div id="add_iec">
          <Form>
            <Table definition>
              <Table.Body>
                {/* <Table.Raw>  
                  <Table.Cell>IEC Date</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      type="text"
                      defaultValue={this.state.iec_date}
                      onChange={this.handleIecDate}
                    />
                  </Table.Cell>
                </Table.Raw>
    <Table.Row>
                  {/* <Table.Cell width={2}>Technologies</Table.Cell>
                {/* <Table.Cell>{this.state.technologyText}</Table.Cell>
                </Table.Row>
                
  */}
              </Table.Body>
            </Table>

            <h1 className="iecItemsHeader">Details:</h1>
            {this.createIecDepTypes()}

            
          </Form>
        </div>
      </div>
    );
  }
}


export default IecEdit;
