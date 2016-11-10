/**
 * Copyright 2012-2013 NeuStar, Inc. All rights reserved.
 * NeuStar, the Neustar logo and related names and logos are registered
 * trademarks, service marks or tradenames of NeuStar, Inc. All other
 * product names, company names, marks, logos and symbols may be trademarks
 * of their respective owners.
 */

package biz.neustar.accessmanagement;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.constraints.NotNull;

import biz.neustar.accessmanagement.api.ApplicationConfiguration;
import biz.neustar.accessmanagement.api.GitConfiguration;
import biz.neustar.accessmanagement.api.LdapConfiguration;
import biz.neustar.accessmanagement.api.ServiceNowConfiguration;
import biz.neustar.accessmanagement.helper.AMServiceAwsConfiguration;
import biz.neustar.dropwizard.core.logging.DefaultGelfConfiguration;

import com.datasift.dropwizard.config.GraphiteConfiguration;
import com.datasift.dropwizard.config.GraphiteReportingConfiguration;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.yammer.dropwizard.config.Configuration;

/**
 * Configuration for service @projectName.
 */
public class AccessmanagementConfiguration extends Configuration implements GraphiteReportingConfiguration {

    @JsonProperty
    @NotNull
    private GraphiteConfiguration graphite;

    @JsonProperty
    private DefaultGelfConfiguration gelfConfiguration = new DefaultGelfConfiguration();

    @Override
    public GraphiteConfiguration getGraphite() {
        return graphite;
    }

    public DefaultGelfConfiguration getGelfConfiguration() {
        return gelfConfiguration;
    }

    public void setGelfConfiguration(DefaultGelfConfiguration gelf) {
        this.gelfConfiguration = gelf;
    }

    @JsonProperty
    private AMServiceAwsConfiguration awsConfiguration = new AMServiceAwsConfiguration();

    @JsonProperty
    private ServiceNowConfiguration serviceNowConfiguration = new ServiceNowConfiguration();
    
    @JsonProperty 
    private ApplicationConfiguration applicationConfiguration = new  ApplicationConfiguration();

    public AMServiceAwsConfiguration getAwsConfiguration() {
        return awsConfiguration;
    }

    public void setAwsConfiguration(AMServiceAwsConfiguration aws) {
        this.awsConfiguration = aws;
    }

    public ServiceNowConfiguration getServiceNowConfiguration() {
        return serviceNowConfiguration;
    }

    public void setServiceNowConfiguration(ServiceNowConfiguration serviceNow) {
        this.serviceNowConfiguration = serviceNow;
    }

    public ApplicationConfiguration getApplicationConfiguration() {
        return applicationConfiguration;
    }

    public void setApplicationConfiguration(ApplicationConfiguration applicationConfiguration) {
        this.applicationConfiguration = applicationConfiguration;
    }

    @JsonProperty
    private GitConfiguration gitConfiguration = new GitConfiguration();
    
    public GitConfiguration getGitConfiguration() {
        return gitConfiguration;
    }

    public void setGitConfiguration(GitConfiguration gitConfiguration) {
        this.gitConfiguration = gitConfiguration;
    }
    
    @JsonProperty
    private LdapConfiguration ldapConfiguration = new LdapConfiguration();

    public LdapConfiguration getLdapConfiguration() {
        return ldapConfiguration;
    }

    public void setLdapConfiguration(LdapConfiguration ldapConfiguration) {
        this.ldapConfiguration = ldapConfiguration;
    }
    
    @JsonProperty
    private Map<String, List<String>> environments = new HashMap<String, List<String>>();

    public Map<String, List<String>> getEnvironments() {
        return environments;
    }

    public void setEnvironments(Map<String, List<String>> environments) {
        this.environments = environments;
    }
}

