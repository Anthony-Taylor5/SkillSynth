package com.skillsynth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface SkillSynthProjectRepository extends JpaRepository<Project, Long>{

    // Custom query methods for Projects
    Optional<Project> findByName(String name);

    List<Project> findByExperienceLevelGreaterThan(int level);

}