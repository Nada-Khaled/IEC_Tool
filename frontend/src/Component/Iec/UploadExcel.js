import React, {useState, useEffect} from 'react';
import { Header, Image, Button, Form, Divider, Icon, Table, Segment, Dimmer, Loader} from 'semantic-ui-react'
import $ from 'jquery';
//import '../StyleSheets/App.css';
import '../../config';
import {
  useHistory
} from 'react-router-dom';


export const UploadExcel = (props) =>{
  let history = useHistory();

    let [fileUpload,setFile] = useState(null);
    let [fileUploadConfirm,setFileUploadConfirm] = useState(false);
    let [fileUploadFail,setFileUploadFail] = useState(false);
    let [fileReady,setFileReady] = useState(false);
    let [loading,setLoading] = useState(false);

    useEffect(() =>{

      console.log("in UploadExcel functional component")
      if (fileReady){
          document.getElementById('fileReadyButtons').hidden = false;
      }else{
          document.getElementById('fileReadyButtons').hidden = true;
      }
    },[fileUpload])
  
    

    const handleFile = async (event) => {
        setFile(event.target.files[0])
        setFileReady(true)
    }

    const removeFile = async () => {
        setFile(null)
        setFileReady(false)
        setFileUploadConfirm(false);
        setFileUploadFail(false)
    }

    const uploadFile = () => {
        setLoading(true);
        var data1 = new FormData();
        data1.append('file', fileUpload);
        data1.append('filename', fileUpload.name);
        const secondFunction = async () => {
            const result = await props.refreshToken()
            
            let anchor = document.createElement("a");
            document.body.appendChild(anchor);
            let file = global.config.BACKEND_IP + `/api-iec/excel-iecs-addition/${fileUpload.name}`;

            let headers = new Headers();
            headers.append('Authorization', 'Bearer '+ sessionStorage.getItem("access_token"));

            try{
              fetch(file, {method: 'POST', headers , body: data1})
              .then(response => response.blob())
              .then(blobby => {

                console.log('In Upload Excel After fetch')
                console.log(typeof(blobby))
                console.log(blobby)

                  let objectUrl = window.URL.createObjectURL(blobby);
                  setFileUploadConfirm(true);
                  setLoading(false);
                  anchor.href = objectUrl;
                  anchor.download = fileUpload.name;//+'.xlsx';
                  anchor.click();

                  window.URL.revokeObjectURL(objectUrl);
                  // props.refreshIECs();
          history.push('/iec')


                console.log("DONE UPLOADING YOUR FILE")


              }, (error)=>{
                alert('ERROR UPLOADING FILE')
                setFileUploadFail(true);
                setLoading(false);
                // props.refreshIECs();
          history.push('/iec')

              }
              );
            }
            catch (error){
              setFileUploadFail(true);
              setLoading(false);
              // props.refreshIECs();
          history.push('/iec')

            }
            
        }
        secondFunction();
    }

   
    const fileReport = ()=>{
        //if (file=== null || typeof(file) === undefined){
        if(fileUploadConfirm){
            return(<div> File Uploaded <Icon name='check' /> </div>)    
        } else{
            return(<div></div>)
        }
    }

    const fileReportFail = ()=>{
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
                        IEC Excel Addition
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
                    <Button id='calendar_button1' size='mini' color='red' onClick={uploadFile}> Upload </Button>
                    <Button id='calendar_button1' size='mini' color='red' onClick={removeFile}> Remove File </Button>
                  </Button.Group>
                </div>
            </Form>
            <Divider horizontal/>
        </div>

        // <div><button onClick={()=>{
        //   console.log("props.showUploadForm before")
        //   console.log(props.showUploadForm)
        //   props.showUploadForm = false;
        //   console.log("props.showUploadForm after")
        //   console.log(props.showUploadForm)
        // }}>Click here</button></div>
    )
}
// export default UploadExcel;
