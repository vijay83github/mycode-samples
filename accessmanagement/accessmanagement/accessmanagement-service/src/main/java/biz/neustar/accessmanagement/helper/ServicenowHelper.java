package biz.neustar.accessmanagement.helper;

import static biz.neustar.accessmanagement.api.AccessManagementConstants.JSON_NODE_NAME_RECORDS;
import static biz.neustar.accessmanagement.api.AccessManagementConstants.OPS_GET_CATALOG_TASKS;
import static biz.neustar.accessmanagement.api.AccessManagementConstants.OPS_UPDATE_CATELOG_TASK;

import java.net.URI;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import biz.neustar.accessmanagement.api.CloseCatalogTask;
import biz.neustar.accessmanagement.api.ServiceNowConfiguration;
import biz.neustar.accessmanagement.api.Status;
import biz.neustar.accessmanagement.util.ServicenowUtil;

import com.fasterxml.jackson.databind.JsonNode;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.filter.HTTPBasicAuthFilter;

public class ServicenowHelper {

    private static final Logger LOGGER = LoggerFactory.getLogger(ServicenowHelper.class);
    private Client client = null;
    private final ServiceNowConfiguration configuration;

    public ServicenowHelper(ServiceNowConfiguration configuration) {
        this.configuration = configuration;
        client = getServiceNowClient();
    }

    /**
     * This method returns a task record for given task id.
     * 
     * @param taskStatus
     *            the Status
     * @param hours
     *            the int
     * @return response the String
     */

    public String getCatalogTasks(Status taskStatus, int hours) {
        LOGGER.info("inside getCatalogTasks request task number {}", taskStatus.getCatalogTaskId());
        String response = null;
        try {
            URI uri = getServiceNowURI(taskStatus.getCatalogTaskId(), OPS_GET_CATALOG_TASKS, hours);
            LOGGER.info("uri:=== {}", uri.toString());
            WebResource webResource = this.client.resource(uri);
            ClientResponse clientResponse = webResource.type(MediaType.APPLICATION_JSON).get(ClientResponse.class);
            response = clientResponse.getEntity(String.class);
            LOGGER.info("clientResponse.getStatus() :== {}", clientResponse.getStatus());
            taskStatus.setStatusCode(clientResponse.getStatus());
            if (taskStatus.getStatusCode() == HttpStatus.SC_OK) {
                JsonNode records = ServicenowUtil.getJsonNode(response, JSON_NODE_NAME_RECORDS);
                if (null != records && records.size() > 0) {
                    LOGGER.info("number of catalog tasks {}", records.size());
                    if (records.size() > 1) {
                        taskStatus.withStatusDesc(String.format(configuration.getMsgManyCatalogTasksFound(),
                                records.size()));
                    } else {
                        taskStatus.withStatusDesc(configuration.getMsgOneCatalogTaskFound());
                    }
                } else {
                    taskStatus.setStatusCode(HttpStatus.SC_NO_CONTENT);
                    taskStatus.withStatusDesc(configuration.getMsgNoCatalogTaskFound());
                }
            } else {
                taskStatus.withStatusDesc(clientResponse.getClientResponseStatus().getReasonPhrase());
            }
        } catch (Exception e) {
            logExceptions(e, taskStatus);
        }
        return response;
    }

    /**
     * This method updates catalog task.
     * 
     * @param taskStatus
     *            the Status
     */
    public void updateCatalogTask(Status taskStatus) {
        LOGGER.info("inside method updateCatalogTask taskId := {}", taskStatus.getCatalogTaskId());
        try {
            URI uri = getServiceNowURI(taskStatus.getCatalogTaskId(), OPS_UPDATE_CATELOG_TASK, 0);
            LOGGER.info("uri:==={}", uri.toString());
            WebResource webResource = client.resource(uri);
            ClientResponse clientResponse = webResource.type(MediaType.APPLICATION_JSON).post(ClientResponse.class,
                    populateCloseCatalogTask(taskStatus));
            String response = clientResponse.getEntity(String.class);
            LOGGER.info("update record data {}", response);
            taskStatus.setStatusCode(clientResponse.getStatus());
            LOGGER.info("clientResponse.getStatus() :==  {}", clientResponse.getStatus());
            if (taskStatus.getStatusCode() != HttpStatus.SC_OK) {
                taskStatus.setStatusCode(HttpStatus.SC_BAD_REQUEST);
                taskStatus.withStatusDesc(configuration.getMsgCatalogTaskNotClosed());
            } else {
                taskStatus.withStatusDesc(configuration.getMsgCatalogTaskClosed());
            }
        } catch (Exception e) {
            logExceptions(e, taskStatus);
        }
    }

    /**
     * populate task notes with all statuses.
     * @param taskStatus  the Status
     * @return closeCatalogTask  the CloseCatalogTask
     */
    protected CloseCatalogTask populateCloseCatalogTask(Status taskStatus) {
        CloseCatalogTask closeCatalogTask = new CloseCatalogTask();
        StringBuilder statusBuilder = new  StringBuilder();
        for (String stat : taskStatus.getStatusDesc()) {
            statusBuilder.append(stat);
        }
        closeCatalogTask.setWorkNotes(statusBuilder.toString());
        return closeCatalogTask;
    }

    protected void logExceptions(Exception e, Status taskStatus) {
        LOGGER.error("Exception occured", e);
        taskStatus.setStatusCode(HttpStatus.SC_INTERNAL_SERVER_ERROR);
        taskStatus.withStatusDesc("Service now REST service is not available, please try after some time.");
    }

    /**
     * This method provides service now client.
     * 
     * @return client the Client
     */

    private Client getServiceNowClient() {
        client = Client.create();
        client.addFilter(new HTTPBasicAuthFilter(configuration.getUserId(), configuration.getPassword()));
        return client;
    }

    /**
     * This method prepares service now URI.
     * 
     * @param paramTaskId
     *            the String
     * @param reqType
     *            the String
     * @param hours
     *            the Int
     * 
     * @return uri as URI
     */
    protected URI getServiceNowURI(String paramTaskId, int reqType, int hours) {
        LOGGER.info("inside method getServiceNowURI task {} request type {}, hours {}", paramTaskId, reqType, hours);
        UriBuilder uriBuilder = UriBuilder.fromUri(configuration.getHost());
        uriBuilder.queryParam("JSON", true);
        uriBuilder.path(ServicenowUtil.getServiceNowTaskTableName(reqType));

        uriBuilder.queryParam(
                "sysparm_query",
                ServicenowUtil.buildQueryParameters(ServicenowUtil.setQueryParams(paramTaskId, hours,
                        configuration.getNexgenSupportGroupId())));

        if (reqType == OPS_GET_CATALOG_TASKS) {
            uriBuilder.queryParam("displayvalue", true);
            uriBuilder.queryParam("displayvariables", true);
            uriBuilder.queryParam("sysparm_action", "getRecords");

        } else if (reqType == OPS_UPDATE_CATELOG_TASK) {
            uriBuilder.queryParam("sysparm_action", "update");

        }
        return uriBuilder.build();
    }
    
    

}
