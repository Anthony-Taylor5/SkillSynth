package com.skillsynth;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToMany
    @JoinTable(
            name = "project_skills",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private List<Skill> recommendedSkills;

    private String dateRange;
    private String projectDescription;

    private int experienceLevel;

    // Constructors
    public Project(){}


    public Project(String name, List<Skill> recommendedSkills, String dateRange, String projectDescription, int experienceLevel) {
        this.name = name;
        this.recommendedSkills = recommendedSkills;
        this.dateRange = dateRange;
        this.projectDescription = projectDescription;
        this.experienceLevel = experienceLevel;
    }


    // Getters and Setters

    public Long getId(){ return id;}
    public void setId(Long id){ this.id = id;}

    public String getName(){ return name;}
    public void setName(String name){ this.name = name;}

    public List<Skill> getRecommendedSkills(){ return recommendedSkills;}

    public List<Skill> getSpecifcRecommendedSkills(int count){
        if(recommendedSkills.size() <= count){
            return recommendedSkills;
        } else {
            return recommendedSkills.subList(0, count);
        }
    }

    public Skill getSpecifcReccomendedSkill(int index){
        if(index < recommendedSkills.size()){
            return recommendedSkills.get(index);
        } else {
            return null;
        }
    }

    public void setRecommendedSkills(List<Skill> recommendedSkills){ this.recommendedSkills = recommendedSkills;}

    public String getDateRange(){ return dateRange;}
    public void setDateRange(String dateRange){ this.dateRange = dateRange;}

    public String getProjectDescription(){ return projectDescription;}
    public void setProjectDescription(String projectDescription){ this.projectDescription = projectDescription;}

    public int getExperienceLevel(){ return experienceLevel;}
    public void setExperienceLevel(int experienceLevel){ this.experienceLevel = experienceLevel;}

}
