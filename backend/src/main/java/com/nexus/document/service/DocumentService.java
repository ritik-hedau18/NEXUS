package com.nexus.document.service;

import com.nexus.auth.model.User;
import com.nexus.document.model.Document;
import com.nexus.document.repository.DocumentRepository;
import com.nexus.workspace.model.Workspace;
import com.nexus.workspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final WorkspaceRepository workspaceRepository;
    private final DocumentIngestionService documentIngestionService;

    public DocumentService(DocumentRepository documentRepository,
                           WorkspaceRepository workspaceRepository,
                           DocumentIngestionService documentIngestionService) {
        this.documentRepository = documentRepository;
        this.workspaceRepository = workspaceRepository;
        this.documentIngestionService = documentIngestionService;
    }

    public List<Document> getDocumentsByWorkspace(UUID workspaceId) {
        return documentRepository.findByWorkspaceId(workspaceId);
    }

    @Transactional
    public Document uploadDocument(UUID workspaceId, MultipartFile file, User uploader) throws IOException {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found with ID: " + workspaceId));

        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isEmpty()) {
            throw new IllegalArgumentException("Filename cannot be empty");
        }

        // Deduplication/replacement: check if document with same filename already exists in workspace
        Optional<Document> existingDocOpt = documentRepository.findByWorkspaceIdAndFileName(workspaceId, fileName);
        
        Document doc;
        if (existingDocOpt.isPresent()) {
            doc = existingDocOpt.get();
            // Delete old vectors in Qdrant before re-ingestion
            documentIngestionService.deleteDocumentVectors(doc);
            
            // Reset status and metadata
            doc.setStatus("PROCESSING");
            doc.setChunkCount(0);
            doc.setUploadedBy(uploader);
            doc = documentRepository.save(doc);
        } else {
            // Create new record
            String fileType = extractFileType(fileName);
            doc = Document.builder()
                    .workspace(workspace)
                    .fileName(fileName)
                    .fileType(fileType)
                    .status("PROCESSING")
                    .chunkCount(0)
                    .uploadedBy(uploader)
                    .build();
            doc = documentRepository.save(doc);
        }

        // Trigger background ingestion
        documentIngestionService.ingestDocument(doc, file.getBytes());

        return doc;
    }

    @Transactional
    public void deleteDocument(UUID docId) {
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with ID: " + docId));

        // Delete vectors from Qdrant
        documentIngestionService.deleteDocumentVectors(doc);

        // Delete record from database
        documentRepository.delete(doc);
    }

    private String extractFileType(String fileName) {
        int lastIndex = fileName.lastIndexOf('.');
        if (lastIndex == -1) {
            return "TXT";
        }
        String extension = fileName.substring(lastIndex + 1).toUpperCase();
        if (extension.equals("PDF") || extension.equals("DOCX") || extension.equals("TXT")) {
            return extension;
        }
        return "TXT"; // Fallback to TXT
    }
}
