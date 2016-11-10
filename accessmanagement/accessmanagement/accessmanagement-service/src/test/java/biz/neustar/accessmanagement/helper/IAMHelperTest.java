/**
 * 
 */
package biz.neustar.accessmanagement.helper;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.http.HttpStatus;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import biz.neustar.accessmanagement.AccessmanagementConfiguration;
import biz.neustar.accessmanagement.api.AccessManagementConstants;
import biz.neustar.accessmanagement.api.Status;
import biz.neustar.accessmanagement.api.UserInfo;
import biz.neustar.accessmanagement.utils.TestUtils;

import com.amazonaws.auth.InstanceProfileCredentialsProvider;
import com.amazonaws.services.identitymanagement.AmazonIdentityManagement;
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
import com.amazonaws.services.identitymanagement.model.LoginProfile;
import com.amazonaws.services.identitymanagement.model.NoSuchEntityException;
import com.amazonaws.services.identitymanagement.model.RemoveUserFromGroupRequest;
import com.amazonaws.services.identitymanagement.model.User;

/**
 * This is the unit test class for biz.neustar.accessmanagement.helper.IAMHelper.
 * 
 * @author vijay.gandhavale
 * 
 */
public class IAMHelperTest {
    private static final String ACCESS_KEY_ID = "TestAccessKeyId12345";
    private AccessmanagementConfiguration amConfiguration = TestUtils.getConfiguration();
    private IAMHelper iamHelper = null;
    private Status status = new Status();
    private UserInfo userInfo = null;
    private AmazonIdentityManagement iamClient = mock(AmazonIdentityManagement.class);
    private Logger logger = LoggerFactory.getLogger(IAMHelperTest.class);

    @Before
    public void before() {
        AMServiceAwsConfiguration awsConfiguration = mock(AMServiceAwsConfiguration.class);
        InstanceProfileCredentialsProvider credentialsProvider = mock(InstanceProfileCredentialsProvider.class);
        when(awsConfiguration.toCredentialsProvider()).thenReturn(credentialsProvider);
        amConfiguration.setAwsConfiguration(awsConfiguration);
        iamHelper = new IAMHelper(amConfiguration);
    }

    @Test
    public final void testIAMHelper() {
        Assert.assertNotNull(iamHelper);
    }

    @Test
    public final void testRemoveUserAccessesMock() {
        String userName = "test";
        status.setUserName(userName);
        iamHelper.setIamClient(iamClient);
        userInfo = new UserInfo();
        userInfo.setUserName(userName);
        userInfo.setGroupNames(getGroupNames());
        userInfo.setPolicyNames(getPolicyNames());
        userInfo.setAccessKeyId(ACCESS_KEY_ID);
        iamHelper.removeUserAccesses(userInfo, status);
        assertEquals(HttpStatus.SC_OK, status.getStatusCode());
    }

    @Test
    public final void testDeleteUserPoliciesMock() {
        String userName = "test";
        status.setUserName(userName);
        userInfo = new UserInfo();
        userInfo.setUserName(userName);
        userInfo.setPolicyNames(getPolicyNames());
        iamHelper.setIamClient(iamClient);
        iamClient.deleteUserPolicy(any(DeleteUserPolicyRequest.class));
        boolean flag = iamHelper.deleteUserPolicies(userInfo, status);
        assertEquals(flag, true);
    }

    private List<String> getPolicyNames() {
        List<String> policyNames = new ArrayList<>();
        policyNames.add("TestPolicy1");
        policyNames.add("TestPolicy2");
        policyNames.add("TestPolicy3");
        return policyNames;
    }

    @Test
    public final void testSetUserPoliciesMock() {
        String userName = "test";
        status.setUserName(userName);
        iamHelper.setIamClient(iamClient);
        userInfo = new UserInfo();
        userInfo.setUserName(userName);
        ListUserPoliciesResult result = mock(ListUserPoliciesResult.class);
        when(iamClient.listUserPolicies(any(ListUserPoliciesRequest.class))).thenReturn(result);
        when(result.getPolicyNames()).thenReturn(getPolicyNames());
        boolean flag = iamHelper.setUserPolicies(userInfo);
        logger.info("PolicyNames := {}", userInfo.getPolicyNames());
        assertEquals(true, flag);
    }

