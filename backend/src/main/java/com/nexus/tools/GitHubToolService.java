package com.nexus.tools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GitHubToolService {

    private final RestTemplate restTemplate;

    public GitHubToolService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    @Tool(description = "Fetch open issues or pull requests from a public GitHub repository using the repository owner and name")
    public String fetchGitHubIssues(String owner, String repo) {
        String url = String.format("https://api.github.com/repos/%s/%s/issues?state=open&per_page=5", owner, repo);
        try {
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
            List<Map<String, Object>> issues = response.getBody();
            if (issues == null || issues.isEmpty()) {
                return "No open issues found for repository " + owner + "/" + repo + ".";
            }
            
            StringBuilder sb = new StringBuilder();
            sb.append("Top 5 Open Issues/PRs in ").append(owner).append("/").append(repo).append(":\n");
            int count = 1;
            for (Map<String, Object> issue : issues) {
                String title = (String) issue.get("title");
                Integer number = (Integer) issue.get("number");
                String htmlUrl = (String) issue.get("html_url");
                Map<String, Object> user = (Map<String, Object>) issue.get("user");
                String author = user != null ? (String) user.get("login") : "unknown";
                
                sb.append(count).append(". #").append(number).append(": ")
                  .append(title).append(" (By: ").append(author).append(")\n")
                  .append("   Link: ").append(htmlUrl).append("\n");
                count++;
            }
            return sb.toString();
        } catch (Exception e) {
            return "Failed to fetch issues for repository " + owner + "/" + repo + ". Error: " + e.getMessage();
        }
    }
}
