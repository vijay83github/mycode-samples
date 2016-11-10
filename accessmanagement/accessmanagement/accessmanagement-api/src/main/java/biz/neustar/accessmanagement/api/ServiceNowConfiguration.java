package biz.neustar.accessmanagement.api;


public class ServiceNowConfiguration {
    private String userId;
    private String password;
    private String host;
    private String nexgenSupportGroupId;
    //private String msgCatalogTaskNotFound;
    private String msgOneCatalogTaskFound;
    private String msgCatalogTaskNotClosed;
    private String msgCatalogTaskClosed;
    private String msgNoCatalogTaskFound;
    private String msgManyCatalogTasksFound;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getNexgenSupportGroupId() {
        return nexgenSupportGroupId;
    }

    public void setNexgenSupportGroupId(String nexgenSupportGroupId) {
        this.nexgenSupportGroupId = nexgenSupportGroupId;
    }

    /*public String getMsgCatalogTaskNotFound() {
        return msgCatalogTaskNotFound;
    }

    public void setMsgCatalogTaskNotFound(String msgCatalogTaskNotFound) {
        this.msgCatalogTaskNotFound = msgCatalogTaskNotFound;
    }*/

    public String getMsgOneCatalogTaskFound() {
        return msgOneCatalogTaskFound;
    }

    public void setMsgOneCatalogTaskFound(String msgCatalogTaskFound) {
        this.msgOneCatalogTaskFound = msgCatalogTaskFound;
    }

    public String getMsgCatalogTaskNotClosed() {
        return msgCatalogTaskNotClosed;
    }

    public void setMsgCatalogTaskNotClosed(String msgCatalogTaskNotClosed) {
        this.msgCatalogTaskNotClosed = msgCatalogTaskNotClosed;
    }

    public String getMsgCatalogTaskClosed() {
        return msgCatalogTaskClosed;
    }

    public void setMsgCatalogTaskClosed(String msgCatalogTaskClosed) {
        this.msgCatalogTaskClosed = msgCatalogTaskClosed;
    }

    public String getMsgNoCatalogTaskFound() {
        return msgNoCatalogTaskFound;
    }

    public void setMsgNoCatalogTaskFound(String msgNoCatalogTaskFound) {
        this.msgNoCatalogTaskFound = msgNoCatalogTaskFound;
    }

    public String getMsgManyCatalogTasksFound() {
        return msgManyCatalogTasksFound;
    }

    public void setMsgManyCatalogTasksFound(String msgCatalogTasksFound) {
        this.msgManyCatalogTasksFound = msgCatalogTasksFound;
    }

}
