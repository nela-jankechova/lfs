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

import React, { useState } from "react";

import { Dialog, DialogContent, Link, withStyles } from "@material-ui/core";

import PropTypes from "prop-types";

import Question from "./Question";
import QuestionnaireStyle from "./QuestionnaireStyle";

import Answer from "./Answer";
import AnswerComponentManager from "./AnswerComponentManager";

import PedigreeEditor from "../pedigree/pedigree";

// Component that renders a pedigree, although answering these questions is not currently possible.
//
// Optional props:
//  existingAnswer: array of length 1, where the first entry corresponds to a pedigree object. The
//    pedigree object is assumed to contain an image property with an SVG as its value.
//  questionDescription: props forwarded to the Question element.
//
// Sample usage:
// <PedigreeQuestion
//    questionDefinition={{
//      text="Patient pedigree"
//      description="De-identified information only."
//      }}
//    />
function PedigreeQuestion(props) {
  const { existingAnswer, classes, ...rest } = props;
  const [ expanded, setExpanded ] = useState(false);
  const [ pedigreeData, setPedigree ] = useState({});

  // TODO: use another placeholder image? load from resources?
  const PLACEHOLDER_SVG = '<svg width="300" height="100"><rect fill="#e5e5e5" height="102" width="302" y="-1" x="-1"/>'+
                         '<text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif"' +
                         'font-size="24" y="55" x="86" stroke="#000" fill="#000000" stroke-width="0">no pedigree</text></svg>';
  // FIXME: hardcoded value
  const PEDIGREE_THUMBNAIL_WIDTH = 300;

  var resizeSVG = function(svgText, newWidthInPixels) {
    const newWidth = "$1width=\"" + newWidthInPixels + "px\"";
    var resizedSVG = svgText.replace(/(<svg[^>]+)height="\d+"/, "$1");
    resizedSVG = resizedSVG.replace(/(<svg[^>]+)width="\d+"/, newWidth);
    return resizedSVG;
  };

  var pedigreeJSON = null;
  var pedigreeSVG  = null;
  var displayedImage = PLACEHOLDER_SVG;

  if (pedigreeData && pedigreeData.image && pedigreeData.pedigreeJSON) {
    // until data is saved to LFS, use the latest image as saved from the
    // pedigree editor and stored in React component status
    pedigreeSVG  = pedigreeData.image;
    pedigreeJSON = pedigreeData.pedigreeJSON;
    displayedImage = resizeSVG(pedigreeSVG, PEDIGREE_THUMBNAIL_WIDTH);
  } else if (existingAnswer && existingAnswer.length > 1 && existingAnswer[1].value) {
    // use the image as saved to LFS if available (and not overwritten in the editor)
    pedigreeJSON = existingAnswer[1].value[0];
    pedigreeSVG  = existingAnswer[1].value[1];
    displayedImage = resizeSVG(pedigreeSVG, PEDIGREE_THUMBNAIL_WIDTH);
  }

  var image_div = (
    <div className={classes.pedigreeThumbnail}>
        <div className={classes.pedigreeSmallSVG} dangerouslySetInnerHTML={{__html: displayedImage}}/>
    </div>);

  var closeDialog = function () {
    setExpanded(false);
  };

  var openPedigree = function () {
    window.pedigreeEditor = new PedigreeEditor({
      "pedigreeJSON": pedigreeJSON,
      "pedigreeDiv": "pedigreeEditor",  // the DIV to render entire pedigree in
      "onCloseCallback": closeDialog,
      "onPedigreeSaved": onUpdatedPedigree,
      "readOnlyMode": false });
  };

  var closePedigree = function () {
    window.pedigreeEditor.unload();
    delete window.pedigreeEditor;
  };

  var onUpdatedPedigree = function (pedigreeJSON, pedigreeSVG) {
    // FIXME: save in LFS
    // state change should trigger re-render
    setPedigree({"image": pedigreeSVG, "pedigreeJSON": pedigreeJSON});
  };

  let outputAnswers = pedigreeJSON ? [["value", pedigreeJSON], ["image", pedigreeSVG]] : [];

  return (
    <Question
      {...rest}
      >
      {image_div && (
        <Link onClick={() => {setExpanded(true);}}>
          {image_div}
        </Link>
      )}
      <Dialog fullScreen open={expanded}
        onEntering={() => { openPedigree(); }}
        onExit={() => { closePedigree(); }}
        onClose={() => { setExpanded(false); }}>
        <DialogContent>
          <div id="pedigreeEditor"></div>
        </DialogContent>
      </Dialog>
      <Answer
        answers={outputAnswers}
        questionDefinition={props.questionDefinition}
        existingAnswer={existingAnswer}
        answerNodeType="lfs:PedigreeAnswer"
        valueType="String"
        {...rest}
      />
    </Question>);
}

PedigreeQuestion.propTypes = {
  classes: PropTypes.object.isRequired,
  questionDefinition: PropTypes.shape({
    text: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  existingAnswer: PropTypes.array
}

const StyledPedigreeQuestion = withStyles(QuestionnaireStyle)(PedigreeQuestion)
export default StyledPedigreeQuestion;

AnswerComponentManager.registerAnswerComponent((questionDefinition) => {
  if (questionDefinition.dataType === "pedigree") {
    return [StyledPedigreeQuestion, 50];
  }
});
