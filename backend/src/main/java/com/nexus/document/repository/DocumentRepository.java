package com.nexus.document.repository;

import com.nexus.document.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    List<Document> findByWorkspaceId(UUID workspaceId);
    Optional<Document> findByWorkspaceIdAndFileName(UUID workspaceId, String fileName);
}
