/**
 * 
 */
package biz.neustar.accessmanagement.validator;

import org.apache.http.HttpStatus;

import biz.neustar.accessmanagement.api.Status;

import com.google.common.base.Strings;

/**
 * This class validates input and output parameters for Service Now.
 * 
 * @author Vijay.Gandhavale
 * 
 */
public final class ServicenowValidator {
    private static final String EMPTY_MSG = "%s should not be blank.";
    private static final String USERNAME_PATTERN_MSG = "Username is not valid. "
            + "Username should be lowercase and alphabetic.";
    private static final String TASKID_PATTERN_MSG = "Taskid is not valid. "
            + "Taskid should be uppercase and alphanumeric.";

    private ServicenowValidator() {
    }

    public static void validateTaskId(Status validationStatus) {
        if (Strings.isNullOrEmpty(validationStatus.getCatalogTaskId())) {
            failureStatus(validationStatus, "CatalogTaskId", EMPTY_MSG);
        } else if (!validationStatus.getCatalogTaskId().matches("[A-Z0-9]*")) {
            failureStatus(validationStatus, validationStatus.getCatalogTaskId(), TASKID_PATTERN_MSG);
        } else {
            successStatus(validationStatus);
        }
    }

    public static void validateUserName(Status validationStatus) {
        if (Strings.isNullOrEmpty(validationStatus.getUserName())) {
            failureStatus(validationStatus, "UserName", EMPTY_MSG);
        } else if (!validationStatus.getUserName().matches("[a-z]*")) {
            failureStatus(validationStatus, validationStatus.getUserName(), USERNAME_PATTERN_MSG);
        } else {
            successStatus(validationStatus);
        }
    }

    private static Status successStatus(Status validationStatus) {
        return validationStatus.withStatusCode(HttpStatus.SC_OK).withStatusDesc("Accepted");
    }

    private static Status failureStatus(Status validationStatus, String field, String msg) {
        return validationStatus.withStatusCode(HttpStatus.SC_BAD_REQUEST).withStatusDesc(String.format(msg, field));
    }
}
