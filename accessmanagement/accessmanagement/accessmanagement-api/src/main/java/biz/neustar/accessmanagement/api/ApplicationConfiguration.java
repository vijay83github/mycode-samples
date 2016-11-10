package biz.neustar.accessmanagement.api;


public class ApplicationConfiguration {
    private String groupName;

    private String msgSuccessfulAccessRemoval;
    private String msgNexgenGroupRestriction;
    private String msgCanNotBeDeleted;
    private String msgCanNotBeRetrieved;
    private String msgNotFound;

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getMsgSuccessfulAccessRemoval() {
        return msgSuccessfulAccessRemoval;
    }

    public void setMsgSuccessfulAccessRemoval(String msgSuccessfulAccessRemoval) {
        this.msgSuccessfulAccessRemoval = msgSuccessfulAccessRemoval;
    }

    public String getMsgNexgenGroupRestriction() {
        return msgNexgenGroupRestriction;
    }

    public void setMsgNexgenGroupRestriction(String msgNexgenGroupRestriction) {
        this.msgNexgenGroupRestriction = msgNexgenGroupRestriction;
    }

    public String getMsgCanNotBeDeleted() {
        return msgCanNotBeDeleted;
    }

    public void setMsgCanNotBeDeleted(String msgCanNotBeDeleted) {
        this.msgCanNotBeDeleted = msgCanNotBeDeleted;
    }

    public String getMsgCanNotBeRetrieved() {
        return msgCanNotBeRetrieved;
    }

    public void setMsgCanNotBeRetrieved(String msgCanNotBeRetrieved) {
        this.msgCanNotBeRetrieved = msgCanNotBeRetrieved;
    }

    /**
     * @return the msgNotFound
     */
    public String getMsgNotFound() {
        return msgNotFound;
    }

    /**
     * @param msgNotFound the msgNotFound to set
     */
    public void setMsgNotFound(String msgNotFound) {
        this.msgNotFound = msgNotFound;
    }

}
