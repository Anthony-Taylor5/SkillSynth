import java.util.*;

public class Project {
    String projectName;
    List<Skill> requiredSkills;
    String projectDateRange;
    String description;

    public Project(String projectName, List<Skill> requiredSkills, String projectDateRange, String description) {
        this.projectName = projectName;
        this.requiredSkills = requiredSkills;
        this.projectDateRange = projectDateRange;
        this.description = description;
    }

    public String getProjectName() {
        return projectName;
    }

    public Skill getSpecificRequiredSkill(String requiredSkillName){
        for(Skill skill : requiredSkills){
            if(requiredSkillName.equals(skill.getName())){
                return skill;
            } else {
                return null;
            }
        }
        return null;

    }

    public List<Skill> getAllRequiredSkils() {
        return requiredSkills;
    }

    public String getProjectDateRange() {
        return projectDateRange;
    }

    public String getDescription() {
        return description;
    }

    public boolean setProjectName(String projectName) {
        this.projectName = projectName;
        return true;
    }

    public boolean setAllRequiredSkill(List<Skill> requiredSkills) {
        this.requiredSkills = requiredSkills;
        return true;
    }

    public boolean setProjectDateRange(String projectDateRange) {
        this.projectDateRange = projectDateRange;
        return true;
    }

    public boolean setDescription(String description) {
        this.description = description;
        return true;
    }




}
