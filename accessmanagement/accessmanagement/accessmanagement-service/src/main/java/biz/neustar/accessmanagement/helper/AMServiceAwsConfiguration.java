package biz.neustar.accessmanagement.helper;

import biz.neustar.dropwizard.aws.AwsConfiguration;

public class AMServiceAwsConfiguration extends AwsConfiguration {
    private String envName;

    public String getEnvName() {
        return envName;
    }

    public void setEnvName(String envName) {
        this.envName = envName;
    }

}
