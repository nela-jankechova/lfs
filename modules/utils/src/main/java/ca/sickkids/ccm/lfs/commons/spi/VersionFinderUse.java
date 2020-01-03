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
package ca.sickkids.ccm.lfs.commons.spi;

import javax.script.Bindings;

import org.apache.sling.scripting.sightly.pojo.Use;
import org.osgi.service.component.ComponentContext;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * VersionUse allows you to expose the version of LFS from HTL, as part of the Use API.
 *
 * @version $Id$
 */
@Component()
public class VersionFinderUse implements Use
{
    private static final Logger LOGGER = LoggerFactory.getLogger(VersionFinderUse.class);

    // Store the version as a string
    private String version;

    @Reference
    private VersionFinder versionFinderHandler;

    @Override
    public void init(Bindings bindings)
    {
        ComponentContext context = (ComponentContext) bindings.get("componentContext");
        this.version = this.findVersion(context);
    }

    /**
     * Find the version of LFS in this instance.
     *
     * @param context the context this instance was initialized in.
     * @return The version of LFS
     */
    private String findVersion(ComponentContext context)
    {
        LOGGER.warn("findVersion initiated");
        if (this.versionFinderHandler == null) {
            LOGGER.warn("No reference to VersionFinder!!");
        }
        this.versionFinderHandler.findVersion(context);
        return this.versionFinderHandler.findVersion(context).toString();
    }

    /**
     * Get the version of LFS in this instance.
     *
     * @return The version of LFS
     */
    public String getVersion()
    {
        return this.version;
    }
}
