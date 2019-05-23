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
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, Typography } from "@material-ui/core";

class DeleteUserDialogue extends React.Component {
    constructor(props) {
        super(props);
    }

    handleDeleteUser(name) {
        let url = "/system/userManager/user/" + name + ".delete.html";

        fetch(url, {
            method: 'POST',
            credentials: 'include'
        })
            .then(() => {
                this.props.reload();
                this.props.handleClose();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        const { classes } = this.props;
        return (
            <Dialog
                open={this.props.isOpen}
                onClose={() => this.props.handleClose()}
            >
                <DialogTitle disableTypography>
                  <Typography variant="h6">Delete {this.props.name}</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to delete user {this.props.name}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="secondary" size="small" onClick={() => this.handleDeleteUser(this.props.name)}>Delete</Button>
                    <Button variant="contained" size="small" onClick={() => this.props.handleClose()}>Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default DeleteUserDialogue;