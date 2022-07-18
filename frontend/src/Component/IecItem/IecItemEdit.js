import React, { Component } from 'react';
import { Header, Image, Form, Table, Dropdown, Button, Divider} from 'semantic-ui-react'
import project_icon from '../../media/project.png';
import '../../StyleSheets/project.css';
import $ from 'jquery';

//! NEED TO BE MODIFIED WITH IECitem DATA and APIs
class IecItemEdit extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      projectId: 0,
      projectName: "",
      budgetYear: 0,

      vendorOptions: [],
      vendorID: 0,
      vendorName: "",

      technologyOptions: [],

      /////
      values: [],
      technologyIds: [],
      technologyNames: [],
      ////
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
      //////////
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
      receivedSitesNoTech: 0,
      integratedSitesNoTech: 0,
      signedSitesNoTech: 0,
      targets: [],
      receivedSites: [],
      integratedSites: [],
      signedSites: [],
    };
  }

  /*navTo = (uri) =>{
    window.location.href = window.location.origin + uri;
  }*/

  componentDidMount() {
    this.setState({ projectId: this.props.match.params.id }, async () => {
      const secondFunction = async () => {
        const result = await this.props.refreshToken();
        // do something else here after firstFunction completes

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

        $.ajax({
          url: `/api-iec/technologies`, //TODO: update request URL
          type: "GET",
          beforeSend: function (xhr) {
            //Include the bearer token in header
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + sessionStorage.getItem("access_token")
            );
          },
          success: (result) => {
            this.setState({ technologyOptions: result.technologies });
            return;
          },
          error: (error) => {
            alert("Unable to load vendors. Please try your request again");
            return;
          },
        });

        $.ajax({
          url: `/api-iec/projects/${this.state.projectId}`, //TODO: update request URL
          type: "GET",
          beforeSend: function (xhr) {
            //Include the bearer token in header
            xhr.setRequestHeader(
              "Authorization",
              "Bearer " + sessionStorage.getItem("access_token")
            );
          },
          success: (result) => {
            this.setState({
              projectName: result.project.project_name,
              budgetYear: result.project.budget_year,
              vendorID: result.project.vendor.id,
              vendorName: result.project.vendor.text,

              values: result.project.values,
              technologyIds: result.project.technology_ids,
              technologyNames: result.project.technology_names,

              isVisitPriceTechnologyDependent:
                result.project.is_visit_price_technology_dependent,
              visitPriceNoTech: result.project.visit_price_no_tech,
              visitPrices: result.project.visit_prices,

              isTargetTechnologyDependent:
                result.project.is_target_technology_dependent,
              targetNoTech: result.project.target_no_tech,

              receivedSitesNoTech: result.project.received_sites_no_tech,
              integratedSitesNoTech: result.project.integrated_sites_no_tech,
              signedSitesNoTech: result.project.signed_sites_no_tech,

              targets: result.project.targets,
              receivedSites: result.project.received_sites,
              integratedSites: result.project.integrated_sites,
              signedSites: result.project.signed_sites,
            });
            return;
          },
          error: (error) => {
            alert(
              "Unable to load project to edit. Please try your request again"
            );
            return;
          },
        });
      };
      secondFunction();
    });
  }

  projectDeleteId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      // do something else here after firstFunction completes

      $.ajax({
        url: `/api-iec/projects/${this.state.projectId}`, //TODO: update request URL
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
          project_name: this.state.projectName,
          budget_year: this.state.budgetYear,
          target: this.state.target,

          vendor_id: this.state.vendorID,

          is_visit_price_technology_dependent:
            this.state.isVisitPriceTechnologyDependent,
          visit_price_no_tech: this.state.visitPriceNoTech,
          values: this.state.values,
          technology_ids: this.state.technologyIds,
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
          this.props.history.push("/projects");
          return;
        },
        error: (error) => {
          $.ajax({
            url: `/api-iec/projects/${this.state.projectId}`, //TODO: update request URL
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
              project_name: this.state.projectName,
              budget_year: this.state.budgetYear,
              target: this.state.target,

              vendor_id: this.state.vendorID,

              is_visit_price_technology_dependent:
                this.state.isVisitPriceTechnologyDependent,
              visit_price_no_tech: this.state.visitPriceNoTech,
              values: this.state.values,
              technology_ids: this.state.technologyIds,
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
              this.props.history.push("/projects");
              return;
            },
            error: (error) => {
              alert(
                "Unable to delete the project. Please try your request again"
              );
              return;
            },
          });
          return;
        },
      });
    };
    secondFunction();
  };

  projectEditId = (event) => {
    event.preventDefault();
    if (this.state.projectName === "") {
      alert("please add a project name");
    }
    if (this.state.budgetYear === 0) {
      alert("please add a budget year");
    } else if (this.state.vendorID === 0) {
      alert("Choose a vendor");
    } else if (this.state.target === 0) {
      alert("please enter a target");
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
    } else {
      const secondFunction = async () => {
        const result = await this.props.refreshToken();
        // do something else here after firstFunction completes

        $.ajax({
          url: `/api-iec/projects/${this.state.projectId}`, //TODO: update request URL
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
            project_name: this.state.projectName,
            budget_year: this.state.budgetYear,
            target: this.state.target,

            vendor_id: this.state.vendorID,

            is_visit_price_technology_dependent:
              this.state.isVisitPriceTechnologyDependent,
            visit_price_no_tech: this.state.visitPriceNoTech,
            values: this.state.values,
            technology_ids: this.state.technologyIds,
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
            this.props.history.push("/projects");
            return;
          },
          error: (error) => {
            alert(
              "Unable to update the project. Please try your request again"
            );
            return;
          },
        });
      };
      secondFunction();
    }
  };

  cancelId = () => {
    this.props.history.push("/projects");
  };

  handleProjectName = (event) => {
    this.setState({ projectName: event.target.value });
  };

  handleBudgetYear = (event) => {
    this.setState({ budgetYear: event.target.value });
  };

  /*handleTarget = (event) => {
    this.setState({target: event.target.value})
  }*/

  handleChangeVendor = (event, { value }) => {
    // eslint-disable-next-line
    this.setState({
      vendorID: value,
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
        <Divider hidden />
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
        <Divider hidden />
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
            <Table.Row>
              <Table.Cell width={3}>Count of Received Sites</Table.Cell>
              <Table.Cell>{this.state.receivedSitesNoTech}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={3}>Count of Integrated Sites</Table.Cell>
              <Table.Cell>{this.state.integratedSitesNoTech}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={3}>Count of Signed Sites</Table.Cell>
              <Table.Cell>{this.state.signedSitesNoTech}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell textAlign="center">
                <Button
                  id="calendar_button1"
                  size="large"
                  color="red"
                  onClick={this.viewTargetArea.bind(this)}
                >
                  {" "}
                  View Target per Area / Month{" "}
                </Button>
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

    let e = [...this.state.technologyNames];
    e.splice(i, 1);

    let d = [...this.state.visitPrices];
    d.splice(i, 1);

    this.setState({
      values,
      technologyIds: c,
      technologyNames: e,
      visitPrices: d,
    });
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
        <Divider hidden />
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3}>Technology</Table.Cell>
              <Table.Cell>
                <Dropdown
                  text={this.state.technologyNames[i]}
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
        <Divider hidden />
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3}>Technology</Table.Cell>
              <Table.Cell>
                <Dropdown
                  text={this.state.technologyNames[i]}
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
              <Table.Cell width={3}>Count of Received Sites</Table.Cell>
              <Table.Cell>{this.state.receivedSites[i]}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={3}>Count of Integrated Sites</Table.Cell>
              <Table.Cell>{this.state.integratedSites[i]}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={3}>Count of Signed Sites</Table.Cell>
              <Table.Cell>{this.state.signedSites[i]}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell textAlign="center">
                <Button
                  id="calendar_button1"
                  size="large"
                  color="red"
                  onClick={this.viewTargetAreaTech.bind(this, i)}
                >
                  {" "}
                  View Target per Area / Month{" "}
                </Button>
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
        <Divider hidden />
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3}>Technology</Table.Cell>
              <Table.Cell>
                <Dropdown
                  text={this.state.technologyNames[i]}
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
              <Table.Cell width={3}>Count of Received Sites</Table.Cell>
              <Table.Cell>{this.state.receivedSites[i]}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={3}>Count of Integrated Sites</Table.Cell>
              <Table.Cell>{this.state.integratedSites[i]}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={3}>Count of Signed Sites</Table.Cell>
              <Table.Cell>{this.state.signedSites[i]}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell textAlign="center">
                <Button
                  id="calendar_button1"
                  size="large"
                  color="red"
                  onClick={this.viewTargetAreaTech.bind(this, i)}
                >
                  {" "}
                  View Target per Area / Month{" "}
                </Button>
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

  viewTargetAreaTech = (i, event) => {
    event.preventDefault();
    this.props.history.push(
      `/projects/${this.state.projectId}/technologies/${this.state.technologyIds[i]}/targets`
    );
  };

  viewTargetArea = (event) => {
    event.preventDefault();
    this.props.history.push(`/projects/${this.state.projectId}/targets`);
  };

  handleTargets = (i, event) => {
    let d = [...this.state.targets];
    d[i] = event.target.value;
    this.setState({
      targets: d,
    });
  };

  render() {
    return (
      <div>
        <div></div>
        <Header as="h2">
          <Image circular src={project_icon} /> Project Edit
        </Header>

        <div id="add_project">
          <Form>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Project Name</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      defaultValue={this.state.projectName}
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
                      value={this.state.budgetYear}
                      onChange={this.handleBudgetYear}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>Vendor</Table.Cell>
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

            <Header as="h2">Target & Visit Prices Vs. Technology</Header>
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

            <button id="submitNew" onClick={this.projectEditId}>
              Update
            </button>
            <button id="submitNew" onClick={this.projectDeleteId}>
              Delete
            </button>
            <button id="submitNew" onClick={this.cancelId}>
              Cancel
            </button>
          </Form>
        </div>
      </div>
    );
  }
}

export default IecItemEdit;
