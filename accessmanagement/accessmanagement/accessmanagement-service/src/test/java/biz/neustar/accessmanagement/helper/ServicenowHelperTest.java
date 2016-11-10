package biz.neustar.accessmanagement.helper;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.apache.http.HttpStatus;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import biz.neustar.accessmanagement.api.AccessManagementConstants;
import biz.neustar.accessmanagement.api.CloseCatalogTask;
import biz.neustar.accessmanagement.api.Status;
import biz.neustar.accessmanagement.utils.TestUtils;


public class ServicenowHelperTest {

    private static final String TASK_ID = "TASK12345";
    private ServicenowHelper servicenowHelper = null;

    @Before
    public void before() {
        servicenowHelper = new ServicenowHelper(TestUtils.getConfiguration().getServiceNowConfiguration());
    }

    @Test
    public final void testServicenowHelper() {
        Assert.assertNotNull(servicenowHelper);
    }

    @Test
    public final void testGetCatalogTasksByTaskId() {
        Status taskStatus = new Status();
        taskStatus.setCatalogTaskId(TASK_ID);
        String response = servicenowHelper.getCatalogTasks(taskStatus, 0);
        Assert.assertNotNull(response);
        Assert.assertEquals(HttpStatus.SC_NO_CONTENT, taskStatus.getStatusCode());
    }
    
    @Test
    public final void testGetCatalogTasks() {
        Status taskStatus = new Status();
        String response = servicenowHelper.getCatalogTasks(taskStatus, 0);
        Assert.assertNotNull(response);
        Assert.assertEquals(HttpStatus.SC_NO_CONTENT, taskStatus.getStatusCode());
    }

   
    @Test
    public final void testGetCatalogTasksForLastTwoHour() {
        Status taskStatus = new Status();
        String response = servicenowHelper.getCatalogTasks(taskStatus, 2);
        Assert.assertNotNull(response);
        Assert.assertEquals(HttpStatus.SC_NO_CONTENT, taskStatus.getStatusCode());
    }

    
    @Test
    public final void testUpdateCatalogTask() {
        Status taskStatus = new Status();
        taskStatus.setCatalogTaskId(TASK_ID);
        servicenowHelper.updateCatalogTask(taskStatus);
        Assert.assertEquals(HttpStatus.SC_OK, taskStatus.getStatusCode());
    }

    @Test
    public final void testLogExceptions() {
        Status taskStatus = new Status();
        taskStatus.setCatalogTaskId(TASK_ID);
        servicenowHelper.logExceptions(new RuntimeException("Testing LogExceptions method."), taskStatus);
        assertEquals(HttpStatus.SC_INTERNAL_SERVER_ERROR, taskStatus.getStatusCode());
    }

    @Test
    public final void testGetServiceNowURI() {
        Assert.assertNotNull(servicenowHelper.getServiceNowURI(TASK_ID,
                AccessManagementConstants.OPS_GET_CATALOG_TASKS, 0));
    }

    @Test
    public final void testUpdateCatalogTaskBadRequest() throws Exception {
        Status taskStatus = mock(Status.class);
        taskStatus.setCatalogTaskId(TASK_ID);
        when(taskStatus.getStatusCode()).thenReturn(HttpStatus.SC_BAD_REQUEST);
        servicenowHelper.updateCatalogTask(taskStatus);
        Assert.assertEquals(HttpStatus.SC_BAD_REQUEST, taskStatus.getStatusCode());
    }
    
    @Test
    public final void testPopulateCloseCatalogTask() {
        Status taskStatus = new Status();
        taskStatus.withStatusDesc("abcd");
        taskStatus.withStatusDesc("pqr");
        CloseCatalogTask catalogTask = servicenowHelper.populateCloseCatalogTask(taskStatus);
        assertEquals("abcdpqr", catalogTask.getWorkNotes());
    }
}
