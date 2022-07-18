import React, { PureComponent } from 'react';
import { Header, Image, Form, Table, Dropdown, Button, Divider} from 'semantic-ui-react'
import MyChart from './MyChart';
import MyChartVPTotal from './MyChartVPTotal';

import project_icon from '../../media/project.png';
import '../../StyleSheets/dashboard.css';
import $ from 'jquery';

class Dashboard extends PureComponent {
  constructor(props){
    super(...arguments);

  console.log("ANA F EL DASHBOARD");

    this.state = {
      projectOptions:[],

      projectId:0,
      projectName: '',
      budgetYear:0,
      
      vendorOptions:[],
      vendorID:0,
      vendorName:'',
      
      technologyOptions:[],
      
      /////
      values:[],
      technologyIds:[],
      technologyNames: [],
      ////
      isVisitPriceTechnologyDependent: "No",
      isVisitPriceTechnologyDependentOptions:[
        {
          key: 'No',
          text: 'No',
          value: 'No'
        },
        {
          key: 'Yes',
          text: 'Yes',
          value: 'Yes'
        }
      ],
      visitPriceNoTech: 0,
      visitPrices:[],
      totalPrices: [],
      //////////
      isTargetTechnologyDependent: "No",
      isTargetTechnologyDependentOptions:[
        {
          key: 'No',
          text: 'No',
          value: 'No'
        },
        {
          key: 'Yes',
          text: 'Yes',
          value: 'Yes'
        }
      ],
      targetNoTechMonths: 0,
      targetNoTechAreas: 0,
      targetsMonths:[],
      targetsAreas:[]
    }
    
  }

