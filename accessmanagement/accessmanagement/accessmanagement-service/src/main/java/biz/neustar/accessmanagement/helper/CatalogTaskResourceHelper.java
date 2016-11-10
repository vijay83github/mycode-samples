package biz.neustar.accessmanagement.helper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import biz.neustar.accessmanagement.AccessmanagementConfiguration;
import biz.neustar.accessmanagement.api.CatalogTask;
import biz.neustar.accessmanagement.api.Status;
import biz.neustar.accessmanagement.api.UserInfo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.yammer.dropwizard.util.Duration;

public class CatalogTaskResourceHelper {

    private final Logger logger = LoggerFactory.getLogger(CatalogTaskResourceHelper.class);
    private final AccessmanagementConfiguration config;

    /**
     * Function to make response pretty json.
     * 
     * @param statusObject
     *            the Object
     * @return response the String
     */
    public CatalogTaskResourceHelper(AccessmanagementConfiguration config) {
        this.config = config;
    }

    public String getPrettyResponse(Object statusObject) {
        String response = "";
        try {
            ObjectWriter ow = new ObjectMapper().writerWithDefaultPrettyPrinter();
            response = ow.writeValueAsString(statusObject);
        } catch (JsonProcessingException jse) {
            logger.error("Exception while parsing the response ");
        }
        return response;
    }

    public boolean processCatalogTasks(List<Status> statusList, List<CatalogTask> catalogTasks) {
        boolean flag = false;
        if (!catalogTasks.isEmpty()) {
            logger.info("catalogTasks are not empty !!!");
            for (CatalogTask catalogTask : catalogTasks) {
                Status status = new Status();
                status.setCatalogTaskId(catalogTask.getNumber());
                status.setUserName(catalogTask.getUserName());
                removeAccessAndUpdateTask(status);
                statusList.add(status);
                flag = true;
            }
        }
        return flag;
    }

    /**
     * Removes IAM access, git user ssh keys and update catalog task in service now.
     * 
     * @param status
     *            the Status
     */
    public boolean removeAccessAndUpdateTask(Status status) {
        logger.info("group name to be checked := {}", config.getApplicationConfiguration().getGroupName());
        UserInfo userInfo = null;
        List<AMServiceAwsConfiguration> awsConfigurations = getAwsConfigurations(config.getEnvironments());
        if (null != awsConfigurations && !awsConfigurations.isEmpty()) {
            userInfo = removeAwsAccountsAccess(status, awsConfigurations);
        }
        if ((status.getStatusCode() == HttpStatus.SC_OK || status.getStatusCode() == HttpStatus.SC_BAD_REQUEST)
                && !userInfo.isNexgenGroupUser()) {
            status.setEmail(new LdapHelper(config.getLdapConfiguration()).retrieveUserByUsername(status.getUserName()));
            new GitHelper(config.getGitConfiguration()).deleteUserKeys(status);
        }
        if (status.getStatusCode() == HttpStatus.SC_OK || status.getStatusCode() == HttpStatus.SC_BAD_REQUEST) {
            ServicenowHelper servicenowHelper = new ServicenowHelper(config.getServiceNowConfiguration());
            servicenowHelper.updateCatalogTask(status);
        }
        logger.info("Final status {}", status.getStatusDesc());
        return true;
    }

    protected UserInfo removeAwsAccountsAccess(Status status, List<AMServiceAwsConfiguration> awsConfigurations) {
        IAMHelper iamHelper = null;
        UserInfo userInfo = null;
        for (AMServiceAwsConfiguration awsConfiguration : awsConfigurations) {
            logger.info("Remove access for environment {}.", awsConfiguration.getEnvName());
            config.setAwsConfiguration(awsConfiguration);
            iamHelper = new IAMHelper(config);
            userInfo = new IAMHelper(config).getUserInfo(status, config.getApplicationConfiguration().getGroupName());
            logger.info("User information user name {}, groups {}, access key {}.", userInfo.getUserName(),
                    userInfo.getGroupNames(), userInfo.getAccessKeyId());
            if (status.getStatusCode() == HttpStatus.SC_OK && !userInfo.isNexgenGroupUser()) {
                iamHelper.removeUserAccesses(userInfo, status);
            }
        }
        return userInfo;
    }

    protected List<AMServiceAwsConfiguration> getAwsConfigurations(Map<String, List<String>> environments) {
        List<AMServiceAwsConfiguration> awsConfigurations = new ArrayList<>();
        if (environments != null && !environments.isEmpty()) {

            for (Entry<String, List<String>> entry : environments.entrySet()) {
                logger.info("Environment name {}", entry.getKey());
                logger.info("Environment values {}", entry.getValue());
                AMServiceAwsConfiguration awsConfiguration = new AMServiceAwsConfiguration();
                awsConfiguration.setEnvName(entry.getKey());
                populateAMServiceAwsConfiguration(awsConfiguration, entry.getValue());
                awsConfigurations.add(awsConfiguration);

            }
        }
        return awsConfigurations;
    }

    private void populateAMServiceAwsConfiguration(AMServiceAwsConfiguration awsConfiguration,
            List<String> environment) {
        awsConfiguration.setAccessKeyId(environment.get(0));
        awsConfiguration.setSecretKey(environment.get(1));
        awsConfiguration.setRegion(environment.get(2));
        awsConfiguration.setMaxConnections(Integer.valueOf(environment.get(3)));
        awsConfiguration.setConnectionTimeout(Duration.seconds(Long.valueOf(environment.get(3))));
    }
}
