package biz.neustar.accessmanagement.helper;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import biz.neustar.accessmanagement.AccessmanagementConfiguration;
import biz.neustar.accessmanagement.api.CatalogTask;
import biz.neustar.accessmanagement.api.Status;
import biz.neustar.accessmanagement.utils.TestUtils;

public class CatalogTaskResourceHelperTest {
    private static final String TASK_ID = "TASK12345";
    private AccessmanagementConfiguration config = TestUtils.getConfiguration();
    private CatalogTaskResourceHelper catalogTaskResourceHelper = null;

    @Before
    public final void before() {
        catalogTaskResourceHelper = new CatalogTaskResourceHelper(config);
    }

    @Test
    public final void testCatalogTaskResourceHelper() {
        catalogTaskResourceHelper = new CatalogTaskResourceHelper(config);
        assertNotNull(catalogTaskResourceHelper);
    }

    @Test
    public final void testGetPrettyResponse() {
        String prettyResponse = catalogTaskResourceHelper.getPrettyResponse(getStatusObject());
        assertNotNull(prettyResponse);
    }

    private Status getStatusObject() {
        Status taskStatus = new Status();
        taskStatus.setCatalogTaskId(TASK_ID);
        taskStatus.setUserName("abcd");
        return taskStatus;
    }

    @Test
    public final void testProcessCatalogTasks() {
        boolean flag = catalogTaskResourceHelper.processCatalogTasks(buildStatusList(), getCatalogTasks());
        assertEquals(true, flag);
    }

    private List<CatalogTask> getCatalogTasks() {
        List<CatalogTask> catalogTasks = new ArrayList<>();
        CatalogTask catalogTask = new CatalogTask();
        catalogTask.setNumber(TASK_ID);
        catalogTask.setUserName("abcd");
        catalogTasks.add(catalogTask);
        return catalogTasks;
    }

    private List<Status> buildStatusList() {
        return new ArrayList<>();
    }

    @Test
    public final void testRemoveAccessAndUpdateTask() {
        boolean flag = catalogTaskResourceHelper.removeAccessAndUpdateTask(getStatusObject());
        assertEquals(true, flag);
    }
    
    /*@Test
    public final void testRemoveAwsAccountsAccess() {
        List<AMServiceAwsConfiguration> list = catalogTaskResourceHelper.getAwsConfigurations(config
                .getEnvironments());
        String userName = "testuser1";
        Status status = new Status();
        status.setUserName(userName);
        UserInfo userInfo = catalogTaskResourceHelper.removeAwsAccountsAccess(status, list);
        assertEquals(false, userInfo.getLoginProfile());
        
    }*/


    @Test
    public final void getAwsConfigurationsTest() {
        List<AMServiceAwsConfiguration> list = catalogTaskResourceHelper.getAwsConfigurations(TestUtils
                .getConfiguration().getEnvironments());
        assertNotNull(list);
    }

}
