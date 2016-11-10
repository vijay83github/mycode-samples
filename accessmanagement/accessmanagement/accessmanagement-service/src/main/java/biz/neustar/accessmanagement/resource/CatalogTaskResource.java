package biz.neustar.accessmanagement.resource;

import static biz.neustar.accessmanagement.api.AccessManagementConstants.JSON_NODE_NAME_RECORDS;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import biz.neustar.accessmanagement.AccessmanagementConfiguration;
import biz.neustar.accessmanagement.api.CatalogTask;
import biz.neustar.accessmanagement.api.Status;
import biz.neustar.accessmanagement.helper.CatalogTaskResourceHelper;
import biz.neustar.accessmanagement.helper.ServicenowHelper;
import biz.neustar.accessmanagement.util.ServicenowUtil;
import biz.neustar.accessmanagement.validator.ServicenowValidator;
import biz.neustar.apidocumator.annotation.Description;
import biz.neustar.apidocumator.annotation.Endpoint;

@Endpoint(path = "/accessmgmt", name = "Access Management")
@Path("/accessmgmt")
public class CatalogTaskResource {
    private final Logger logger = LoggerFactory.getLogger(CatalogTaskResource.class);
    private final AccessmanagementConfiguration config;
    private final CatalogTaskResourceHelper catalogTaskResourceHelper;
 
    public CatalogTaskResource(AccessmanagementConfiguration config) {
        this.config = config;
        catalogTaskResourceHelper = new CatalogTaskResourceHelper(config);        
    }

    @Description("Disable IAM, Git account requested in given service-now catalog task.")
    @GET
    @Path("/disableUser")
    @Produces(MediaType.APPLICATION_JSON)
    public String disableUser(@QueryParam("catalogTaskId") String taskId) {
        logger.info("inside method disableUser catalog task number: {}", taskId);
        Status status = new Status();
        status.setCatalogTaskId(taskId);
        ServicenowValidator.validateTaskId(status);
        if (status.getStatusCode() == HttpStatus.SC_BAD_REQUEST) {
            return catalogTaskResourceHelper.getPrettyResponse(status);
        }
        try {
            ServicenowHelper servicenowHelper = new ServicenowHelper(config.getServiceNowConfiguration());
            String catalogTaskJson = servicenowHelper.getCatalogTasks(status, 0);
            logger.info("Got the status here --------- :" + status.getStatusDesc());
            if (status != null && status.getStatusCode() == HttpStatus.SC_OK) {
                List<CatalogTask> catalogTasks = ServicenowUtil.parseTaskRecords(ServicenowUtil.getJsonNode(
                        catalogTaskJson, JSON_NODE_NAME_RECORDS));
                if (!catalogTasks.isEmpty()) {
                    CatalogTask catalogTask = catalogTasks.get(0);
                    logger.info("user name:==" + catalogTask.getUserName());
                    status.setUserName(catalogTask.getUserName());
                    status.setCatalogTaskId(catalogTask.getNumber());
                    catalogTaskResourceHelper.removeAccessAndUpdateTask(status);
                }
            }
        } catch (Exception e) {
            logger.error("Exception occured!!!", e);
            status = new Status();
            status.setStatusCode(HttpStatus.SC_INTERNAL_SERVER_ERROR);
            status.withStatusDesc("Internal server error, please try again after some time.");
        }
        return catalogTaskResourceHelper.getPrettyResponse(status);
    }

    

    @Description("Disable IAM accounts requested on service-now for last two hour")
    @GET
    @Path("/disableUsersForLastTwoHour")
    @Produces(MediaType.APPLICATION_JSON)
    public String disableUsersForLastTwoHour() {
        logger.info("inside method disableUsersForLastHour !!!");
        List<Status> statusList = new ArrayList<>();
        Status status = new Status();
        ServicenowHelper servicenowHelper = new ServicenowHelper(config.getServiceNowConfiguration());
        String response = servicenowHelper.getCatalogTasks(status, 2);
        statusList.add(status);
        if (status != null && status.getStatusCode() == HttpStatus.SC_OK) {
            List<CatalogTask> catalogTasks = ServicenowUtil.parseTaskRecords(ServicenowUtil.getJsonNode(response,
                    JSON_NODE_NAME_RECORDS));
            catalogTaskResourceHelper.processCatalogTasks(statusList, catalogTasks);
        }
        logger.info("Method disableUsersForLastTwoHour exit !!!");
        return catalogTaskResourceHelper.getPrettyResponse(statusList);
    }

    @Description("Disable IAM accounts requested on service-now in all open catalog tasks")
    @GET
    @Path("/disableAllUsers")
    @Produces(MediaType.APPLICATION_JSON)
    public String disableAllUsers() {
        logger.info("inside method disableAllUsers !!!");
        List<Status> statusList = new ArrayList<>();
        Status status = new Status();
        ServicenowHelper servicenowHelper = new ServicenowHelper(config.getServiceNowConfiguration());
        String response = servicenowHelper.getCatalogTasks(status, 0);
        statusList.add(status);
        if (status != null && status.getStatusCode() == HttpStatus.SC_OK) {
            List<CatalogTask> catalogTasks = ServicenowUtil.parseTaskRecords(ServicenowUtil.getJsonNode(response,
                    JSON_NODE_NAME_RECORDS));
            catalogTaskResourceHelper.processCatalogTasks(statusList, catalogTasks);
        }
        logger.info("Method disableAllUsers exit !!!");
        return catalogTaskResourceHelper.getPrettyResponse(statusList);
    }

    

    @Description("Health check for service.")
    @GET
    @Path("/healthCheck")
    public String healthCheck() {
        return "OK";
    }


}
