import React, { Component } from 'react';
import { Header, Image, Button, Form, Divider, Icon, Table, Dropdown} from 'semantic-ui-react'
import {BasicTable} from './BasicTable';
import foreignCurrency_icon from "../../media/ForeignCurrencies.jpg";
import '../../StyleSheets/project.css';
import $ from 'jquery';

//! NEED TO BE MODIFIED WITH ForeignCurrency DATA and APIs
class ForeignCurrency extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      foreign_currencies: [],
      foreignCurrencyName: "",
      rate_to_egp: 0,

    };
  }

  componentDidMount() {

    console.log('sessionStorage.getItem("access_token")');
    console.log(sessionStorage.getItem("access_token"));


    document.getElementById("add_foreign_currencies").hidden = true;
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      // do something else here after firstFunction completes
      $.ajax({
        url: `/api-iec/foreignCurrencies`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {
          //Include the bearer token in header
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " + sessionStorage.getItem("access_token")
          );
        },
        success: (result) => {
          this.setState({ foreign_currencies: result.foreign_currencies });
          console.log("result: ", result);
          console.log("result.foreign_currencies: ", result['foreign_currencies']);
          return;
        },
        error: (error) => {
          alert(
            "Unable to load Foreign Currencies. Please try your request again"
          );
          return;
        },
      });

      
    };
    secondFunction();
  }

  new_foreign_currency = () => {
    if (document.getElementById("add_foreign_currencies").hidden) {
      document.getElementById("add_foreign_currencies").hidden = false;
      document.getElementById("add_foreign_currencies").scrollIntoView();
    } else {
      document.getElementById("add_foreign_currencies").hidden = true;
      document.getElementById("table1").scrollIntoView();
    }
  };
  

  addForeignCurrency = (event) => {
    
    event.preventDefault();
    if (this.state.foreignCurrencyName === "") {
      alert("please add a Foreign Currency name");
    }
    if (this.state.rate_to_egp === 0) {
      alert("please add rate to EGP");
    } else {
      const secondFunction = async () => {
        const result = await this.props.refreshToken();
        // do something else here after firstFunction completes

        $.ajax({
          url: `/api-iec/foreignCurrencies`, //TODO: update request URL
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
            name: this.state.foreignCurrencyName,
            rate_to_egp: this.state.rate_to_egp,
            
          }),
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          success: (result) => {
            $.ajax({
              url: `/api-iec/foreignCurrencies`, //TODO: update request URL
              type: "GET",
              beforeSend: function (xhr) {
                //Include the bearer token in header
                xhr.setRequestHeader(
                  "Authorization",
                  "Bearer " + sessionStorage.getItem("access_token")
                );
              },
              success: (result) => {
                this.setState({ foreign_currencies: result.foreign_currencies }, async () => {
                  document.getElementById(
                    "add_foreign_currencies"
                  ).hidden = true;
                  document.getElementById("table1").scrollIntoView();
                });
                return;
              },
              error: (error) => {
                alert("Unable to load foreign currencies. Please try your request again");
                return;
              },
            });
            return;
          },
          error: (error) => {
            alert(
              "Unable to add the new Foreign Currency. Please try your request again"
            );
            return;
          },
        });
      };
      secondFunction();
    }
  };

  handleForeignCurrencyName = (event) => {
    this.setState({ foreignCurrencyName: event.target.value });
  };

  handleRateToEGP = (event) => {
    this.setState({ rate_to_egp: event.target.value });
  };

  

  // //adding dependent tech

  // addClick() {
  //   this.setState((prevState) => ({ values: [...prevState.values, ""] }));
  // }

  // removeClick(i) {
  //   let values = [...this.state.values];
  //   values.splice(i, 1);

  //   let c = [...this.state.technologyIds];
  //   c.splice(i, 1);

  //   let d = [...this.state.visitPrices];
  //   d.splice(i, 1);

  //   this.setState({ values, technologyIds: c, visitPrices: d });
  // }

  // handleTechnology = (i, event, { value }) => {
  //   let technologyIds = [...this.state.technologyIds];
  //   technologyIds[i] = value;
  //   this.setState({
  //     technologyIds: technologyIds,
  //   });
  // };

  // handleVisitPrices = (i, event) => {
  //   let d = [...this.state.visitPrices];
  //   d[i] = event.target.value;
  //   this.setState({
  //     visitPrices: d,
  //   });
  // };

  // handleTargets = (i, event) => {
  //   let d = [...this.state.targets];
  //   d[i] = event.target.value;
  //   this.setState({
  //     targets: d,
  //   });
  // };

  // createVPTechDependent() {
  //   return this.state.values.map((el, i) => (
  //     <div key={i}>
  //       <Table definition>
  //         <Table.Body>
  //           <Table.Row>
  //             <Table.Cell width={3}>Technology</Table.Cell>
  //             <Table.Cell>
  //               <Dropdown
  //                 placeholder="Choose technology"
  //                 selection
  //                 options={this.state.technologyOptions}
  //                 onChange={this.handleTechnology.bind(this, i)}
  //               />
  //             </Table.Cell>
  //           </Table.Row>
  //           <Table.Row>
  //             <Table.Cell width={3}>Visit Price</Table.Cell>
  //             <Table.Cell>
  //               <input
  //                 id="input"
  //                 type="number"
  //                 value={this.state.visitPrices[i]}
  //                 onChange={this.handleVisitPrices.bind(this, i)}
  //               />
  //             </Table.Cell>
  //           </Table.Row>
  //           <Table.Row>
  //             <Table.Cell width={2} textAlign="center"></Table.Cell>
  //             <Table.Cell textAlign="center">
  //               {this.state.values.length === 1 ? (
  //                 <Button
  //                   id="add"
  //                   circular
  //                   icon="add"
  //                   onClick={this.addClick.bind(this)}
  //                 />
  //               ) : (
  //                 <React.Fragment>
  //                   <Button
  //                     id="remove"
  //                     circular
  //                     icon="circular remove"
  //                     onClick={this.removeClick.bind(this, i)}
  //                   />
  //                   <Button
  //                     id="add"
  //                     circular
  //                     icon="add"
  //                     onClick={this.addClick.bind(this)}
  //                   />
  //                 </React.Fragment>
  //               )}
  //             </Table.Cell>
  //           </Table.Row>
  //         </Table.Body>
  //       </Table>
  //     </div>
  //   ));
  // }

  // createTargetTechDependent() {
  //   return this.state.values.map((el, i) => (
  //     <div key={i}>
  //       <Table definition>
  //         <Table.Body>
  //           <Table.Row>
  //             <Table.Cell width={3}>Technology</Table.Cell>
  //             <Table.Cell>
  //               <Dropdown
  //                 placeholder="Choose technology"
  //                 selection
  //                 options={this.state.technologyOptions}
  //                 onChange={this.handleTechnology.bind(this, i)}
  //               />
  //             </Table.Cell>
  //           </Table.Row>
  //           <Table.Row>
  //             <Table.Cell width={3}>Target</Table.Cell>
  //             <Table.Cell>
  //               <input
  //                 id="input"
  //                 type="number"
  //                 value={this.state.targets[i]}
  //                 onChange={this.handleTargets.bind(this, i)}
  //               />
  //             </Table.Cell>
  //           </Table.Row>
  //           <Table.Row>
  //             <Table.Cell width={2} textAlign="center"></Table.Cell>
  //             <Table.Cell textAlign="center">
  //               {this.state.values.length === 1 ? (
  //                 <Button
  //                   id="add"
  //                   circular
  //                   icon="add"
  //                   onClick={this.addClick.bind(this)}
  //                 />
  //               ) : (
  //                 <React.Fragment>
  //                   <Button
  //                     id="remove"
  //                     circular
  //                     icon="circular remove"
  //                     onClick={this.removeClick.bind(this, i)}
  //                   />
  //                   <Button
  //                     id="add"
  //                     circular
  //                     icon="add"
  //                     onClick={this.addClick.bind(this)}
  //                   />
  //                 </React.Fragment>
  //               )}
  //             </Table.Cell>
  //           </Table.Row>
  //         </Table.Body>
  //       </Table>
  //     </div>
  //   ));
  // }

  // createVPTargetTechDependent() {
  //   return this.state.values.map((el, i) => (
  //     <div key={i}>
  //       <Table definition>
  //         <Table.Body>
  //           <Table.Row>
  //             <Table.Cell width={3}>Technology</Table.Cell>
  //             <Table.Cell>
  //               <Dropdown
  //                 placeholder="Choose technology"
  //                 selection
  //                 options={this.state.technologyOptions}
  //                 onChange={this.handleTechnology.bind(this, i)}
  //               />
  //             </Table.Cell>
  //           </Table.Row>
  //           <Table.Row>
  //             <Table.Cell width={3}>Target</Table.Cell>
  //             <Table.Cell>
  //               <input
  //                 id="input"
  //                 type="number"
  //                 value={this.state.targets[i]}
  //                 onChange={this.handleTargets.bind(this, i)}
  //               />
  //             </Table.Cell>
  //           </Table.Row>
  //           <Table.Row>
  //             <Table.Cell></Table.Cell>
  //           </Table.Row>
  //           <Table.Row>
  //             <Table.Cell width={3}>Visit Price</Table.Cell>
  //             <Table.Cell>
  //               <input
  //                 id="input"
  //                 type="number"
  //                 value={this.state.visitPrices[i]}
  //                 onChange={this.handleVisitPrices.bind(this, i)}
  //               />
  //             </Table.Cell>
  //           </Table.Row>
  //           <Table.Row>
  //             <Table.Cell width={2} textAlign="center"></Table.Cell>
  //             <Table.Cell textAlign="center">
  //               {this.state.values.length === 1 ? (
  //                 <Button
  //                   id="add"
  //                   circular
  //                   icon="add"
  //                   onClick={this.addClick.bind(this)}
  //                 />
  //               ) : (
  //                 <React.Fragment>
  //                   <Button
  //                     id="remove"
  //                     circular
  //                     icon="circular remove"
  //                     onClick={this.removeClick.bind(this, i)}
  //                   />
  //                   <Button
  //                     id="add"
  //                     circular
  //                     icon="add"
  //                     onClick={this.addClick.bind(this)}
  //                   />
  //                 </React.Fragment>
  //               )}
  //             </Table.Cell>
  //           </Table.Row>
  //         </Table.Body>
  //       </Table>
  //     </div>
  //   ));
  // }

  render() {
    return (
      <div>
        <div></div>
        <Header as="h2">
          <Image circular src={foreignCurrency_icon} /> Foreign Currencies
        </Header>
        <div style={{ margin: "20px" }}>
          <Button.Group widths="1">
            <Button
              id="calendar_button1"
              size="mini"
              color="red"
              onClick={this.new_foreign_currency}
            >
              {" "}
              Add a new Foreign Currency{" "}
            </Button>
          </Button.Group>
        </div>
        <div id="table1">
          <BasicTable key={this.state.foreign_currencies} data={this.state.foreign_currencies} />
        </div>

        <div style={{ margin: "40px" }}></div>

        <div style={{ margin: "40px" }}></div>

        <div id="add_foreign_currencies">
          <Form>
            <Divider horizontal>
              <Header as="h4">
                <Icon name="sign-in" />
                Foreign Currency Addition
              </Header>
            </Divider>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Foreign Currency Name</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      placeholder="Foreign Currency Name"
                      onChange={this.handleForeignCurrencyName}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>Rate to EGP</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      type="number"
                      placeholder="Rate to EGP"
                      onChange={this.handleRateToEGP}
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            {/* <Header as="h2">Details</Header> */}
            {/* {this.state.isVisitPriceTechnologyDependent === "Yes" &&
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
            )} */}

            <button id="submitNew" onClick={this.addForeignCurrency}>
              Submit
            </button>
          </Form>
        </div>
      </div>
    );
  }
}


export default ForeignCurrency;
