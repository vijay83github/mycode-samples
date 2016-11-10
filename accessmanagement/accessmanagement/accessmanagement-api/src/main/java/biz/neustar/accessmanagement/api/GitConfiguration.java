package biz.neustar.accessmanagement.api;


public class GitConfiguration {
    private String host;
    private String privateToken;
    private String msgNoUserFound;
    private String msgNoSshKeysFound;
    private String msgSshKeysDeleted;


    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getPrivateToken() {
        return privateToken;
    }

    public void setPrivateToken(String privateToken) {
        this.privateToken = privateToken;
    }

    public String getMsgNoUserFound() {
        return msgNoUserFound;
    }

    public void setMsgNoUserFound(String msgNoUserFound) {
        this.msgNoUserFound = msgNoUserFound;
    }

    public String getMsgNoSshKeysFound() {
        return msgNoSshKeysFound;
    }

    public void setMsgNoSshKeysFound(String msgNoSshKeysFound) {
        this.msgNoSshKeysFound = msgNoSshKeysFound;
    }

    public String getMsgSshKeysDeleted() {
        return msgSshKeysDeleted;
    }

    public void setMsgSshKeysDeleted(String msgSshKeysDeleted) {
        this.msgSshKeysDeleted = msgSshKeysDeleted;
    }
}