    @Test
    public final void testSetAccesskeyIdMock() {
        String userName = "test";
        status.setUserName(userName);
        userInfo = new UserInfo();
        userInfo.setUserName(userName);
        iamHelper.setIamClient(iamClient);
        ListAccessKeysResult result = mock(ListAccessKeysResult.class);
        when(iamClient.listAccessKeys(any(ListAccessKeysRequest.class))).thenReturn(result);
        when(result.getAccessKeyMetadata()).thenReturn(getAccessKeyMetaData(userName));
        boolean flag = iamHelper.setAccesskeyId(userInfo);
        assertEquals(flag, true);
    }

    @Test
    public final void testSetLoginProfileMock() {
        String userName = "test";
        status.setUserName(userName);
        userInfo = new UserInfo();
        userInfo.setUserName(userName);
        iamHelper.setIamClient(iamClient);
        GetLoginProfileResult result = mock(GetLoginProfileResult.class);
        LoginProfile loginProfile = mock(LoginProfile.class);
        when(iamClient.getLoginProfile(any(GetLoginProfileRequest.class))).thenReturn(result);
        when(result.getLoginProfile()).thenReturn(loginProfile);
        when(loginProfile.getCreateDate()).thenReturn(new Date());
        boolean flag = iamHelper.setLoginProfile(userInfo);
        assertEquals(flag, true);
    }

    private List<AccessKeyMetadata> getAccessKeyMetaData(String userName) {
        List<AccessKeyMetadata> accessKeyMetadatas = new ArrayList<>();
        AccessKeyMetadata accessKeyMetadata = new AccessKeyMetadata();
        accessKeyMetadata.setUserName(userName);
        accessKeyMetadata.setAccessKeyId(ACCESS_KEY_ID);
        accessKeyMetadatas.add(accessKeyMetadata);
        return accessKeyMetadatas;
    }

    @Test
    public final void testRemoveUserFromGroupMock() {
        String userName = "test";
        status.setUserName(userName);
        userInfo = new UserInfo();
        userInfo.setUserName(userName);
        userInfo.setGroupNames(getGroupNames());
        iamHelper.setIamClient(iamClient);
        iamClient.removeUserFromGroup(any(RemoveUserFromGroupRequest.class));
        boolean flag = iamHelper.removeUserFromGroup(userInfo, status);
        assertEquals(flag, true);
    }

    private List<String> getGroupNames() {
        List<String> groupNames = new ArrayList<>();
        groupNames.add("TestGroup1");
        groupNames.add("TestGroup2");
        groupNames.add("TestGroup3");
        return groupNames;
    }

    @Test
    public final void testSetUserGroupsMock() {
        String userName = "test";
        status.setUserName(userName);
        iamHelper.setIamClient(iamClient);
        userInfo = new UserInfo();
        userInfo.setUserName(userName);
        ListGroupsForUserResult result = mock(ListGroupsForUserResult.class);
        when(result.getGroups()).thenReturn(getGroups());
        when(iamClient.listGroupsForUser(any(ListGroupsForUserRequest.class))).thenReturn(result);
        boolean flag = iamHelper.setUserGroups(userInfo, status);
        assertEquals(flag, true);
    }

    private List<Group> getGroups() {
        List<Group> groups = new ArrayList<>();
        groups.add(getGroup("abc"));
        groups.add(getGroup("xyz"));
        groups.add(getGroup("PQR"));
        return groups;
    }

    private Group getGroup(String groupName) {
        Group group = new Group();
        group.setGroupName(groupName);
        return group;
    }

    @Test
    public final void testDeleteUserLoginProfileMock() {
        String userName = "test";
        status.setUserName(userName);
        userInfo = new UserInfo();
        userInfo.setUserName(userName);
        userInfo.setLoginProfile(true);
        iamHelper.setIamClient(iamClient);
        iamClient.deleteLoginProfile(any(DeleteLoginProfileRequest.class));
        boolean flag = iamHelper.deleteUserLoginProfile(status, userInfo);
        assertEquals(true, flag);
    }

