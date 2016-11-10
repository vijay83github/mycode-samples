package biz.neustar.accessmanagement.helper;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import biz.neustar.accessmanagement.api.AccessManagementConstants;
import biz.neustar.accessmanagement.api.GitConfiguration;
import biz.neustar.accessmanagement.api.Status;
import biz.neustar.accessmanagement.utils.TestUtils;

public class GitHelperTest {

    private GitHelper gitHelper = null;
    private final Logger logger = LoggerFactory.getLogger(GitHelperTest.class);
    private  GitConfiguration gitConfiguration = TestUtils.getConfiguration().getGitConfiguration();

    @Before
    public void before() {
        gitHelper = new GitHelper(gitConfiguration);
    }

    @Test
    public void testGitHelper() {
        gitHelper = new GitHelper(gitConfiguration);
        assertNotNull(gitHelper);
    }
    
    @Test
    public final void testDeleteKeys() {
        int count = gitHelper.deleteKeys("1", getUserKeys());
        assertEquals(2, count);
    }

    @Test
    public final void testDeleteUserKeys() {
        Status status = new Status();
        status.setUserName("test");
        boolean flag = gitHelper.deleteUserKeys(status);
        assertEquals(false, flag);
    }

    private List<String> getUserKeys() {
        List<String> keys = new ArrayList<>();
        keys.add("1");
        keys.add("2");
        return keys;
    }

    @Test
    public final void testListUserKeys() {
        Status status = new Status();
        status.setUserName("test");
        List<String> keysList = gitHelper.listUserKeys(status, "0");
        assertNull(keysList);
    }

    @Test
    public final void testParseId() {
        Status status = new Status();
        status.setUserName("test");
        List<String> userKeys = gitHelper.parseId(AccessManagementConstants.SSH_KEY_JSON);
        assertEquals(2, userKeys.size());
    }

    @Test
    public final void testRetrieveUser() {
        Status status = new Status();
        status.setUserName("test12345");
        String userJson = gitHelper.retrieveUser(status);
        logger.info("userJson {}", userJson);
        assertEquals("[]", userJson);
    }

    @Test
    public final void testGetUserIdByUserName() {
        String userId = gitHelper.getUserIdByUserName(AccessManagementConstants.GIT_USER_JSON);
        assertEquals("3", userId);
    }
    

}
