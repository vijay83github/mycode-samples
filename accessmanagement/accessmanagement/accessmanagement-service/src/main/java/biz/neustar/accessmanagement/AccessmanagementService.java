/**
 * Copyright 2012-2013 NeuStar, Inc. All rights reserved.
 * NeuStar, the Neustar logo and related names and logos are registered
 * trademarks, service marks or tradenames of NeuStar, Inc. All other
 * product names, company names, marks, logos and symbols may be trademarks
 * of their respective owners.
 */

package biz.neustar.accessmanagement;

import biz.neustar.accessmanagement.resource.CatalogTaskResource;
import biz.neustar.dropwizard.core.recipes.BasicInitializer;
import com.yammer.dropwizard.Service;
import com.yammer.dropwizard.config.Bootstrap;
import com.yammer.dropwizard.config.Environment;


/**
 * Service for @projectName.
 */
public class AccessmanagementService extends Service<AccessmanagementConfiguration> {

    /**
     * Main entry point to start the service.
     */
    public static void main(String[] args) throws Exception {
        new AccessmanagementService().run(args);
    }

    @Override
    public void initialize(Bootstrap<AccessmanagementConfiguration> bootstrap) {
        bootstrap.setName("accessmanagement");
        BasicInitializer.bootstrap(this, bootstrap);

    }

    @Override
    public void run(AccessmanagementConfiguration configuration, Environment environment) {
        environment.addResource(new CatalogTaskResource(configuration));
    }

}
