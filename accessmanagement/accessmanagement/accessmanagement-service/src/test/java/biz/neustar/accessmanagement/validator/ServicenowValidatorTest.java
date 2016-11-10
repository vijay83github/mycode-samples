/**
 * 
 */
package biz.neustar.accessmanagement.validator;

import org.apache.http.HttpStatus;
import org.junit.Assert;
import org.junit.Test;

import biz.neustar.accessmanagement.api.Status;

/**
 * Test class for biz.neustar.accessmanagement.validator.ServicenowValidator.
 * 
 * @author vijay.gandhavale
 * 
 */
public class ServicenowValidatorTest {

    @Test
    public final void testValidateTaskId() {
        Status validationStatus = new Status();
        validationStatus.setCatalogTaskId("TASK12345@");
        ServicenowValidator.validateTaskId(validationStatus);
        Assert.assertEquals(HttpStatus.SC_BAD_REQUEST, validationStatus.getStatusCode());
        validationStatus.setCatalogTaskId("TASK12345");
        ServicenowValidator.validateTaskId(validationStatus);
        Assert.assertEquals(HttpStatus.SC_OK, validationStatus.getStatusCode());
        validationStatus.setCatalogTaskId(null);
        ServicenowValidator.validateTaskId(validationStatus);
        Assert.assertEquals(HttpStatus.SC_BAD_REQUEST, validationStatus.getStatusCode());
    }

    @Test
    public final void testValidateTaskIdFailure() {
        Status validationStatus = new Status();
        validationStatus.setCatalogTaskId("TASK12345@");
        ServicenowValidator.validateTaskId(validationStatus);
        Assert.assertNotEquals(HttpStatus.SC_OK, validationStatus.getStatusCode());
        validationStatus.setCatalogTaskId("TASK12345");
        ServicenowValidator.validateTaskId(validationStatus);
        Assert.assertNotEquals(HttpStatus.SC_BAD_REQUEST, validationStatus.getStatusCode());
        validationStatus.setCatalogTaskId(null);
        ServicenowValidator.validateTaskId(validationStatus);
        Assert.assertNotEquals(HttpStatus.SC_INTERNAL_SERVER_ERROR, validationStatus.getStatusCode());
    }

    @Test
    public final void testValidateUserName() {
        Status validationStatus = new Status();
        ServicenowValidator.validateUserName(validationStatus);
        Assert.assertEquals(HttpStatus.SC_BAD_REQUEST, validationStatus.getStatusCode());
        validationStatus.setUserName("abcd");
        ServicenowValidator.validateUserName(validationStatus);
        Assert.assertEquals(HttpStatus.SC_OK, validationStatus.getStatusCode());
        validationStatus.setUserName("abcd1234");
        ServicenowValidator.validateUserName(validationStatus);
        Assert.assertEquals(HttpStatus.SC_BAD_REQUEST, validationStatus.getStatusCode());
    }

    @Test
    public final void testValidateUserNameFailure() {
        Status validationStatus = new Status();
        ServicenowValidator.validateUserName(validationStatus);
        Assert.assertNotEquals(HttpStatus.SC_OK, validationStatus.getStatusCode());
    }

}
