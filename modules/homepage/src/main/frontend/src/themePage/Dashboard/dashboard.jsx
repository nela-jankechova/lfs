// Taken from https://www.creative-tim.com/product/material-dashboard-react
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core
import { withStyles } from "@material-ui/core/styles";
// core components
import GridItem from "material-dashboard-react/dist/components/Grid/GridItem.js";
import GridContainer from "material-dashboard-react/dist/components/Grid/GridContainer.js";
import Table from "material-dashboard-react/dist/components/Table/Table.js";
import Card from "material-dashboard-react/dist/components/Card/Card.js";
import CardHeader from "material-dashboard-react/dist/components/Card/CardHeader.js";
import CardBody from "material-dashboard-react/dist/components/Card/CardBody.js";

import dashboardStyle from "./dashboardStyle.jsx";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "Patients",
      subtitle: "?!!",
      columnNames: ["ID", "Name", "TP53 status"],
      data: [
        ["1", "Alice", "WT"],
        ["2", "Bob", "WT"],
        ["3", "Charlie", "LOF"],
        ["4", "Eve", "NULL"]
      ]
    };
  }

  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>{this.state.title}</h4>
                <p className={classes.cardCategoryWhite}>{this.state.subtitle}</p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="warning"
                  tableHead={this.state.columnNames}
                  tableData={this.state.data}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);