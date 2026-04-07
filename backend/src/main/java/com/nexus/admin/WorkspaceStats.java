package com.nexus.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkspaceStats {
    private long totalDocuments;
    private long readyDocuments;
    private long processingDocuments;
    private long failedDocuments;
    private long totalChatMessages;
    private long memberCount;
}
