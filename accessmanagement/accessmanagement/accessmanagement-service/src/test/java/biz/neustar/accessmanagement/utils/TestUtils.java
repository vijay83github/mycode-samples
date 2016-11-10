/**
 * 
 */
package biz.neustar.accessmanagement.utils;

import biz.neustar.accessmanagement.AccessmanagementConfiguration;
import biz.neustar.dropwizard.test.ConfigurationLoader;

/**
 * This class provides different test utilities.
 * 
 * @author vijay.gandhavale
 * 
 */
public final class TestUtils {
    private TestUtils() {
        /*
         * Empty constructor
         */
    }

    public static String getTemplateDir() {
        return "templates";
    }

    public static AccessmanagementConfiguration getConfiguration() {
        AccessmanagementConfiguration config = ConfigurationLoader.getConfiguration(
                AccessmanagementConfiguration.class, "accessmanagement.yml");
        return config;
    }
    
    /*public static void main(String[] args) {
       ApplicationConfiguration appConfiguration = TestUtils.getConfiguration().getApplicationConfiguration();
        
        Map<String, List<String>> environments = TestUtils.getConfiguration().getEnvironments();
        for (Entry<String, List<String>> entry : environments.entrySet()) {
            System.out.println(entry.getKey());
            System.out.println(entry.getValue());
            
        }
    }*/
}
