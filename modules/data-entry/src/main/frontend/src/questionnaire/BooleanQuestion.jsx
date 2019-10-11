//
//  Licensed to the Apache Software Foundation (ASF) under one
//  or more contributor license agreements.  See the NOTICE file
//  distributed with this work for additional information
//  regarding copyright ownership.  The ASF licenses this file
//  to you under the Apache License, Version 2.0 (the
//  "License"); you may not use this file except in compliance
//  with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing,
//  software distributed under the License is distributed on an
//  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
//  KIND, either express or implied.  See the License for the
//  specific language governing permissions and limitations
//  under the License.
//

import { withStyles } from "@material-ui/core";

import PropTypes from "prop-types";

import MultipleChoice from "./MultipleChoice";
import Question from "./Question";
import QuestionnaireStyle from "./QuestionnaireStyle";

// Component that renders a yes/no question, with optional "unknown" option.
// Selected answers are placed in a series of <input type="hidden"> tags for
// submission.
//
// Optional arguments:
//  name: String containing the question to ask
//  enableUnknown: Boolean denoting whether an unknown option should be allowed
//  yesLabel: String containing the label for 'true'
//  noLabel: String containing the label for 'false'
//  unknownLabel: String containing the label for 'undefined'
//
// Sample usage:
//
// <BooleanQuestion
//   name="Has the patient checked in on time?"
//   />
// <BooleanQuestion
//   name="Has the patient eaten breakfast?"
//   enableUnknown
//   />
// <BooleanQuestion
//   min={1}
//   name="This statement is false."
//   enableUnknown
//   yesLabel="True"
//   noLabel="False"
//   unknownLabel="Does not compute"
//   />
function BooleanQuestion(props) {
  let {name, enableUnknown, yesLabel, noLabel, unknownLabel, ...rest} = props;
  let options = [{label: yesLabel, id: "true"}, {label: noLabel, id: "false"}]
  if (enableUnknown) {
    options.push({label: unknownLabel, id: "undefined"});
  }

  return (
    <Question
      text={name}
      >
      <MultipleChoice
        max={1}
        defaults={options}
        {...rest}
        />
    </Question>);
}

BooleanQuestion.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  enableUnknown: PropTypes.bool,
  yesLabel: PropTypes.string,
  noLabel: PropTypes.string,
  unknownLabel: PropTypes.string
};

BooleanQuestion.defaultProps = {
  enableUnknown: false,
  yesLabel: "Yes",
  noLabel: "No",
  unknownLabel: "Unknown"
};

export default withStyles(QuestionnaireStyle)(BooleanQuestion);