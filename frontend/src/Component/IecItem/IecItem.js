import React, { Component } from 'react';
import { Header, Image, Button, Form, Divider, Icon, Table, Dropdown} from 'semantic-ui-react'
import {BasicTable} from './BasicTable';
import project_icon from '../../media/project.png';
import '../../StyleSheets/project.css';
import $ from 'jquery';

//! NEED TO BE MODIFIED WITH IecItem DATA and APIs
class IecItem extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      iecItems: [],
      projectName: "",
      budgetYear: 0,

      yearOptions: [],
      yearNew: 0,

      vendorOptions: [],
      vendorNew: 0,

      technologyOptions: [],

      values: [],
      technologyIds: [],

      isVisitPriceTechnologyDependent: "No",
      isVisitPriceTechnologyDependentOptions: [
        {
          key: "No",
          text: "No",
          value: "No",
        },
        {
          key: "Yes",
          text: "Yes",
          value: "Yes",
        },
      ],
      visitPriceNoTech: 0,
      visitPrices: [],

      isTargetTechnologyDependent: "No",
      isTargetTechnologyDependentOptions: [
        {
          key: "No",
          text: "No",
          value: "No",
        },
        {
          key: "Yes",
          text: "Yes",
          value: "Yes",
        },
      ],
      targetNoTech: 0,
      targets: [],

      lastYear: 0,
    };
  }

  componentDidMount() {
    document.getElementById("add_project").hidden = true;
    const secondFunction = async () => {
      const result = await this.props.refreshToken();

      // load all iecItems once component is loaded
      $.ajax({
        url: `/api-iec/vendors`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {
          //Include the bearer token in header
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " + sessionStorage.getItem("access_token")
          );
        },
        success: (result) => {
          this.setState({ vendorOptions: result.vendors });
          return;
        },
        error: (error) => {
          alert("Unable to load vendors. Please try your request again");
          return;
        },
      });      
    };
    secondFunction();
  }

  new_project = () => {
    if (document.getElementById("add_project").hidden) {
      document.getElementById("add_project").hidden = false;
      document.getElementById("add_project").scrollIntoView();
    } else {
      document.getElementById("add_project").hidden = true;
      document.getElementById("table1").scrollIntoView();
    }
  };

  addProject = (event) => {
    event.preventDefault();
    if (this.state.projectName === "") {
      alert("please add a project name");
    }
    if (this.state.budgetYear === 0) {
      alert("please add a budget year");
    } else if (this.state.vendorNew === 0) {
      alert("Choose a vendor");
    } else if (
      this.state.isVisitPriceTechnologyDependent === "Yes" &&
      this.state.technologyIds.length === 0
    ) {
      alert("please enter the technologies available with their price");
    } else if (
      this.state.isVisitPriceTechnologyDependent === "Yes" &&
      this.state.visitPrices.length === 0
    ) {
      alert("please enter the technologies available with their price");
    } else if (
      this.state.isTargetTechnologyDependent === "Yes" &&
      this.state.technologyIds.length === 0
    ) {
      alert("please enter the technologies available with their target");
    } else if (
      this.state.isTargetTechnologyDependent === "Yes" &&
      this.state.targets.length === 0
    ) {
      alert("please enter the technologies available with their target");
    } else {
      const secondFunction = async () => {
        const result = await this.props.refreshToken();
        // do something else here after firstFunction completes

        $.ajax({
          url: `/api-iec/projects`, //TODO: update request URL
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
            project_name: this.state.projectName,
            budget_year: this.state.budgetYear,
            vendor_new: this.state.vendorNew,

            values: this.state.values,
            technology_ids: this.state.technologyIds,

            is_visit_price_technology_dependent:
              this.state.isVisitPriceTechnologyDependent,
            visit_price_no_tech: this.state.visitPriceNoTech,
            visit_prices: this.state.visitPrices,

            is_target_technology_dependent:
              this.state.isTargetTechnologyDependent,
            target_no_tech: this.state.targetNoTech,
            targets: this.state.targets,
          }),
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          success: (result) => {
            $.ajax({
              url: `/api-iec/projects`, //TODO: update request URL
              type: "GET",
              beforeSend: function (xhr) {
                //Include the bearer token in header
                xhr.setRequestHeader(
                  "Authorization",
                  "Bearer " + sessionStorage.getItem("access_token")
                );
              },
              success: (result) => {
                this.setState({ projects: result.projects }, async () => {
                  document.getElementById("add_project").hidden = true;
                  document.getElementById("table1").scrollIntoView();
                });
                return;
              },
              error: (error) => {
                alert("Unable to load projects. Please try your request again");
                return;
              },
            });
            return;
          },
          error: (error) => {
            alert(
              "Unable to add the new project. Please try your request again"
            );
            return;
          },
        });
      };
      secondFunction();
    }
  };

  handleProjectName = (event) => {
    this.setState({ projectName: event.target.value });
  };

  handleBudgetYear = (event) => {
    this.setState({ budgetYear: event.target.value });
  };

  handleChangeVendor = (event, { value }) => {
    // eslint-disable-next-line
    this.setState({
      vendorNew: value,
    });
  };

  handleIsVPTechnologyDependent = (event, { value }) => {
    //console.log("IsTechDep=",value)
    if (value === "Yes") {
      if (this.state.values < 1) {
        this.setState({
          isVisitPriceTechnologyDependent: value,
          values: [""],
        });
      } else {
        this.setState({
          isVisitPriceTechnologyDependent: value,
        });
      }
    } else {
      this.setState({
        isVisitPriceTechnologyDependent: value,
      });
    }
  };

  handleIsTargetTechnologyDependent = (event, { value }) => {
    //console.log("IsTechDep=",value)
    if (value === "Yes") {
      if (this.state.values < 1) {
        this.setState({
          isTargetTechnologyDependent: value,
          values: [""],
        });
      } else {
        this.setState({
          isTargetTechnologyDependent: value,
        });
      }
    } else {
      this.setState({
        isTargetTechnologyDependent: value,
      });
    }
  };

  //Visit Price if technology ignostic
  handleVisitPriceNoTech = (event) => {
    this.setState({
      visitPriceNoTech: event.target.value,
    });
  };

  //Target if technology ignostic
  handleTargetNoTech = (event) => {
    this.setState({
      targetNoTech: event.target.value,
    });
  };

  createVPTechIgnostic() {
    return (
      <div>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3}>Visit Price (Tech-Ignostic)</Table.Cell>
              <Table.Cell>
                <input
                  id="input"
                  type="number"
                  value={this.state.visitPriceNoTech}
                  onChange={this.handleVisitPriceNoTech.bind(this)}
                />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }

  createTargetTechIgnostic() {
    return (
      <div>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3}>Target (Tech-Ignostic)</Table.Cell>
              <Table.Cell>
                <input
                  id="input"
                  type="number"
                  value={this.state.targetNoTech}
                  onChange={this.handleTargetNoTech.bind(this)}
                />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }

  //adding dependent tech

  addClick() {
    this.setState((prevState) => ({ values: [...prevState.values, ""] }));
  }

  removeClick(i) {
    let values = [...this.state.values];
    values.splice(i, 1);

    let c = [...this.state.technologyIds];
    c.splice(i, 1);

    let d = [...this.state.visitPrices];
    d.splice(i, 1);

    this.setState({ values, technologyIds: c, visitPrices: d });
  }

  handleTechnology = (i, event, { value }) => {
    let technologyIds = [...this.state.technologyIds];
    technologyIds[i] = value;
    this.setState({
      technologyIds: technologyIds,
    });
  };

  handleVisitPrices = (i, event) => {
    let d = [...this.state.visitPrices];
    d[i] = event.target.value;
    this.setState({
      visitPrices: d,
    });
  };

  handleTargets = (i, event) => {
    let d = [...this.state.targets];
    d[i] = event.target.value;
    this.setState({
      targets: d,
    });
  };

  createVPTechDependent() {
    return this.state.values.map((el, i) => (
      <div key={i}>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3}>Technology</Table.Cell>
              <Table.Cell>
                <Dropdown
                  placeholder="Choose technology"
                  selection
                  options={this.state.technologyOptions}
                  onChange={this.handleTechnology.bind(this, i)}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={3}>Visit Price</Table.Cell>
              <Table.Cell>
                <input
                  id="input"
                  type="number"
                  value={this.state.visitPrices[i]}
                  onChange={this.handleVisitPrices.bind(this, i)}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={2} textAlign="center"></Table.Cell>
              <Table.Cell textAlign="center">
                {this.state.values.length === 1 ? (
                  <Button
                    id="add"
                    circular
                    icon="add"
                    onClick={this.addClick.bind(this)}
                  />
                ) : (
                  <React.Fragment>
                    <Button
                      id="remove"
                      circular
                      icon="circular remove"
                      onClick={this.removeClick.bind(this, i)}
                    />
                    <Button
                      id="add"
                      circular
                      icon="add"
                      onClick={this.addClick.bind(this)}
                    />
                  </React.Fragment>
                )}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    ));
  }

  createTargetTechDependent() {
    return this.state.values.map((el, i) => (
      <div key={i}>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3}>Technology</Table.Cell>
              <Table.Cell>
                <Dropdown
                  placeholder="Choose technology"
                  selection
                  options={this.state.technologyOptions}
                  onChange={this.handleTechnology.bind(this, i)}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={3}>Target</Table.Cell>
              <Table.Cell>
                <input
                  id="input"
                  type="number"
                  value={this.state.targets[i]}
                  onChange={this.handleTargets.bind(this, i)}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={2} textAlign="center"></Table.Cell>
              <Table.Cell textAlign="center">
                {this.state.values.length === 1 ? (
                  <Button
                    id="add"
                    circular
                    icon="add"
                    onClick={this.addClick.bind(this)}
                  />
                ) : (
                  <React.Fragment>
                    <Button
                      id="remove"
                      circular
                      icon="circular remove"
                      onClick={this.removeClick.bind(this, i)}
                    />
                    <Button
                      id="add"
                      circular
                      icon="add"
                      onClick={this.addClick.bind(this)}
                    />
                  </React.Fragment>
                )}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    ));
  }

  createVPTargetTechDependent() {
    return this.state.values.map((el, i) => (
      <div key={i}>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3}>Technology</Table.Cell>
              <Table.Cell>
                <Dropdown
                  placeholder="Choose technology"
                  selection
                  options={this.state.technologyOptions}
                  onChange={this.handleTechnology.bind(this, i)}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={3}>Target</Table.Cell>
              <Table.Cell>
                <input
                  id="input"
                  type="number"
                  value={this.state.targets[i]}
                  onChange={this.handleTargets.bind(this, i)}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={3}>Visit Price</Table.Cell>
              <Table.Cell>
                <input
                  id="input"
                  type="number"
                  value={this.state.visitPrices[i]}
                  onChange={this.handleVisitPrices.bind(this, i)}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={2} textAlign="center"></Table.Cell>
              <Table.Cell textAlign="center">
                {this.state.values.length === 1 ? (
                  <Button
                    id="add"
                    circular
                    icon="add"
                    onClick={this.addClick.bind(this)}
                  />
                ) : (
                  <React.Fragment>
                    <Button
                      id="remove"
                      circular
                      icon="circular remove"
                      onClick={this.removeClick.bind(this, i)}
                    />
                    <Button
                      id="add"
                      circular
                      icon="add"
                      onClick={this.addClick.bind(this)}
                    />
                  </React.Fragment>
                )}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    ));
  }

  render() {
    return (
      <div>
        <div></div>
        <Header as="h2">
          <Image circular src={project_icon} /> Projects
        </Header>
        <div style={{ margin: "20px" }}>
          <Button.Group widths="1">
            <Button
              id="calendar_button1"
              size="mini"
              color="red"
              onClick={this.new_project}
            >
              {" "}
              Add a new Project{" "}
            </Button>
            <Button
              id="calendar_button1"
              size="mini"
              color="red"
              onClick={this.copyProjectLastYear}
            >
              {" "}
              Copy Projects of Y{this.state.lastYear} to Y
              {this.state.lastYear + 1}{" "}
            </Button>
          </Button.Group>
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell textAlign="right" width={1}>
                  Choose a Year
                </Table.Cell>
                <Table.Cell textAlign="left" width={1}>
                  <Dropdown
                    placeholder="Choose a Year"
                    selection
                    options={this.state.yearOptions}
                    onChange={this.handleProjectYear}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
        <div id="table1">
          <BasicTable key={this.state.projects} data={this.state.projects} />
        </div>

        <div style={{ margin: "40px" }}></div>

        <div style={{ margin: "40px" }}></div>

        <div id="add_project">
          <Form>
            <Divider horizontal>
              <Header as="h4">
                <Icon name="sign-in" />
                Project Addition
              </Header>
            </Divider>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Project Name</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      placeholder="Project Name"
                      onChange={this.handleProjectName}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>Budget Year</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      type="number"
                      placeholder="Budget Year"
                      onChange={this.handleBudgetYear}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>Vendor</Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      placeholder="Choose a Vendor"
                      selection
                      options={this.state.vendorOptions}
                      onChange={this.handleChangeVendor}
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Table>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    {" "}
                    {/*width={3} */}
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
                      options={
                        this.state.isVisitPriceTechnologyDependentOptions
                      }
                      onChange={this.handleIsVPTechnologyDependent}
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Header as="h2">Details</Header>
            {this.state.isVisitPriceTechnologyDependent === "Yes" &&
            this.state.isTargetTechnologyDependent === "Yes" ? (
              this.createVPTargetTechDependent()
            ) : (
              <div></div>
            )}
            {this.state.isVisitPriceTechnologyDependent === "Yes" &&
            this.state.isTargetTechnologyDependent === "No" ? (
              this.createTargetTechIgnostic()
            ) : (
              <div></div>
            )}
            {this.state.isVisitPriceTechnologyDependent === "Yes" &&
            this.state.isTargetTechnologyDependent === "No" ? (
              this.createVPTechDependent()
            ) : (
              <div></div>
            )}
            {this.state.isVisitPriceTechnologyDependent === "No" &&
            this.state.isTargetTechnologyDependent === "Yes" ? (
              this.createVPTechIgnostic()
            ) : (
              <div></div>
            )}
            {this.state.isVisitPriceTechnologyDependent === "No" &&
            this.state.isTargetTechnologyDependent === "Yes" ? (
              this.createTargetTechDependent()
            ) : (
              <div></div>
            )}
            {this.state.isVisitPriceTechnologyDependent === "No" &&
            this.state.isTargetTechnologyDependent === "No" ? (
              this.createTargetTechIgnostic()
            ) : (
              <div></div>
            )}
            {this.state.isVisitPriceTechnologyDependent === "No" &&
            this.state.isTargetTechnologyDependent === "No" ? (
              this.createVPTechIgnostic()
            ) : (
              <div></div>
            )}

            <button id="submitNew" onClick={this.addProject}>
              Submit
            </button>
          </Form>
        </div>
      </div>
    );
  }
}


export default IecItem;
