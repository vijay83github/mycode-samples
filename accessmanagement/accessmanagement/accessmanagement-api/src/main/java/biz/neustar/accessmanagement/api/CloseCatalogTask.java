package biz.neustar.accessmanagement.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CloseCatalogTask {
    private String state = "3";
    @JsonProperty("u_action_taken")
    private String actionTaken = "All access removed";

    public String getActionTaken() {
        return actionTaken;
    }

    public void setActionTaken(String actionTaken) {
        this.actionTaken = actionTaken;
    }

    public String getWorkNotes() {
        return workNotes;
    }

    public void setWorkNotes(String workNotes) {
        this.workNotes = workNotes;
    }

    @JsonProperty("work_notes")
    private String workNotes = "All access removed";

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

}