    @Test
    public final void testDeleteUserAccessKeyMock() {
        String userName = "test";
        status.setUserName(userName);
        userInfo = new UserInfo();
        userInfo.setUserName(userName);
        userInfo.setAccessKeyId(ACCESS_KEY_ID);
        iamHelper.setIamClient(iamClient);
        iamClient.deleteAccessKey(any(DeleteAccessKeyRequest.class));
        boolean flag = iamHelper.deleteUserAccessKey(status, userInfo);
        assertEquals(true, flag);
    }

    @Test
    public final void testLogExceptionsGet() {
        iamHelper.logExceptions(new Exception("Testing logExceptions method for get operations."),
                AccessManagementConstants.OPS_GET, AccessManagementConstants.ACCESS_FEATURE_ACCESS_KEY, status);
        assertEquals(
                String.format(amConfiguration.getApplicationConfiguration().getMsgCanNotBeRetrieved(),
                        AccessManagementConstants.ACCESS_FEATURE_ACCESS_KEY, amConfiguration.getAwsConfiguration()
                                .getEnvName()), status.getStatusDesc().get(0));
    }

    @Test
    public final void testLogExceptionsDelete() {
        iamHelper.logExceptions(new Exception("Testing logExceptions method for delete operations."),
                AccessManagementConstants.OPS_DELETE, AccessManagementConstants.ACCESS_FEATURE_ACCESS_KEY, status);
        assertEquals(
                String.format(amConfiguration.getApplicationConfiguration().getMsgCanNotBeDeleted(),
                        AccessManagementConstants.ACCESS_FEATURE_ACCESS_KEY, amConfiguration.getAwsConfiguration()
                                .getEnvName()), status.getStatusDesc().get(0));
    }

    @Test
    public final void testLogExceptionsNoEntity() {
        iamHelper.logExceptions(new NoSuchEntityException("Testing logExceptions method for NoSuchEntityException."),
                AccessManagementConstants.OPS_GET, AccessManagementConstants.ACCESS_FEATURE_ACCESS_KEY, status);
        assertEquals(String.format(amConfiguration.getApplicationConfiguration().getMsgNotFound(),
                AccessManagementConstants.ACCESS_FEATURE_ACCESS_KEY, null), status.getStatusDesc().get(0));
    }

    @Test
    public void testGetUserInfoMock() {
        String userName = "test";
        status.setUserName(userName);
        User user = new User();
        user.setUserName(userName);
        GetUserResult result = new GetUserResult();
        result.setUser(user);
        ListAccessKeysResult keys = mock(ListAccessKeysResult.class);
        ListGroupsForUserResult listGroups = mock(ListGroupsForUserResult.class);
        ListUserPoliciesResult userPoliciesResult = mock(ListUserPoliciesResult.class);
        when(iamClient.getUser(any(GetUserRequest.class))).thenReturn(result);
        when(iamClient.listGroupsForUser(any(ListGroupsForUserRequest.class))).thenReturn(listGroups);
        when(iamClient.listUserPolicies(any(ListUserPoliciesRequest.class))).thenReturn(userPoliciesResult);
        when(iamClient.listAccessKeys(any(ListAccessKeysRequest.class))).thenReturn(keys);
        iamHelper.setIamClient(iamClient);
        userInfo = iamHelper.getUserInfo(status, "Nexgen");
        assertEquals(userName, userInfo.getUserName());
        assertNotNull(userInfo);
    }

    //@Test
    /*public final void testDeleteUser() {
        String userName = "testuser1";
        status.setUserName(userName);
        userInfo = new UserInfo();
        userInfo.setUserName(userName);
        //userInfo.setAccessKeyId(ACCESS_KEY_ID);
        CatalogTaskResourceHelper catalogTaskResourceHelper = new CatalogTaskResourceHelper(amConfiguration);
        List<AMServiceAwsConfiguration> list = catalogTaskResourceHelper.getAwsConfigurations(amConfiguration
                .getEnvironments());
        AMServiceAwsConfiguration one = list.get(0);
        one.setConnectionTimeout(Duration.seconds(300));
        amConfiguration.setAwsConfiguration(one);
        iamHelper = new IAMHelper(amConfiguration);
        userInfo = iamHelper.getUserInfo(status, "Nexgen");
        // iamHelper.setIamClient(iamClient);
        // iamClient.deleteAccessKey(any(DeleteAccessKeyRequest.class));
        iamHelper.removeUserAccesses(userInfo, status);
        assertEquals(200, status.getStatusCode());
    }*/

}
