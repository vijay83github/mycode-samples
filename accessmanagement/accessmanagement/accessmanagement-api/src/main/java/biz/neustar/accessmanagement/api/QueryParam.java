package biz.neustar.accessmanagement.api;

public class QueryParam {
    private String name;
    private String value;
    private String operand;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getOperand() {
        return operand;
    }

    public void setOperand(String operand) {
        this.operand = operand;
    }

    public QueryParam withLastHours(int hours) {
        setName("sys_created_on");
        setOperand("ON");
        if (hours == 1) {
            setValue(String.format("Last hour@javascript:gs.hoursAgoStart(%d)@javascript:gs.hoursAgoEnd(%d)", hours,
                    hours));
        } else if (hours > 1) {
            setValue(String.format("Last %d hour@javascript:gs.hoursAgoStart(%d)@javascript:gs.hoursAgoEnd(0)", hours,
                    hours));
            //setValue("sys_created_onONToday@javascript:gs.daysAgoStart(0)@javascript:gs.daysAgoEnd(0)");
        }
        return this;
    }
    

    public QueryParam withStatusActive(String taskStatus) {
        setName("active");
        setOperand("=");
        setValue(taskStatus);
        return this;
    }
    
    public QueryParam withTaskNumber(String taskNumber) {
        setName("number");
        setOperand("=");
        setValue(taskNumber);
        return this;
    }

    public QueryParam withAssignedGroup(String assignedGroup) {
        setName("assignment_group");
        setOperand("=");
        setValue(assignedGroup);
        return this;
    }

    public QueryParam withItemName(String itemName) {
        setName("request_item.cat_item.name");
        setOperand("STARTSWITH");
        setValue(itemName);
        return this;
    }

}
