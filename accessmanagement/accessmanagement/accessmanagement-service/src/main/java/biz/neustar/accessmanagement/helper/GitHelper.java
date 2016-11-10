package biz.neustar.accessmanagement.helper;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.ws.rs.core.UriBuilder;

import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import biz.neustar.accessmanagement.api.GitConfiguration;
import biz.neustar.accessmanagement.api.Status;
import biz.neustar.accessmanagement.util.ServicenowUtil;

import com.fasterxml.jackson.databind.JsonNode;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.UniformInterfaceException;

public class GitHelper {
    private final Logger logger = LoggerFactory.getLogger(GitHelper.class);
    private static final String ID = "id";
    private static final String RETRIEVE_USER = "/users";
    private static final String DELETE_KEY = "/users/%s/keys/%s";
    private static final String LIST_USER_KEYS = "/users/%s/keys";
    private final GitConfiguration configuration;
    private final Client client;

    public GitHelper(GitConfiguration config) {
        this.configuration = config;
        client = Client.create();
    }

    /**
     * Returns git user json record.
     * 
     * @param status
     *            the Status
     * @return userJson the String
     */
    protected String retrieveUser(Status status) {
        String userJson = "[]";
        logger.info("inside retrieveUser method userName = {}", status.getUserName());
        UriBuilder uriBuilder = buildURI();
        uriBuilder.path(RETRIEVE_USER);
        uriBuilder.queryParam("search", status.getEmail().equals("") ? status.getUserName() : status.getEmail());
        logger.info("uri : = {}", uriBuilder.build().toString());
        ClientResponse clientResponse = client.resource(uriBuilder.build()).get(ClientResponse.class);
        logger.info("clientResponse.getStatus() : = {}", clientResponse.getStatus());
        status.setStatusCode(clientResponse.getStatus());
        if (clientResponse.getStatus() == HttpStatus.SC_OK) {
            userJson = clientResponse.getEntity(String.class);
        } else {
            status.withStatusDesc(clientResponse.getClientResponseStatus().getReasonPhrase());
        }
        return userJson;
    }

    /**
     * Returns userId for given userName.
     * 
     * @param userJson
     *            the String
     * @return id the String
     */
    protected String getUserIdByUserName(String userJson) {
        logger.info("inside getUserIdByUserName method userJson = {}", userJson);
        if (null != userJson) {
            JsonNode jsonNode = ServicenowUtil.getJsonNode(userJson, null);
            Iterator<JsonNode> recordIterator = jsonNode.iterator();
            while (recordIterator.hasNext()) {
                JsonNode record = recordIterator.next();
                if (null != record) {
                    JsonNode idJsonNode = record.get(ID);
                    if (idJsonNode != null) {
                        String id = idJsonNode.asText();
                        logger.info("id = {}", id);
                        return id;
                    }
                }
            }
        }
        return null;
    }

    /**
     * Parse sshKeyJson data for a user and returns list of ssh key id.
     * 
     * @param userJson
     *            the String
     * @return List of sshKeyIds
     */
    protected List<String> parseId(String userJson) {
        logger.info("inside parseId method");
        JsonNode jsonNode = ServicenowUtil.getJsonNode(userJson, null);
        if (!ServicenowUtil.isEmpty(jsonNode)) {
            List<String> sshKeyList = new ArrayList<>(jsonNode.size());
            Iterator<JsonNode> recordIterator = jsonNode.iterator();
            while (recordIterator.hasNext()) {
                JsonNode sshKeyJsonNode = recordIterator.next();
                if (sshKeyJsonNode != null) {
                    JsonNode idJsonNode = sshKeyJsonNode.get(ID);
                    if (null != idJsonNode) {
                        String id = idJsonNode.asText();
                        logger.info("sshKeyId = {}", id);
                        sshKeyList.add(id);
                    }
                }
            }
            return sshKeyList;
        }
        return null;
    }

    /**
     * Deletes ssh keys for given user.
     * 
     * @param status
     *            the Status
     * @return boolean
     */
    public boolean deleteUserKeys(Status status) {
        logger.info("inside deleteUserKeys method userName = {}", status.getUserName());
        boolean flag = false;
        String userJson = retrieveUser(status);
        logger.info("userJson :: {}", userJson);
        logger.info("status.getStatusCode() :: {}", status.getStatusCode());
        if (status.getStatusCode() == HttpStatus.SC_OK) {
            String userId = getUserIdByUserName(userJson);
            if (null != userId) {
                List<String> listUserKeys = listUserKeys(status, userId);
                if (null != listUserKeys && !listUserKeys.isEmpty()) {
                    deleteKeys(userId, listUserKeys);
                    flag = true;
                    status.withStatusDesc(String.format(configuration.getMsgSshKeysDeleted(), status.getUserName()));
                } else {
                    status.withStatusDesc(String.format(configuration.getMsgNoSshKeysFound(), status.getUserName()));
                }
            } else {
                status.withStatusDesc(String.format(configuration.getMsgNoUserFound(), status.getUserName()));
            }
        }
        return flag;
    }

    protected int deleteKeys(String userId, List<String> listUserKeys) {
        int count = 0;
        for (String sshKey : listUserKeys) {
            UriBuilder uriBuilder = buildURI();
            uriBuilder.path(String.format(DELETE_KEY, userId, sshKey));
            ClientResponse clientResponse = client.resource(uriBuilder.build()).delete(ClientResponse.class);
            if (clientResponse.getStatus() == HttpStatus.SC_OK) {
                logger.info("ssh key deleted userId '{}' and sshKeyId '{}'", userId, sshKey);
            }
            count++;
        }
        return count;
    }

    /**
     * Returns list of user ssh keys.
     * 
     * @param status
     *            the Status
     * @param userId
     *            the String
     * @return the list of ssh key id.
     */
    protected List<String> listUserKeys(Status status, String userId) {
        logger.info("inside listUserKeys method userName = {} and userId = {}", status.getUserName(), userId);
        UriBuilder uriBuilder = buildURI();
        uriBuilder.path(String.format(LIST_USER_KEYS, userId));
        ClientResponse clientResponse = client.resource(uriBuilder.build()).get(ClientResponse.class);
        try {
            if (clientResponse.getStatus() == HttpStatus.SC_OK) {
                String userSSHKeysJson = clientResponse.getEntity(String.class);
                System.out.println(userSSHKeysJson);
                return parseId(userSSHKeysJson);
            } else {
                status.setStatusCode(clientResponse.getStatus());
                status.withStatusDesc(clientResponse.getClientResponseStatus().getReasonPhrase());
            }
        } catch (ClientHandlerException | UniformInterfaceException e) {
            logger.error("Exception occured!", e);
        }
        return null;
    }

    /**
     * Returns uriBuilder as UriBuilder.
     * 
     * @return uriBuilder the UriBuilder
     */
    protected UriBuilder buildURI() {
        logger.info("inside buildURI method");
        UriBuilder uriBuilder = UriBuilder.fromUri(configuration.getHost());
        uriBuilder.queryParam("private_token", configuration.getPrivateToken());
        logger.info("URI :== {}", uriBuilder.build().toString());
        return uriBuilder;
    }
}
