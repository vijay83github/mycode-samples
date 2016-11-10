/**
 * 
 */
package biz.neustar.accessmanagement.resource;

import java.util.List;

import org.apache.http.HttpStatus;
import org.junit.Assert;
import org.junit.Test;

import biz.neustar.accessmanagement.AccessmanagementConfiguration;
import biz.neustar.accessmanagement.api.Status;
import biz.neustar.accessmanagement.utils.TestUtils;

import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;
import com.yammer.dropwizard.testing.ResourceTest;

/**
 * This is the test class for biz.neustar.accessmanagement.resource.CatalogTaskResource.
 * 
 * @author vijay.gandhavale
 * 
 */
public class CatalogTaskResourceTest extends ResourceTest {
    private final AccessmanagementConfiguration config = TestUtils.getConfiguration();

    /*
     * (non-Javadoc)
     * 
     * @see com.yammer.dropwizard.testing.ResourceTest#setUpResources()
     */
    @Override
    protected void setUpResources() throws Exception {
        addResource(new CatalogTaskResource(config));
    }

    @Test
    public void testDisableUser() {
        Status status = this.client()
                .resource("/accessmgmt/disableUser?catalogTaskId=TASK12345").get(Status.class);
        Assert.assertEquals(HttpStatus.SC_NO_CONTENT, status.getStatusCode());

    }

    @Test
    public void testDisableUserInValidData() {
        Status status = this.client()
                .resource("/accessmgmt/disableUser?catalogTaskId=TASK@12345")
                .get(Status.class);
        Assert.assertEquals(HttpStatus.SC_BAD_REQUEST, status.getStatusCode());

    }

    @Test
    public void testDisableUsersForLastTwoHour() {
        ClientResponse response = this.client()
                .resource("/accessmgmt/disableUsersForLastTwoHour").get(ClientResponse.class);
        List<Status> statusList = response.getEntity(new GenericType<List<Status>>() {
        });
        Assert.assertEquals(HttpStatus.SC_NO_CONTENT, statusList.get(0).getStatusCode());
    }
    
    @Test
    public void testDisableAllUsers() {
        ClientResponse response = this.client()
                .resource("/accessmgmt/disableAllUsers").get(ClientResponse.class);
        List<Status> statusList = response.getEntity(new GenericType<List<Status>>() {
        });
        Assert.assertEquals(HttpStatus.SC_NO_CONTENT, statusList.get(0).getStatusCode());
    }
    
    @Test
    public void testHealthCheck() {
        String response = this.client()
                .resource("/accessmgmt/healthCheck").get(String.class);
        Assert.assertEquals("OK", response);
    }
    
}
