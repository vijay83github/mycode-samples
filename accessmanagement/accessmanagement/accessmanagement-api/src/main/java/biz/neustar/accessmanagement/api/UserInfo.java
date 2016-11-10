package biz.neustar.accessmanagement.api;

import java.util.List;

public class UserInfo {
    private String userName;
    private String accessKeyId;
    private List<String> policyNames;
    private List<String> groupNames;
    private boolean loginProfile;
    private String groupName;
    private boolean nexgenGroupUser;

    public UserInfo() {
        super();
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAccessKeyId() {
        return accessKeyId;
    }

    public void setAccessKeyId(String accessKeyId) {
        this.accessKeyId = accessKeyId;
    }

    public List<String> getPolicyNames() {
        return policyNames;
    }

    public void setPolicyNames(List<String> policyNames) {
        this.policyNames = policyNames;
    }

    public List<String> getGroupNames() {
        return groupNames;
    }

    public void setGroupNames(List<String> groupNames) {
        this.groupNames = groupNames;
    }

    public void setLoginProfile(boolean loginProfile) {
        this.loginProfile = loginProfile;
    }

    public boolean getLoginProfile() {
        return loginProfile;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public boolean isNexgenGroupUser() {
        return nexgenGroupUser;
    }

    public void setNexgenGroupUser(boolean nexgenGroupUser) {
        this.nexgenGroupUser = nexgenGroupUser;
    }

}
