package biz.neustar.accessmanagement.util;

import static biz.neustar.accessmanagement.api.AccessManagementConstants.CATALOG_TASK_JSON;
import static biz.neustar.accessmanagement.api.AccessManagementConstants.JSON_NODE_NAME_RECORDS;
import static biz.neustar.accessmanagement.api.AccessManagementConstants.OPS_GET_CATALOG_TASKS;
import static biz.neustar.accessmanagement.api.AccessManagementConstants.OPS_UPDATE_CATELOG_TASK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.mockito.Mockito.mock;

import java.util.List;

import org.junit.Test;

import biz.neustar.accessmanagement.api.QueryParam;

import com.fasterxml.jackson.databind.JsonNode;

public class ServicenowUtilTest {
    private static final int INT_FIVE = 5;
    private static final String SAMPLE_RESPONSE_JSON = "{\"records\":[{\"name\":\"abc\"},{\"name\":\"pqr\"}]}";
    private JsonNode jsonNode = mock(JsonNode.class);

    @Test
    public final void testIsEmpty() {
        assertEquals(true, ServicenowUtil.isEmpty(jsonNode));
    }

    @Test
    public final void testGetJsonNode() {
        assertNotNull(ServicenowUtil.getJsonNode(SAMPLE_RESPONSE_JSON, JSON_NODE_NAME_RECORDS));
    }

    @Test
    public final void testGetJsonNodeNoData() {
        assertNull(ServicenowUtil.getJsonNode(null, JSON_NODE_NAME_RECORDS));
    }

    @Test
    public final void testParseTaskRecords() {
        assertEquals(1,
                ServicenowUtil.parseTaskRecords(ServicenowUtil.getJsonNode(CATALOG_TASK_JSON, JSON_NODE_NAME_RECORDS))
                        .size());
    }

    @Test
    public final void testParseTaskRecordsNoData() {
        assertNotNull(ServicenowUtil.parseTaskRecords(null));
    }

    @Test
    public final void testGetServiceNowTaskTableName() {
        assertEquals("sc_task_list.do", ServicenowUtil.getServiceNowTaskTableName(OPS_GET_CATALOG_TASKS));
        assertEquals("sc_task.do", ServicenowUtil.getServiceNowTaskTableName(OPS_UPDATE_CATELOG_TASK));
    }

    @Test
    public final void testSetQueryParams() {
        List<QueryParam> queryParams = ServicenowUtil.setQueryParams("TASK12345", 2, "abc");
        assertEquals(INT_FIVE, queryParams.size());
    }
    
    @Test
    public final void testSetQueryParamsAHour() {
        List<QueryParam> queryParams = ServicenowUtil.setQueryParams("TASK12345", 1, "abc");
        assertEquals(INT_FIVE, queryParams.size());
    }

    @Test
    public final void testSetQueryParamsNoHours() {
        List<QueryParam> queryParams = ServicenowUtil.setQueryParams("TASK12345", 0, "abc");
        assertEquals(4, queryParams.size());
    }

    @Test
    public final void testBuildQueryParameters() {
        String queryParameters = ServicenowUtil.buildQueryParameters(ServicenowUtil.setQueryParams("TASK12345", 2,
                "abc"));
        assertNotNull(queryParameters);
    }

}
