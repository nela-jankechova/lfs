/*
  Licensed to the Apache Software Foundation (ASF) under one
  or more contributor license agreements.  See the NOTICE file
  distributed with this work for additional information
  regarding copyright ownership.  The ASF licenses this file
  to you under the Apache License, Version 2.0 (the
  "License"); you may not use this file except in compliance
  with the License.  You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing,
  software distributed under the License is distributed on an
  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, either express or implied.  See the License for the
  specific language governing permissions and limitations
  under the License.
*/

import React from "react";

import { withStyles } from "@material-ui/core/styles";

import userboardStyle from '../userboardStyle.jsx';

import { Button, Dialog, DialogTitle, DialogActions, DialogContent, Grid, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";

class GroupDetailsDialogue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: {},
      groupUsers: []
    };
  }

  addName(name) {
    return { name }
  }

  handleEntering() {
    if (this.props.name != "") {
      fetch("/system/userManager/group/" + this.props.name + ".1.json",
        {
          method: 'GET',
          credentials: 'include'
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          var names = [];
          var i;
          for (i = 0; i < data.members.length; ++i) {
            let username = data.members[i];
            username = username.split('/').pop();
            names.push(this.addName(username));
          }
          this.setState({
            group: data,          
            groupUsers: names 
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        maxWidth="sm"
        open={this.props.isOpen}
        onEntering={() => this.handleEntering()}
        onClose={() => this.props.handleClose()}
      >
        <DialogTitle>
          Group details for {this.props.name}
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <div>
                <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.cardCategory}>Principal Name</TableCell>
                    <TableCell className={classes.cardTitle}>{this.props.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.cardCategory}>Members</TableCell>
                    <TableCell className={classes.cardTitle}>{this.state.group.members ? this.state.group.members.length : 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.cardCategory}>Declared Members</TableCell>
                    <TableCell className={classes.cardTitle}>{this.state.group.declaredMembers ? this.state.group.declaredMembers.length : 0}</TableCell>
                  </TableRow>
                </TableBody>
                </Table>
            </div>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" size="small" onClick={() => this.props.handleClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles (userboardStyle)(GroupDetailsDialogue);