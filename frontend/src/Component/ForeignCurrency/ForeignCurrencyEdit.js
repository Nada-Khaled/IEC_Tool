import React, { Component } from 'react';
import { Header, Image, Form, Table, Dropdown, Button, Divider} from 'semantic-ui-react'
import foreignCurrency_icon from "../../media/ForeignCurrencies.jpg";
import '../../StyleSheets/project.css';
import $ from 'jquery';

class ForeignCurrencyEdit extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {

      foreignCurrencyId: 0,
      foreignCurrencyName: "",
      rate_to_egp: 0,
      foreign_currencies: [],
    };
  }

  /*navTo = (uri) =>{
    window.location.href = window.location.origin + uri;
  }*/

  componentDidMount() {
    this.setState({ foreignCurrencyId: this.props.match.params.id }, async () => {
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
            this.setState({ foreign_currencies: result["foreign_currencies"] });
            return;
          },
          error: (error) => {
            alert(
              "Unable to load Foreign Currencies. Please try your request again"
            );
            return;
          },
        });

        $.ajax({
          url: `/api-iec/foreignCurrencies/${this.state.foreignCurrencyId}`, //TODO: update request URL
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
              foreignCurrencyName: result["foreign_currencies"].name,
              rate_to_egp: result["foreign_currencies"].rate_to_egp,
            });
            return;
          },
          error: (error) => {
            alert(
              "Unable to load foreign Currency to edit. Please try your request again"
            );
            return;
          },
        });
      };
      secondFunction();
    });
  }

  currencyDeleteId = (event) => {
    event.preventDefault();
    const secondFunction = async () => {
      const result = await this.props.refreshToken();
      // do something else here after firstFunction completes

      $.ajax({
        url: `/api-iec/foreignCurrencies/${this.state.foreignCurrencyId}`, //TODO: update request URL
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
          name: this.state.foreignCurrencyName,
          rate_to_egp: this.state.rate_to_egp
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          this.props.history.push("/foreignCurrencies");
          return;
        },
        error: (error) => {
          $.ajax({
            url: `/api-iec/foreignCurrencies/${this.state.foreignCurrencyId}`, //TODO: update request URL
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
              name: this.state.foreignCurrencyName,
              rate_to_egp: this.state.rate_to_egp
            }),
            xhrFields: {
              withCredentials: true,
            },
            crossDomain: true,
            success: (result) => {
              this.props.history.push("/foreignCurrencies");
              return;
            },
            error: (error) => {
              alert(
                "Unable to delete the foreign Currency. Please try your request again"
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

  currencyEditId = (event) => {
    event.preventDefault();
    if (this.state.foreignCurrencyName === "") {
      alert("please add foreign Currency name");
    }
    if (this.state.rate_to_egp === 0) {
      alert("please add rate to EGP");
    } else {
      const secondFunction = async () => {
        const result = await this.props.refreshToken();
        // do something else here after firstFunction completes

        $.ajax({
          url: `/api-iec/foreignCurrencies/${this.state.foreignCurrencyId}`, //TODO: update request URL
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
            name: this.state.foreignCurrencyName,
            rate_to_egp: this.state.rate_to_egp,
          }),
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          success: (result) => {
            this.props.history.push("/foreignCurrencies");
            return;
          },
          error: (error) => {
            alert(
              "Unable to update the foreign Currency. Please try your request again"
            );
            return;
          },
        });
      };
      secondFunction();
    }
  };

  cancelId = () => {
    this.props.history.push("/foreignCurrencies");
  };

  handleCurrencyName = (event) => {
    this.setState({ foreignCurrencyName: event.target.value });
  };

  handleRateToEGP = (event) => {
    this.setState({ rate_to_egp: event.target.value });
  };
 

  render() {
    return (
      <div>
        <div></div>
        <Header as="h2">
          <Image circular src={foreignCurrency_icon} /> Foreign Currency Edit
        </Header>

        <div id="add_currency">
          <Form>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Currency Name</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      defaultValue={this.state.foreignCurrencyName}
                      onChange={this.handleCurrencyName}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>Rate to EGP</Table.Cell>
                  <Table.Cell>
                    <input
                      id="input"
                      type="number"
                      value={this.state.rate_to_egp}
                      onChange={this.handleRateToEGP}
                    />
                  </Table.Cell>
                </Table.Row>
                
              </Table.Body>
            </Table>

            <button id="submitNew" onClick={this.currencyEditId}>
              Update
            </button>
            <button id="submitNew" onClick={this.currencyDeleteId}>
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

export default ForeignCurrencyEdit;
