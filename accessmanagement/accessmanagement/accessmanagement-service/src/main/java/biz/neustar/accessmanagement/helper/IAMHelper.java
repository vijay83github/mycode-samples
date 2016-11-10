package biz.neustar.accessmanagement.helper;

import static biz.neustar.accessmanagement.api.AccessManagementConstants.ACCESS_FEATURE_ACCESS_KEY;
import static biz.neustar.accessmanagement.api.AccessManagementConstants.ACCESS_FEATURE_LOGIN_PROFILE;
import static biz.neustar.accessmanagement.api.AccessManagementConstants.ACCESS_FEATURE_USER_GROUP;
import static biz.neustar.accessmanagement.api.AccessManagementConstants.ACCESS_FEATURE_USER_INFO;
import static biz.neustar.accessmanagement.api.AccessManagementConstants.ACCESS_FEATURE_USER_POLICY;
import static biz.neustar.accessmanagement.api.AccessManagementConstants.OPS_DELETE;
import static biz.neustar.accessmanagement.api.AccessManagementConstants.OPS_GET;

import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import biz.neustar.accessmanagement.AccessmanagementConfiguration;
import biz.neustar.accessmanagement.api.ApplicationConfiguration;
import biz.neustar.accessmanagement.api.Status;
import biz.neustar.accessmanagement.api.UserInfo;

import com.amazonaws.services.identitymanagement.AmazonIdentityManagement;
import com.amazonaws.services.identitymanagement.AmazonIdentityManagementClient;
import com.amazonaws.services.identitymanagement.model.AccessKeyMetadata;
import com.amazonaws.services.identitymanagement.model.DeleteAccessKeyRequest;
import com.amazonaws.services.identitymanagement.model.DeleteLoginProfileRequest;
import com.amazonaws.services.identitymanagement.model.DeleteUserPolicyRequest;
import com.amazonaws.services.identitymanagement.model.GetLoginProfileRequest;
import com.amazonaws.services.identitymanagement.model.GetLoginProfileResult;
import com.amazonaws.services.identitymanagement.model.GetUserRequest;
import com.amazonaws.services.identitymanagement.model.GetUserResult;
import com.amazonaws.services.identitymanagement.model.Group;
import com.amazonaws.services.identitymanagement.model.ListAccessKeysRequest;
import com.amazonaws.services.identitymanagement.model.ListAccessKeysResult;
import com.amazonaws.services.identitymanagement.model.ListGroupsForUserRequest;
import com.amazonaws.services.identitymanagement.model.ListGroupsForUserResult;
import com.amazonaws.services.identitymanagement.model.ListUserPoliciesRequest;
import com.amazonaws.services.identitymanagement.model.ListUserPoliciesResult;
import com.amazonaws.services.identitymanagement.model.NoSuchEntityException;
import com.amazonaws.services.identitymanagement.model.RemoveUserFromGroupRequest;
import com.google.common.base.Strings;

public class IAMHelper {
    private final Logger logger = LoggerFactory.getLogger(IAMHelper.class);
    private AmazonIdentityManagement iamClient;
    private final ApplicationConfiguration appConfiguration;
    private final AMServiceAwsConfiguration awsConfiguration;

    public IAMHelper(AccessmanagementConfiguration configuration) {
        awsConfiguration = configuration.getAwsConfiguration();
        this.iamClient = new AmazonIdentityManagementClient(awsConfiguration.toCredentialsProvider());
        appConfiguration = configuration.getApplicationConfiguration();

    }

    public void removeUserAccesses(UserInfo userInfo, Status status) {
        logger.info("inside removeUserAccesses for user-name :== {}", userInfo.getUserName());
        boolean flag = false;
        logger.info("Status code before removal start= {}", status.getStatusCode());
        
        if (status.getStatusCode() == HttpStatus.SC_OK) {
            boolean stat = false;
            logger.info("Status code before removal of groups= {}", status.getStatusCode());
            
            stat = removeUserFromGroup(userInfo, status);
            
            flag = flag || stat;
            logger.info("Status code before removal of user policies = {}", status.getStatusCode());

            stat = deleteUserPolicies(userInfo, status);
            flag = flag || stat;
            
            logger.info("Status code before deleting password = {}", status.getStatusCode());

            stat =  deleteUserLoginProfile(status, userInfo);
            flag = flag || stat;
            
            logger.info("Status code before deleting access keys = {}", status.getStatusCode());

            stat = deleteUserAccessKey(status, userInfo);
            flag = flag || stat;
        }
        if (status.getStatusCode() == HttpStatus.SC_OK && flag) {
            status.withStatusDesc(String.format(appConfiguration.getMsgSuccessfulAccessRemoval(),
                    userInfo.getUserName()));
        } 
    }

