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
package ca.sickkids.ccm.lfs.commons.internal;

import org.osgi.framework.Bundle;
import org.osgi.framework.Version;
import org.osgi.service.component.ComponentContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ca.sickkids.ccm.lfs.commons.spi.VersionFinder;

/**
 * VersionService allows you to expose the version of LFS as a service.
 *
 * @version $Id$
 */
@Component(service = {VersionFinder.class})
public class VersionFinderService implements VersionFinder
{

    /**
     * Name of the bundle whose version we take as the version of LFS.
     * Subject to change: right now this seems like the best choice.
     */
    public static final String VERSION_BUNDLE = "ca.sickkids.ccm.lfs.commons";

    private static final Logger LOGGER = LoggerFactory.getLogger(VersionFinderService.class);

    private static Version version;

    /**
     * Activate this bundle, obtain the version of LFS from the version bundle.
     * @param context The context of this factory's bundle
     */
    @Activate
    public void activate(ComponentContext context)
    {
        // We can't directly obtain the version bundle, since we don't know the location a priori
        // Instead, we search through the list of installed bundles
        Bundle[] installed = context.getBundleContext().getBundles();
        for (Bundle bundle : installed) {
            if (bundle.getSymbolicName().equals(VERSION_BUNDLE)) {
                this.version = bundle.getVersion();
                return;
            }
        }

        LOGGER.warn("Failed to find version bundle: {}", VERSION_BUNDLE);
    }

    @Override
    public Version getVersion()
    {
        return this.version;
    }
}
