package biz.neustar.accessmanagement.v1.client;

import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import biz.neustar.accessmanagement.api.Status;
import biz.neustar.dropwizard.client.BaseClient;
import biz.neustar.dropwizard.client.ClientConfiguration;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.client.WebResource;

public class AccessManagementClient extends BaseClient<ClientConfiguration> {
    private final Logger logger = LoggerFactory.getLogger(AccessManagementClient.class);
    
    
    public AccessManagementClient(ClientConfiguration clientConfig) {
        super(clientConfig);
    }

    

    public void testClient(String serviceRecordId) {
        try {
            Client client = Client.create();
            URI uri = getIncidentManagmentURI(serviceRecordId);
            logger.info("uri:===" + uri.toString());
            WebResource webResource = client.resource(uri);
           // webResource.type(MediaType.APPLICATION_JSON);
            Status status = webResource.get(Status.class);
            //Status status = clientResponse.getEntity(Status.class);
            logger.info("status code :==" + status.getStatusCode());
            logger.info("status desc :==" + status.getStatusDesc());
            logger.info("error desc :==" + status.getCatalogTaskId());
            logger.info("error code :==" + status.getUserName());
        } catch (UniformInterfaceException e) {
            logger.info("UniformInterfaceException occured");
        } catch (ClientHandlerException e) {
            logger.info("ClientHandlerException occured");
        }

    }

    private URI getIncidentManagmentURI(String serviceRecordId) {
        UriBuilder uriBuilder = UriBuilder.fromUri("http://localhost:8080/accessmgmt/");
        uriBuilder.path("disableAllUsers");
        return uriBuilder.build();
    }

}
