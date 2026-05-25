package com.nexus.summary;

import java.util.List;

public record DocumentSummary(
    String title,
    String summary,
    List<String> keyPoints,
    String documentType,
    String estimatedReadTime
) {}
