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

import org.osgi.framework.Version;
import org.osgi.service.component.ComponentContext;

/**
 * Service interface used by {@link ca.sickkids.ccm.lfs.commons.internal.VersionFinderService} to determine
 * the installed version of LFS.
 *
 * @version $Id$
 */
public interface VersionFinder
{
    /**
     * Finds the installed version of LFS.
     * @param context A reference to any OSGi ComponentContext.
     * @return The installed version of LFS
     */
    Version findVersion(ComponentContext context);
}
