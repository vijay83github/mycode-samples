/**
 * 
 */
package biz.neustar.accessmanagement.util;

import static biz.neustar.accessmanagement.api.AccessManagementConstants.OPS_GET_CATALOG_TASKS;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import biz.neustar.accessmanagement.api.CatalogTask;
import biz.neustar.accessmanagement.api.QueryParam;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * This is the service now utility class.
 * 
 * @author Vijay.Gandhavale
 * 
 */
public final class ServicenowUtil {
    private static final Logger LOGGER = LoggerFactory.getLogger(ServicenowUtil.class);

    /**
     * default private empty constructor.
     */
    private ServicenowUtil() {
    }

    /**
     * This method checks JsonNode is empty or not.
     * 
     * @param records
     *            the JsonNode
     * @return boolean
     */
    public static boolean isEmpty(JsonNode records) {
        return records == null ? true : records.size() == 0;
    }

    /**
     * This method generates object mapper for given JSON String.
     * 
     * @param response
     *            the String
     * @param arrayName
     *            the String
     * @return JsonNode the JsonNode
     */
    public static JsonNode getJsonNode(String response, String arrayName) {
        LOGGER.info("inside getJsonNode arrayName :== {}", arrayName);
        JsonNode records = null;
        JsonNode actualObj = null;
        if (null != response) {
            ObjectMapper mapper = new ObjectMapper();
            JsonFactory factory = mapper.getFactory();
            JsonParser parser = null;
            try {
                parser = factory.createParser(response);
                actualObj = mapper.readTree(parser);
                if (arrayName != null) {
                    records = actualObj.get(arrayName);
                    LOGGER.info("records.size() :: {}", records.size());
                }
            } catch (JsonParseException e) {
                LOGGER.info("JsonParseException occured");
            } catch (JsonProcessingException e) {
                LOGGER.info("JsonProcessingException occured");
            } catch (IOException e) {
                LOGGER.info("IOException occured");
            }
        }
        return records == null ? actualObj : records;
    }

    /**
     * This method parse the JsonNode and return list of catalog tasks.
     * 
     * @param records
     *            the JsonNode
     * @return List of CatelogTask
     */
    @SuppressWarnings("unchecked")
    public static List<CatalogTask> parseTaskRecords(JsonNode records) {
        LOGGER.info("inside method parseTaskRecords");
        List<CatalogTask> catalogTasks = null;
        if (records != null) {
            catalogTasks = new ArrayList<>(records.size());
            Iterator<JsonNode> iterator = records.elements();
            while (iterator.hasNext()) {
                JsonNode recordsObj = iterator.next();
                CatalogTask catalogTask = new CatalogTask();
                String number = recordsObj.get("number").asText();
                LOGGER.info("catalog task number : {}", number);
                catalogTask.setNumber(number);
                JsonNode variables = recordsObj.get("variables");
                if (null != variables) {
                    getUserName(catalogTask, variables);
                }
                catalogTasks.add(catalogTask);
            }
        }
        return catalogTasks == null ? Collections.EMPTY_LIST : catalogTasks;
    }

    /**
     * Method returns userName from variables list.
     * 
     * @param catalogTask
     * @param variables
     */
    protected static void getUserName(CatalogTask catalogTask, JsonNode variables) {
        Iterator<JsonNode> variablesIterator = variables.elements();
        while (variablesIterator.hasNext()) {
            JsonNode childrenObj = variablesIterator.next();
            JsonNode childrens = childrenObj.get("children");
            Iterator<JsonNode> childrensIterator = childrens.elements();
            boolean breakOut = false;
            while (childrensIterator.hasNext()) {
                breakOut = false;
                JsonNode child = childrensIterator.next();
                if (child.get("name").asText().equals("user_name")) {
                    String userName = child.get("value").asText();
                    LOGGER.info("Got User Name : {} ", userName);
                    catalogTask.setUserName(userName);
                    breakOut = true;
                    break;
                }
            }
            if (breakOut) {
                break;
            }
        }
    }

    /**
     * Method returns catalog task's table name.
     * 
     * @param reqType
     *            the int
     * @return tableName the String
     */
    public static String getServiceNowTaskTableName(int reqType) {
        if (reqType == OPS_GET_CATALOG_TASKS) {
            return "sc_task_list.do";
        } else {
            return "sc_task.do";
        }
    }

    /**
     * Method builds query parameters for given inputs and return list of its.
     * 
     * @param catalogTaskId
     *            the String
     * @param hours
     *            the int
     * @param nexgenSupportGroupId
     *            the String
     * @return List<QueryParam> the list of QueryParam
     */
    public static List<QueryParam> setQueryParams(String catalogTaskId, int hours, String nexgenSupportGroupId) {
        List<QueryParam> queryParams = new ArrayList<>();
        if (catalogTaskId != null && !"".equals(catalogTaskId.trim())) {
            QueryParam queryParam = new QueryParam();
            queryParams.add(queryParam.withTaskNumber(catalogTaskId));
        }
        if (hours > 0) {
            QueryParam hoursQueryParam = new QueryParam();
            queryParams.add(hoursQueryParam.withLastHours(hours));
        }
        
        QueryParam assignmentgroup = new QueryParam();
        queryParams.add(assignmentgroup.withAssignedGroup(nexgenSupportGroupId));
        
        QueryParam statusQueryParam = new QueryParam();
        queryParams.add(statusQueryParam.withStatusActive("true"));

        QueryParam defaultQueryParam = new QueryParam();
        queryParams.add(defaultQueryParam.withItemName("Access Termination"));
        return queryParams;
    }

    /**
     * Builds query parameter string for sysparm_query request query parameter.
     * 
     * @param queryParams
     *            the List<QueryParam> - list of QueryParam
     * @return query string the String
     */
    public static String buildQueryParameters(List<QueryParam> queryParams) {
        if (queryParams != null) {
            StringBuilder stringBuilder = new StringBuilder();
            int count = 0;
            for (QueryParam queryParam : queryParams) {
                if (count > 0) {
                    stringBuilder.append("^");
                }
                stringBuilder.append(queryParam.getName()).append(queryParam.getOperand())
                        .append(queryParam.getValue());
                count++;
            }
            return stringBuilder.toString();
        }
        return null;
    }
}
