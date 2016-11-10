package biz.neustar.accessmanagement.helper;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import biz.neustar.accessmanagement.api.LdapConfiguration;
import biz.neustar.accessmanagement.utils.TestUtils;

public class LdapHelperTest {

    private LdapHelper ldapHelper = null;
    private final Logger logger = LoggerFactory.getLogger(LdapHelperTest.class);
    private LdapConfiguration ldapConfiguration = TestUtils.getConfiguration().getLdapConfiguration();

    @Before
    public void before() {
        ldapHelper = new LdapHelper(ldapConfiguration);
    }

    @Test
    public final void testLdapHelper() {
        ldapHelper = new LdapHelper(ldapConfiguration);
        logger.info("ldapHelper : {}", ldapHelper);
        assertNotNull(ldapHelper);
    }

    @Test
    public final void testRetrieveUserByUsername() {
        LdapHelper ldapHelper1 = mock(LdapHelper.class);
        when(ldapHelper1.retrieveUserByUsername("jshawn")).thenReturn("jason.shawn@neustar.biz");
        String email = ldapHelper1.retrieveUserByUsername("jshawn");
        assertEquals("jason.shawn@neustar.biz", email);

    }

   /* @Test
    public final void testRetrieveUserByUsername1() {
        String email = ldapHelper.retrieveUserByUsername("tna");
        System.out.println("Email:=" + email);
        assertEquals("", email);

    }*/

}
