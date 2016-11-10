package biz.neustar.accessmanagement.helper;

import java.util.Hashtable;

import javax.naming.AuthenticationException;
import javax.naming.AuthenticationNotSupportedException;
import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.InitialLdapContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import biz.neustar.accessmanagement.api.LdapConfiguration;

public class LdapHelper {
    private final LdapConfiguration ldapConfiguration;
    private final Logger logger = LoggerFactory.getLogger(LdapHelper.class);

    public LdapHelper(LdapConfiguration ldapConfiguration) {
        this.ldapConfiguration = ldapConfiguration;
    }

    public String retrieveUserByUsername(String userName) {
        logger.info("Inside method retrieveUserByUsername user name :: {}", userName);
        String email = "";
        try {
            InitialLdapContext ctx = new InitialLdapContext(buildLdapEnvProperties(), null);
            logger.info("LDAP connected");
            SearchControls controls = new SearchControls();
            controls.setSearchScope(SearchControls.SUBTREE_SCOPE);
            NamingEnumeration<SearchResult> enumeration = ctx.search(ldapConfiguration.getSearchBase(),
                    String.format(ldapConfiguration.getUserAttribute(), userName), controls);

            while (enumeration.hasMoreElements()) {
                SearchResult searchResult = (SearchResult) enumeration.nextElement();
                logger.info("a ==" + searchResult.getName());
                Attributes attributes = searchResult.getAttributes();
                logger.info("attributes :=  " + attributes);
                Attribute attribute = attributes.get("mail");
                email = attribute != null ? (String) attribute.get() : "";
                logger.info("email := {}" , email);
            }
            ctx.close();
        } catch (AuthenticationNotSupportedException ex) {
            logger.info("The authentication is not supported by the server!!!!");

            logger.error("AuthenticationNotSupportedException occured !!!", ex);
        } catch (AuthenticationException ex) {
            logger.info("Incorrect password or username!!!!");

            logger.error("AuthenticationException occured !!!", ex);
        } catch (NamingException ex) {
            logger.info("Error when trying to create the context!!!");

            logger.error("NamingException occured", ex);
        }
        logger.info("Exit from method retrieveUserByUsername email :: {}", email);
        return email;
    }

    protected Hashtable<String, String> buildLdapEnvProperties() {
        Hashtable<String, String> env = new Hashtable<String, String>();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
        env.put(Context.PROVIDER_URL, ldapConfiguration.getHost());
        env.put(Context.SECURITY_PROTOCOL, "ssl");
        env.put(Context.SECURITY_AUTHENTICATION, "simple");
        env.put(Context.SECURITY_PRINCIPAL, ldapConfiguration.getBindingAccount());
        env.put(Context.SECURITY_CREDENTIALS, ldapConfiguration.getPassword());
        return env;
    }

}
