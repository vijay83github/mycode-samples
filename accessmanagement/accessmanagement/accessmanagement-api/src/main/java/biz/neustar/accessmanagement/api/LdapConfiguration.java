/**
 * 
 */
package biz.neustar.accessmanagement.api;

/**
 * This is ldap configuration class.
 * @author Vijay.Gandhavale
 *
 */
public class LdapConfiguration {
    private String bindingAccount;
    private String password;
    private String host;
    private String searchBase;
    private String userAttribute;
    
    public String getBindingAccount() {
        return bindingAccount;
    }
    public void setBindingAccount(String userId) {
        this.bindingAccount = userId;
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
    public String getSearchBase() {
        return searchBase;
    }
    public void setSearchBase(String searchBase) {
        this.searchBase = searchBase;
    }
    public String getUserAttribute() {
        return userAttribute;
    }
    public void setUserAttribute(String userAttribute) {
        this.userAttribute = userAttribute;
    }
}