    protected boolean deleteUserLoginProfile(Status status, UserInfo userInfo) {
        logger.info("before deleteLoginProfileRequest");
        boolean flag = false;
        try {
            if (userInfo.getLoginProfile()) {
                DeleteLoginProfileRequest deleteLoginProfileRequest = new DeleteLoginProfileRequest();
                deleteLoginProfileRequest.setUserName(userInfo.getUserName());
                iamClient.deleteLoginProfile(deleteLoginProfileRequest);
                flag = true;
            }
        } catch (Exception e) {
            logExceptions(e, OPS_DELETE, ACCESS_FEATURE_LOGIN_PROFILE, status);
        }
        return flag;
    }

    protected boolean deleteUserAccessKey(Status status, UserInfo userInfo) {
        logger.info("before deleteAccessKeyRequest");
        boolean flag = false;
        try {
            if (null != userInfo.getAccessKeyId()) {
                DeleteAccessKeyRequest deleteAccessKeyRequest = new DeleteAccessKeyRequest();
                deleteAccessKeyRequest.setAccessKeyId(userInfo.getAccessKeyId());
                deleteAccessKeyRequest.setUserName(userInfo.getUserName());
                iamClient.deleteAccessKey(deleteAccessKeyRequest);
                flag = true;
            }
        } catch (Exception e) {
            logExceptions(e, OPS_DELETE, ACCESS_FEATURE_ACCESS_KEY, status);
        }
        return flag;
    }

    protected boolean deleteUserPolicies(UserInfo userInfo, Status status) {
        logger.info("inside deleteUserPolicies userName:== {}", userInfo.getUserName());
        boolean flag = false;
        try {
            if (userInfo.getPolicyNames() != null && !userInfo.getPolicyNames().isEmpty()) {
                for (String policyName : userInfo.getPolicyNames()) {
                    DeleteUserPolicyRequest deleteUserPolicyRequest = new DeleteUserPolicyRequest();
                    deleteUserPolicyRequest.setUserName(userInfo.getUserName());
                    deleteUserPolicyRequest.setPolicyName(policyName);
                    iamClient.deleteUserPolicy(deleteUserPolicyRequest);
                    flag = true;
                }
            }
        } catch (Exception e) {
            logExceptions(e, OPS_DELETE, ACCESS_FEATURE_USER_POLICY, status);
        }
        return flag;
    }

    protected boolean setUserPolicies(UserInfo userInfo) {
        logger.info("inside setUserPolicies user name :== {}", userInfo.getUserName());
        boolean flag = false;
        ListUserPoliciesRequest listUserPoliciesRequest = new ListUserPoliciesRequest();
        listUserPoliciesRequest.setUserName(userInfo.getUserName());
        ListUserPoliciesResult result = iamClient.listUserPolicies(listUserPoliciesRequest);
        if (null != result && null != result.getPolicyNames()) {
            userInfo.setPolicyNames(result.getPolicyNames());
            flag = true;
        }
        return flag;
    }

    protected boolean setAccesskeyId(UserInfo userInfo) {
        logger.info("inside setAccesskeyId user name :== {}", userInfo.getUserName());
        String accessKeyId = null;
        boolean flag = false;
        ListAccessKeysRequest listAccessKeysRequest = new ListAccessKeysRequest();
        listAccessKeysRequest.setUserName(userInfo.getUserName());
        ListAccessKeysResult keys = iamClient.listAccessKeys(listAccessKeysRequest);
        if (null != keys) {
            for (AccessKeyMetadata accessKeyMetadata : keys.getAccessKeyMetadata()) {
                if (userInfo.getUserName().equals(accessKeyMetadata.getUserName())) {
                    accessKeyId = accessKeyMetadata.getAccessKeyId();
                    flag = true;
                }
            }
            userInfo.setAccessKeyId(accessKeyId);
        }
        return flag;
    }

    protected boolean removeUserFromGroup(UserInfo userInfo, Status status) {
        logger.info("inside removeUserFromGroup user name :== {}", userInfo.getUserName());
        boolean flag = false;
        try {
            if (userInfo.getGroupNames() != null && !userInfo.getGroupNames().isEmpty()) {
                for (String groupName : userInfo.getGroupNames()) {
                    RemoveUserFromGroupRequest removeUserFromGroupRequest = new RemoveUserFromGroupRequest();
                    removeUserFromGroupRequest.setUserName(userInfo.getUserName());
                    removeUserFromGroupRequest.setGroupName(groupName);
                    iamClient.removeUserFromGroup(removeUserFromGroupRequest);
                    logger.info(" User :" + userInfo.getUserName() + " removed from group : " + groupName);
                    flag = true;
                }
            }
        } catch (Exception e) {
            logExceptions(e, OPS_DELETE, ACCESS_FEATURE_USER_GROUP, status);
        }
        return flag;
    }

