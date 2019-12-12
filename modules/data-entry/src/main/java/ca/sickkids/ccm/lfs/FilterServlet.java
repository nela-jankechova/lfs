/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package ca.sickkids.ccm.lfs;

import java.io.IOException;
import java.io.Writer;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.jcr.query.Query;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue.ValueType;
import javax.servlet.Servlet;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A servlet that lists the filters applicable to the given questionnaire, or all questionnaires visible by the user.
 * <p>
 * This servlet supports the following parameters:
 * </p>
 * <ul>
 * <li><tt>questionnaire</tt>: a path to a questionnaire whose filterable options to retrieve</li>
 * </ul>
 *
 * @version $Id$
 */
@Component(service = { Servlet.class })
@SlingServletResourceTypes(
    resourceTypes = { "lfs/Questionnaire", "lfs/QuestionnairesHomepage" },
    selectors = { "filters" })
public class FilterServlet extends SlingSafeMethodsServlet
{
    private static final long serialVersionUID = 2558430802619674046L;

    private static final Logger LOGGER = LoggerFactory.getLogger(FilterServlet.class);

    private static final String DEEP_JSON_SUFFIX = ".deep.json";

    // TODO: Cleanup
    @SuppressWarnings("checkstyle:ExecutableStatementCount")
    @Override
    public void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response) throws IOException
    {
        // Is there a questionnaire specified?
        String questionnaire = request.getParameter("questionnaire");
        JsonObject allProperties;

        if (questionnaire != null) {
            // If a questionnaire is specified, return all fields by the given questionnaire

            // First, ensure that we're accessing the deep jsonification of the questionnaire
            if (!questionnaire.endsWith(DEEP_JSON_SUFFIX)) {
                questionnaire = questionnaire.concat(DEEP_JSON_SUFFIX);
            }

            // Next, convert it to a deep json object
            final Resource resource = request.getResourceResolver().getResource(questionnaire);
            allProperties = resource.adaptTo(JsonObject.class);
        } else {
            // If there is no questionnaire specified, we return all fields by all questionnaires
            // visible by the user
            final StringBuilder query =
                // We select all child nodes of the homepage, filtering out nodes that aren't ours, such as rep:policy
                new StringBuilder("select n from [lfs:Questionnaire] as n where ischildnode(n, '"
                    + request.getResource().getPath() + "') and n.'sling:resourceSuperType' = 'lfs/Resource'");
            // TODO: Append .deep.json to the results
            final Iterator<Resource> results =
                request.getResourceResolver().findResources(query.toString(), Query.JCR_SQL2);
            JsonObjectBuilder builder = Json.createObjectBuilder();
            while (results.hasNext()) {
                Resource resource = results.next();
                String path = resource.getResourceMetadata().getResolutionPath();
                resource = request.getResourceResolver().resolve(path.concat(".deep.json"));
                JsonObject questions = resource.adaptTo(JsonObject.class);
                Map<String, String> seenElements = new HashMap<String, String>();

                // Copy over the keys
                for (String key : questions.keySet()) {
                    // Skip over non-questions (non-objects)
                    if (questions.get(key).getValueType() != ValueType.OBJECT
                        || !questions.getJsonObject(key).getString("jcr:primaryType").equals("lfs:Question")) {
                        continue;
                    }

                    if (seenElements.containsKey(key)) {
                        // If this question already exists, make sure that it has the same dataType
                        String questionType = questions.getJsonObject(key).getString("dataType");
                        if (seenElements.get(key) != questionType) {
                            // DIFFERENT -- prepend a slightly differently named version
                            String newKey = questionType.concat("|").concat(key);
                            seenElements.put(newKey, questionType);
                            builder.add(newKey, questions.getJsonObject(key));
                        } else {
                            // SAME -- append our jcr:uuid to the question
                            JsonObject amending = builder.build().getJsonObject(key);
                            amending.put("jcr:uuid", Json.createValue(amending.getString("jcr:uuid").concat(",")
                                        .concat(questions.getJsonObject(key).getString("jcr:uuid"))));
                            builder.add(key, amending);
                        }
                    } else {
                        // If this question does not exist, just add it
                        seenElements.put(key, questions.getJsonObject(key).getString("dataType"));
                        builder.add(key, questions.getJsonObject(key));
                    }
                }
            }
            allProperties = builder.build();
        }

        // Return the entire thing as a json file, except join together fields that have the same
        // name and type
        final Writer out = response.getWriter();
        out.write(allProperties.toString());
    }
}