  componentDidMount(){
    document.getElementById('dashboard_id').hidden = true;
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      
      $.ajax({
        url: `/api-iec/projects`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        success: (result) => {
          this.setState({ projectOptions: result.projects})
          return;
        },
        error: (error) => {
          alert('Unable to load projects. Please try your request again')
          return;
        }
      })
    }
    secondFunction();
  }

  handleProject = (event, {value}) => {
    document.getElementById('dashboard_id').hidden = false;
    const secondFunction = async () => {
      const result = await this.props.refreshToken()
      // do something else here after firstFunction completes
      
      $.ajax({
        url: `/api-iec/vendors`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        success: (result) => {
          this.setState({ vendorOptions: result.vendors })
          return;
        },
        error: (error) => {
          alert('Unable to load vendors. Please try your request again')
          return;
        }
      })

      $.ajax({
        url: `/api-iec/technologies`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        success: (result) => {
          this.setState({ technologyOptions: result.technologies })
          return;
        },
        error: (error) => {
          alert('Unable to load vendors. Please try your request again')
          return;
        }
      })

      $.ajax({
          url: `/api-iec/projects/${value}/dashboard`, //TODO: update request URL
          type: "GET",
          beforeSend: function (xhr) {   //Include the bearer token in header
            xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
          },
          success: (result) => {
            this.setState({
              projectId: result.project.id,
              projectName: result.project.project_name,
              budgetYear: result.project.budget_year,
              vendorID:result.project.vendor.id,
              vendorName:result.project.vendor.text,
              
              values: result.project.values,
              technologyIds: result.project.technology_ids,
              technologyNames: result.project.technology_names,
              
              isVisitPriceTechnologyDependent: result.project.is_visit_price_technology_dependent,           
              visitPriceNoTech: result.project.visit_price_no_tech,
              visitPrices: result.project.visit_prices,
              totalPrices: result.project.total_prices,
              
              isTargetTechnologyDependent: result.project.is_target_technology_dependent,           
              targetNoTechMonths: result.project.target_no_tech_month,
              targetNoTechAreas: result.project.target_no_tech_area,
              
              targetsMonths: result.project.targets_months,
              targetsAreas: result.project.targets_areas
              
            })
            return;
          },
          error: (error) => {
            alert('Unable to load project to edit. Please try your request again')
            return;
          }
        })
    }
    secondFunction();
  }


  handleProjectName = (event) => {
    this.setState({projectName: event.target.value})
  }
  
  handleBudgetYear = (event) => {
    this.setState({budgetYear: event.target.value})
  }

  /*handleTarget = (event) => {
    this.setState({target: event.target.value})
  }*/

  handleChangeVendor = (event, {value}) =>{
    // eslint-disable-next-line
    this.setState({
        vendorID: value
      })
   }

  handleIsVPTechnologyDependent = (event, {value}) =>{
    //console.log("IsTechDep=",value)
    if(value==='Yes'){
      if (this.state.values <1){
        this.setState({
          isVisitPriceTechnologyDependent: value,
          values: [""]
        })
      } else {
        this.setState({
          isVisitPriceTechnologyDependent: value
        })
      }
      
    }else{
       this.setState({
        isVisitPriceTechnologyDependent: value
      })
    }
   }

   handleIsTargetTechnologyDependent = (event, {value}) =>{
    //console.log("IsTechDep=",value)
    if(value==='Yes'){
      if (this.state.values <1){
        this.setState({
          isTargetTechnologyDependent: value,
          values: [""]
        })
      } else {
        this.setState({
          isTargetTechnologyDependent: value
        })
      }
      
    }else{
       this.setState({
        isTargetTechnologyDependent: value
      })
    }
   }

  
  //Visit Price if technology ignostic
  handleVisitPriceNoTech = (event) => {
    this.setState({ 
      visitPriceNoTech: event.target.value
      });
  }

  //Target if technology ignostic
  handleTargetNoTech = (event) => {
    this.setState({ 
      targetNoTech: event.target.value
      });
  }

  createVPTechIgnostic(){
    return (
      <div >
          <Divider hidden/>
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={3}>
                  Visit Price (Tech-Ignostic)
                </Table.Cell>
                <Table.Cell>
                  <input id ='input' type='number' value={this.state.visitPriceNoTech} onChange={this.handleVisitPriceNoTech.bind(this)}/>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
    ) 
  }

  createTargetTechIgnostic(){
    return (
      <div >
          <Divider hidden/>
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell textAlign='center'>
                  <MyChart el={'ch_tntm'} x={'Month'} data={this.state.targetNoTechMonths} title='Target per Month'/>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell textAlign='center'>
                  <MyChart el={'ch_tnta'} x={'Area'}data={this.state.targetNoTechAreas} title='Target per Area'/>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
    ) 
  }

  
  
  
  handleTechnology = (i,event, {value}) => {
    let technologyIds = [...this.state.technologyIds];
    technologyIds[i] = value;
    this.setState({
      technologyIds: technologyIds
    });
  }


  handleVisitPrices = (i, event) => {
    let d = [...this.state.visitPrices];
    d[i] = event.target.value;
    this.setState({
      visitPrices: d
    });
  }

  handleTargets = (i, event) => {
    let d = [...this.state.targets];
    d[i] = event.target.value;
    this.setState({
      targets: d
    });
  }


  createVPTechDependent(){
    return this.state.values.map((el, i) => 
        <div key={i}>
          <Divider hidden/>
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={3}>
                  Technology
                </Table.Cell>
                <Table.Cell>
                  <Dropdown
                    text={this.state.technologyNames[i]}
                    selection
                    options={this.state.technologyOptions}
                    onChange={this.handleTechnology.bind(this,i)}
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell width={3}>
                  Visit Price
                </Table.Cell>
                <Table.Cell>
                  <input id ='input' type='number' value={this.state.visitPrices[i]} onChange={this.handleVisitPrices.bind(this,i)}/>
                </Table.Cell>
              </Table.Row>
              
            </Table.Body>
          </Table>
        </div>          
    )
  }

  createTargetTechDependent(){
    return this.state.values.map((el, i) => {
      console.log(i)
      return(
        <div key={i}>
          <Divider hidden/>
          <Header as='h2'>
            {this.state.technologyNames[i]}
          </Header>
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <MyChart el={i+'mo'} x={'Month'} data={this.state.targetsMonths[i]} title={this.state.technologyNames[i] +' - Target per Month'}/>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <MyChart el={i+'ar'} x={'Area'} data={this.state.targetsAreas[i]} title={this.state.technologyNames[i] +' - Target per Area'}/>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          
        </div>  )        
        }
    )
  }

  createVPTargetTechDependent(){
    return this.state.values.map((el, i) => 
        <div key={i}>
          <Divider hidden/>
          <Header as='h2'>
            {this.state.technologyNames[i]}
          </Header>
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <MyChart el={i+'mo'} x={'Month'} data={this.state.targetsMonths[i]} title={this.state.technologyNames[i] +' - Target per Month'}/>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <MyChart el={i+'ar'} x={'Area'} data={this.state.targetsAreas[i]} title={this.state.technologyNames[i] +' - Target per Area'}/>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={3}>
                  Visit Price
                </Table.Cell>
                <Table.Cell>
                  <input id ='input' type='number' value={this.state.visitPrices[i]} onChange={this.handleVisitPrices.bind(this,i)}/>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>          
    )
  }

  viewTargetAreaTech = (i, event)=>{
    event.preventDefault();
    this.props.history.push(`/projects/${this.state.projectId}/technologies/${this.state.technologyIds[i]}/targets`);
  }

  viewTargetArea = (event)=>{
    event.preventDefault();
    this.props.history.push(`/projects/${this.state.projectId}/targets`);
  }

  handleTargets = (i, event) => {
    let d = [...this.state.targets];
    d[i] = event.target.value;
    this.setState({
      targets: d
    });
  }

  createVPTotalChart(){
    return (
      <div >
          <Divider hidden/>
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell textAlign='center'>
                  <MyChartVPTotal el={'ch_vpt'} x={'Sites'} data={this.state.totalPrices} title='Total Estimated Price'/>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
    ) 
  }

  testChart(){
    return (
      <div >
          <Divider hidden/>
          <Header as='h2'>
                    Weeky Progress
                </Header>
          <Divider hidden/>
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell textAlign='center' width={1}>
                  Week 5
                </Table.Cell>
                <Table.Cell textAlign='center'width={1}>
                  Week 6
                </Table.Cell>
                <Table.Cell textAlign='center'width={1}>
                  Week 7
                </Table.Cell>
                <Table.Cell textAlign='center'width={1}>
                  Week 8
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell textAlign='center' width={1}>
                  <MyChartVPTotal el={'test1'} x={'Sites'} data={this.state.totalPrices} title=''/>
                </Table.Cell>
                <Table.Cell textAlign='center'width={1}>
                  <MyChartVPTotal el={'test2'} x={'Sites'} data={this.state.totalPrices} title=''/>
                </Table.Cell>
                <Table.Cell textAlign='center'width={1}>
                  <MyChartVPTotal el={'test3'} x={'Sites'} data={this.state.totalPrices} title=''/>
                </Table.Cell>
                <Table.Cell textAlign='center'width={1}>
                  <MyChartVPTotal el={'test4'} x={'Sites'} data={this.state.totalPrices} title=''/>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell textAlign='center' width={1}>
                  <Button id='calendar_button1' size='large' color='red' > Capture </Button>
                </Table.Cell>
                <Table.Cell textAlign='center'width={1}>
                <Button id='calendar_button1' size='large' color='red' > Capture </Button>
                </Table.Cell>
                <Table.Cell textAlign='center'width={1}>
                <Button id='calendar_button1' size='large' color='red' > Capture </Button>
                </Table.Cell>
                <Table.Cell textAlign='center'width={1}>
                  <Button id='calendar_button1' size='large' color='red' > Capture </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
    ) 
  }


  render() {
  console.log("In Dashboard Class, this.state.data:")
  console.log(this.state.data)
    return <div>
                <div></div>
                <Header as='h2'>
                    <Image circular src={project_icon} /> Project Dashboard
                </Header>

                <div id='project_choose'>
                  <Form>
                    <Table definition>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell width={3}>
                            Choose Project
                          </Table.Cell>
                          <Table.Cell>
                            <Dropdown
                                placeholder='Choose Project'
                                selection
                                search
                                options={this.state.projectOptions}
                                onChange={this.handleProject}
                              />
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </Form>
                </div>
                <div id = "dashboard_id">
                  <Form>
                    <Table definition>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell width={3}>
                            Project Name
                          </Table.Cell>
                          <Table.Cell>
                            <input id ='input' defaultValue={this.state.projectName} onChange={this.handleProjectName}/>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell width={3}>
                            Budget Year
                          </Table.Cell>
                          <Table.Cell>
                            <input id ='input' type='number' value={this.state.budgetYear} onChange={this.handleBudgetYear}/>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                        <Table.Cell width={3}>
                          Vendor
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            text={this.state.vendorName}
                            selection
                            options={this.state.vendorOptions}
                            onChange={this.handleChangeVendor}
                          />
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  
                  <Header as='h2'>
                    Target & Visit Prices Vs. Technology
                  </Header>
                  <Table>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell> {/*width={3} */}
                          Do Targets depend on Technologies?
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            text={this.state.isTargetTechnologyDependent}
                            selection
                            options={this.state.isTargetTechnologyDependentOptions}
                            onChange={this.handleIsTargetTechnologyDependent}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          Do Visit Prices depend on Technologies?
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            text={this.state.isVisitPriceTechnologyDependent}
                            selection
                            options={this.state.isVisitPriceTechnologyDependentOptions}
                            onChange={this.handleIsVPTechnologyDependent}
                          />
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  <Header as='h2'>
                    Details
                  </Header>
                  {(this.state.isVisitPriceTechnologyDependent ==='Yes' && this.state.isTargetTechnologyDependent ==='Yes') ? this.createVPTargetTechDependent() :<div></div>}
                  {(this.state.isVisitPriceTechnologyDependent ==='Yes' && this.state.isTargetTechnologyDependent ==='No') ? this.createTargetTechIgnostic() :<div></div> }
                  {(this.state.isVisitPriceTechnologyDependent ==='Yes' && this.state.isTargetTechnologyDependent ==='No') ? this.createVPTechDependent() :<div></div> }
                  {(this.state.isVisitPriceTechnologyDependent ==='No' && this.state.isTargetTechnologyDependent ==='Yes') ? this.createVPTechIgnostic(): <div></div>}
                  {(this.state.isVisitPriceTechnologyDependent ==='No' && this.state.isTargetTechnologyDependent ==='Yes') ? this.createTargetTechDependent(): <div></div>}
                  {(this.state.isVisitPriceTechnologyDependent ==='No' && this.state.isTargetTechnologyDependent ==='No') ? this.createTargetTechIgnostic() : <div></div>}
                  {(this.state.isVisitPriceTechnologyDependent ==='No' && this.state.isTargetTechnologyDependent ==='No') ? this.createVPTechIgnostic() : <div></div>}
                  {this.createVPTotalChart()}
                  {this.testChart()}
                  </Form>
                </div>
                
           </div>
  }
  
}


export default Dashboard;
