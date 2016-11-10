package biz.neustar.accessmanagement.api;

import java.util.ArrayList;
import java.util.List;

public class Status {
    private String userName = "";
    private String email = "";
    private String catalogTaskId  = "";
    private int statusCode;
    private List<String> statusDesc;
    private static final int SC_OK = 200;

    public Status() {
        this.statusCode = SC_OK;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public List<String> getStatusDesc() {
        if (statusDesc == null) {
            statusDesc = new ArrayList<>();
        }
        return statusDesc;
    }

    public void setStatusDesc(List<String> statusDesc) {
        this.statusDesc = statusDesc;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String errorCode) {
        this.userName = errorCode;
    }

    public String getCatalogTaskId() {
        return catalogTaskId;
    }

    public void setCatalogTaskId(String catalogTaskId) {
        this.catalogTaskId = catalogTaskId;
    }

    public Status withStatusCode(int statCode) {
        setStatusCode(statCode);
        return this;
    }

    public Status withStatusDesc(String statDesc) {
        getStatusDesc().add(statDesc);
        return this;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
