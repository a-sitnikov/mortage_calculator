import React, { Component } from 'react';
import { FormGroup, Col, ControlLabel, Button, Table } from 'react-bootstrap'
import Form from "react-jsonschema-form";

import { calcTerm, calcMonthlyPayment, calcPayments } from './utils'
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    const properties = {
      loanAmount: {
        type: "number",
        title: "Сумма кредита:"
      },
      interestRate: {
        type: "number",
        title: "Процент:"
      },
      loanTerm: {
        type: "number",
        title: "Срок кредита, мес:"
      },
      monthlyPayment: {
        type: "number",
        title: "Платеж:"
      },
      roundPayment: {
        type: "boolean",
        title: "Округлять платеж"
      },
      toCalc: {
        type: "string",
        title: "Рассчитать:",
        enum: ["payment", "term"],
        enumNames: ["Платеж", "Срок"]
      },
    };

    const dependencies = {
      toCalc: {
        oneOf: [
          {
            properties: {
              toCalc: { enum: ["payment"] }
            },
            required: ["loanTerm"]
          },
          {
            properties: {
              toCalc: { enum: ["term"] }
            },
            required: ["monthlyPayment"]
          }
        ]
      }
    }

    this.schema = {
      title: 'Ипотечный калькулятор',
      type: "object",
      required: [
        "loanAmount",
        "interestRate"
      ],
      properties,
      dependencies
    };

    this.uiSchema = {
      "toCalc": {
        "ui:widget": "radio",
        "ui:options": {
          inline: true
        }
      }
    };

    this.state = {
      loanAmount: 1000000,
      interestRate: 10,
      loanTerm: 36,
      toCalc: "payment",
      roundPayment: false,
      payments: []
    }
  }

  handleChange = ({ formData }) => {
    this.setState(formData);
  }

  calculate = (schema) => {

    const { loanAmount, interestRate, monthlyPayment, loanTerm, toCalc, roundPayment } = this.state;
    if (toCalc === "term") {
      let loanTerm = calcTerm(loanAmount, interestRate, monthlyPayment);
      let payments = calcPayments(loanAmount, interestRate, monthlyPayment);
      this.setState({
        loanTerm,
        payments
      })

    } else if (toCalc === "payment") {

      let monthlyPayment = calcMonthlyPayment(loanAmount, interestRate, loanTerm, roundPayment);
      let payments = calcPayments(loanAmount, interestRate, monthlyPayment);
      this.setState({
        monthlyPayment,
        payments
      })

    }

  }

  render() {
    return (
      <div className="container">
        <Form
          schema={this.schema}
          uiSchema={this.uiSchema}
          formData={this.state}
          /*
          FieldTemplate={CustomFieldTemplate}
          ObjectFieldTemplate={ObjectField}
          */
          onChange={this.handleChange}
          onSubmit={this.calculate}
        >
          <div>
            <Button type="submit">Рассчитать</Button>
          </div>
        </Form>
        <Table striped bordered condensed hover style={{ marginTop: "15px" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Сумма</th>
              <th>Сумма ОД</th>
              <th>Сумма процентов</th>
              <th>Остаток ОД</th>
            </tr>
          </thead>
          <tbody>
            {this.state.payments.map((val) => (
              <tr key={val.n} >
                <td>{val.n}</td>
                <td>{Math.round(100 * val.payment) / 100}</td>
                <td>{Math.round(100 * val.principal) / 100}</td>
                <td>{Math.round(100 * val.interest) / 100}</td>
                <td>{Math.round(100 * val.remaining) / 100}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
