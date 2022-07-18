import React, {useState, useEffect} from 'react';
import { Header, Image, Button, Form, Divider, Icon, Table, Segment, Dimmer, Loader} from 'semantic-ui-react'
import $ from 'jquery';
//import '../StyleSheets/App.css';


const IntegrateSitesExcel = (props) =>{
    let [fileUpload,setFile] = useState(null);
    let [fileUploadConfirm,setFileUploadConfirm] = useState(false);
    let [fileUploadFail,setFileUploadFail] = useState(false);
    let [fileReady,setFileReady] = useState(false);
    let [loading,setLoading] = useState(false);
    

    const handleFile = async (event) => {
        setFile(event.target.files[0])
        setFileReady(true)
    }

    const resetFile = async () => {
        setFile(null)
        setFileReady(false)
        setFileUploadConfirm(false);
        setFileUploadFail(false)
    }

    const handleCompute = () => {
        setLoading(true);
        var data1 = new FormData();
        data1.append('file', fileUpload);
        data1.append('filename', 'Site Integration Template');
        const secondFunction = async () => {
            const result = await props.refreshToken()
            
            // do something else here after firstFunction completes
            let anchor = document.createElement("a");
            document.body.appendChild(anchor);
            let file = `http://localhost:8000/api/excel-sites-integrations/${props.userId}`;

            let headers = new Headers();
            headers.append('Authorization', 'Bearer '+ sessionStorage.getItem("access_token"));

            try{
              fetch(file, {method: 'POST', headers , body: data1})
              .then(response => response.blob())
              .then(blobby => {
                  let objectUrl = window.URL.createObjectURL(blobby);
                  setFileUploadConfirm(true);
                  setLoading(false);
                  anchor.href = objectUrl;
                  anchor.download = 'Site Integration Result.xlsx';
                  anchor.click();

                  window.URL.revokeObjectURL(objectUrl);
                  props.refreshSites();
              }, (error)=>{
                setFileUploadFail(true);
                setLoading(false);
                props.refreshSites();
              });
            }
            catch (error){
              setFileUploadFail(true);
              setLoading(false);
              props.refreshSites();
            }
            
        }
        secondFunction();
    }

    useEffect(() =>{
        if (fileReady){
            document.getElementById('fileReadyButtons').hidden = false;
        }else{
            document.getElementById('fileReadyButtons').hidden = true;
        }
    },[fileUpload])
    
    const fileReport = ()=>{
        //if (file=== null || typeof(file) === undefined){
        if(fileUploadConfirm){
            return(<div> File Uploaded <Icon name='check' /> </div>)    
        } else{
            return(<div></div>)
        }
    }

    const fileReportFail = (file)=>{
      //if (file=== null || typeof(file) === undefined){
      if(fileUploadFail){
          return(<div> File Upload Failed <Icon name='x' /> </div>)    
      } else{
          return(<div></div>)
      }
  }
    
    const LoaderExampleText = () => {
      if (loading){
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

    return (
        <div className="box">

            <Form>
                <Divider horizontal>
                    <Header as='h4'>
                        <Icon name='upload' />
                        Site Integration - Excel
                    </Header>
                  </Divider>
                  <Table definition>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>
                            <Header >UPLOAD YOUR FILE:</Header>
                            <input className='input' type="file" id="myfile" onChange={handleFile}/>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                            {fileReport()}
                            {fileReportFail()}
                            {LoaderExampleText()}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                </Table>
                <div id='fileReadyButtons' style={{margin:"20px"}}>
                  <Button.Group widths='1'>
                    <Button id='calendar_button1' size='mini' color='red' onClick={handleCompute}> Compute </Button>
                    <Button id='calendar_button1' size='mini' color='red' onClick={resetFile}> RESET </Button>
                  </Button.Group>
                </div>
            </Form>
            <Divider horizontal/>
        </div>
    )
}
export default IntegrateSitesExcel;