    protected boolean setUserGroups(UserInfo userInfo, Status status) {
        boolean flag = false;
        logger.info("inside setUserGroups user name :== {}", userInfo.getUserName());
        try {
            ListGroupsForUserRequest listGroupsForUserRequest = new ListGroupsForUserRequest();
            listGroupsForUserRequest.setUserName(userInfo.getUserName());
            ListGroupsForUserResult result = iamClient.listGroupsForUser(listGroupsForUserRequest);
            if (result != null) {
                List<Group> groups = result.getGroups();
                if (groups != null && !groups.isEmpty()) {
                    List<String> groupNames = new ArrayList<>();
                    for (Group group : groups) {
                        groupNames.add(group.getGroupName());
                        flag = true;
                    }
                    userInfo.setGroupNames(groupNames);
                }
            }
            if (null != userInfo.getGroupNames() && !userInfo.getGroupNames().isEmpty()) {
                boolean isNexgenGroupUser = userInfo.getGroupNames().contains(userInfo.getGroupName());
                userInfo.setNexgenGroupUser(isNexgenGroupUser);
                if (isNexgenGroupUser) {
                    status.withStatusDesc(String.format(appConfiguration.getMsgNexgenGroupRestriction(),
                            userInfo.getUserName(), userInfo.getGroupName()));
                }
            }
        } catch (Exception e) {
            logExceptions(e, OPS_GET, ACCESS_FEATURE_USER_GROUP, status);
        }
        return flag;
    }

    public UserInfo getUserInfo(Status status, String groupName) {
        logger.info("inside getUserInfo userName:== {}", status.getUserName());
        UserInfo userInfo = new UserInfo();
        userInfo.setUserName(status.getUserName());
        userInfo.setGroupName(groupName);
        try {
            GetUserRequest userRequest = new GetUserRequest();
            logger.info("Status code before retrieving user info= {}", status.getStatusCode());
            GetUserResult userResult = iamClient.getUser(userRequest.withUserName(userInfo.getUserName()));
            if (userResult != null && userResult.getUser() != null
                    && !Strings.isNullOrEmpty(userResult.getUser().getUserName())) {
                
                logger.info("Status code before retrieving user groups= {}", status.getStatusCode());
                setUserGroups(userInfo, status);
                
                addUserInfo(status, userInfo);
            }
        } catch (Exception e) {
            status.setStatusCode(HttpStatus.SC_BAD_REQUEST);
            logExceptions(e, OPS_GET, ACCESS_FEATURE_USER_INFO, status);
        }
        logger.info("get user status:=" + status.getStatusDesc());
        return userInfo;
    }

    protected void addUserInfo(Status status, UserInfo userInfo) {
        if (!userInfo.isNexgenGroupUser()) {
            try {
                logger.info("Status code before retrieving user policies = {}", status.getStatusCode());
                setUserPolicies(userInfo);
            } catch (Exception e) {
                logExceptions(e, OPS_GET, ACCESS_FEATURE_USER_GROUP, status);
            }
            try {
                logger.info("Status code before retrieving user access key = {}", status.getStatusCode());
                setAccesskeyId(userInfo);
            } catch (Exception e) {
                logExceptions(e, OPS_GET, ACCESS_FEATURE_ACCESS_KEY, status);
            }
            try {
                logger.info("Status code before retrieving user password = {}", status.getStatusCode());
                setLoginProfile(userInfo);
            } catch (NoSuchEntityException e) {
                logger.error("NoSuchEntityException occured", e);
            } catch (Exception e) {
                logExceptions(e, OPS_GET, ACCESS_FEATURE_LOGIN_PROFILE, status);
            }
        }
    }

    protected boolean setLoginProfile(UserInfo userInfo) {
        logger.info("inside setLoginProfile user name :== {}", userInfo.getUserName());
        boolean flag = false;
        GetLoginProfileRequest getLoginProfileRequest = new GetLoginProfileRequest();
        getLoginProfileRequest.setUserName(userInfo.getUserName());
        GetLoginProfileResult result = iamClient.getLoginProfile(getLoginProfileRequest);
        if (null != result && null != result.getLoginProfile()) {
            userInfo.setLoginProfile(result.getLoginProfile().getCreateDate() != null);
            flag = true;
        }
        return flag;

    }

    protected void logExceptions(Exception e, int opsType, String userAccessFeature, Status status) {
        logger.info("inside method logExceptions");
        if (e instanceof NoSuchEntityException) {
            logger.error("NoSuchEntityException occured", e);
            status.withStatusDesc(String.format(appConfiguration.getMsgNotFound(), userAccessFeature,
                    awsConfiguration.getEnvName()));
        } else {
            logger.error("Exception occured", e);
            status.setStatusCode(HttpStatus.SC_INTERNAL_SERVER_ERROR);
            if (opsType == OPS_GET) {
                status.withStatusDesc(String.format(appConfiguration.getMsgCanNotBeRetrieved(), userAccessFeature,
                        awsConfiguration.getEnvName()));
            } else {
                status.withStatusDesc(String.format(appConfiguration.getMsgCanNotBeDeleted(), userAccessFeature,
                        awsConfiguration.getEnvName()));
            }
        }
    }

    protected void setIamClient(AmazonIdentityManagement iamClient) {
        this.iamClient = iamClient;
    }

}
