package com.nexus.workspace.repository;

import com.nexus.workspace.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {
    
    @Query("SELECT DISTINCT w FROM Workspace w LEFT JOIN w.members m WHERE w.owner.id = :userId OR m.id = :userId")
    List<Workspace> findAllByUserId(@Param("userId") UUID userId);
}
