# ⚡ NEXUS (Neural Enterprise Knowledge Unification System) — AI-Powered Workspace Intelligence Platform

> Upload documents. Chat with them. Search semantically. Get AI summaries. All within secure, multi-member workspaces.

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen?style=flat-square&logo=springboot)
![Spring AI](https://img.shields.io/badge/Spring%20AI-1.0.0-green?style=flat-square&logo=spring)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20Store-red?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)

---

## Architecture

<svg width="100%" viewBox="0 0 680 496" xmlns="http://www.w3.org/2000/svg" style="">
<rect width="680" height="496" fill="#0d1117" rx="12" style="fill:rgb(13, 17, 23);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<defs>
  <marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M2 1L8 5L2 9" fill="none" stroke="#4b5563" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
  <marker id="ao" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M2 1L8 5L2 9" fill="none" stroke="#d97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
  <marker id="ab" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M2 1L8 5L2 9" fill="none" stroke="#1d4ed8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
</defs>

<!-- Title -->
<text x="340" y="26" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="700" fill="#f9fafb" letter-spacing="3" style="fill:rgb(249, 250, 251);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:20px;font-weight:700;text-anchor:middle;dominant-baseline:auto">NEXUS</text>
<text x="340" y="42" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#4b5563" letter-spacing="1.5" style="fill:rgb(75, 85, 99);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:auto">SPRING AI · RAG · GROQ LLAMA 3.3-70b · QDRANT · REACT 19 · JWT · POSTGRESQL</text>

<!-- Client / User -->
<rect x="265" y="52" width="150" height="32" rx="8" fill="#161b22" stroke="#30363d" stroke-width="1" style="fill:rgb(22, 27, 34);stroke:rgb(48, 54, 61);color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="340" y="68" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#8b949e" dominant-baseline="central" style="fill:rgb(139, 148, 158);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:13px;font-weight:400;text-anchor:middle;dominant-baseline:central">Client / User</text>

<!-- Arrow Client → React -->
<line x1="340" y1="84" x2="340" y2="100" stroke="#30363d" stroke-width="1.5" marker-end="url(#a)" style="fill:rgb(0, 0, 0);stroke:rgb(48, 54, 61);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>

<!-- React Frontend -->
<rect x="148" y="102" width="384" height="52" rx="10" fill="#1a103d" stroke="#7c3aed" stroke-width="1.5" style="fill:rgb(26, 16, 61);stroke:rgb(124, 58, 237);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="340" y="120" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="600" fill="#a78bfa" dominant-baseline="central" style="fill:rgb(167, 139, 250);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:14px;font-weight:600;text-anchor:middle;dominant-baseline:central">React Frontend</text>
<text x="340" y="140" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#5b21b6" dominant-baseline="central" style="fill:rgb(91, 33, 182);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:central">Vite · TypeScript · Tailwind CSS · shadcn/ui · React Router v7</text>

<!-- Arrow React → Backend -->
<line x1="340" y1="154" x2="340" y2="170" stroke="#30363d" stroke-width="1.5" marker-end="url(#a)" style="fill:rgb(0, 0, 0);stroke:rgb(48, 54, 61);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="356" y="164" font-family="system-ui,sans-serif" font-size="10" fill="#4b5563" dominant-baseline="central" style="fill:rgb(75, 85, 99);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:start;dominant-baseline:central">HTTP / SSE</text>

<!-- Spring Boot Container -->
<rect x="18" y="172" width="644" height="150" rx="10" fill="#0a1628" stroke="#1d4ed8" stroke-width="1.5" style="fill:rgb(10, 22, 40);stroke:rgb(29, 78, 216);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="340" y="190" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="600" fill="#3b82f6" dominant-baseline="central" style="fill:rgb(59, 130, 246);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:14px;font-weight:600;text-anchor:middle;dominant-baseline:central">Spring Boot Backend · :8080</text>
<text x="340" y="206" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e40af" dominant-baseline="central" style="fill:rgb(30, 64, 175);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:central">Spring Security 6 · JWT · Spring AI 1.0 · Spring WebFlux · Async Executor</text>

<!-- Row A -->
<rect x="28" y="216" width="147" height="38" rx="6" fill="#061820" stroke="#0e7490" stroke-width="1" style="fill:rgb(6, 24, 32);stroke:rgb(14, 116, 144);color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="101" y="229" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#22d3ee" dominant-baseline="central" style="fill:rgb(34, 211, 238);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:12px;font-weight:600;text-anchor:middle;dominant-baseline:central">Auth</text>
<text x="101" y="246" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#0e7490" dominant-baseline="central" style="fill:rgb(14, 116, 144);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:central">JWT · Spring Security</text>

<rect x="185" y="216" width="147" height="38" rx="6" fill="#061820" stroke="#0e7490" stroke-width="1" style="fill:rgb(6, 24, 32);stroke:rgb(14, 116, 144);color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="258" y="229" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#22d3ee" dominant-baseline="central" style="fill:rgb(34, 211, 238);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:12px;font-weight:600;text-anchor:middle;dominant-baseline:central">Workspace</text>
<text x="258" y="246" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#0e7490" dominant-baseline="central" style="fill:rgb(14, 116, 144);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:central">Multi-tenant · RBAC</text>

<rect x="342" y="216" width="147" height="38" rx="6" fill="#061a0c" stroke="#15803d" stroke-width="1" style="fill:rgb(6, 26, 12);stroke:rgb(21, 128, 61);color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="415" y="229" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#4ade80" dominant-baseline="central" style="fill:rgb(74, 222, 128);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:12px;font-weight:600;text-anchor:middle;dominant-baseline:central">Document</text>
<text x="415" y="246" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#15803d" dominant-baseline="central" style="fill:rgb(21, 128, 61);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:central">Tika · Async Ingest</text>

<rect x="499" y="216" width="147" height="38" rx="6" fill="#1a0e00" stroke="#b45309" stroke-width="1" style="fill:rgb(26, 14, 0);stroke:rgb(180, 83, 9);color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="572" y="229" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#fbbf24" dominant-baseline="central" style="fill:rgb(251, 191, 36);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:12px;font-weight:600;text-anchor:middle;dominant-baseline:central">Chat · RAG</text>
<text x="572" y="246" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#b45309" dominant-baseline="central" style="fill:rgb(180, 83, 9);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:central">SSE · Memory</text>

<!-- Row B -->
<rect x="28" y="264" width="147" height="38" rx="6" fill="#061a0c" stroke="#15803d" stroke-width="1" style="fill:rgb(6, 26, 12);stroke:rgb(21, 128, 61);color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="101" y="277" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#4ade80" dominant-baseline="central" style="fill:rgb(74, 222, 128);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:12px;font-weight:600;text-anchor:middle;dominant-baseline:central">Search</text>
<text x="101" y="294" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#15803d" dominant-baseline="central" style="fill:rgb(21, 128, 61);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:central">Semantic · Qdrant</text>

<rect x="185" y="264" width="147" height="38" rx="6" fill="#1a0e00" stroke="#b45309" stroke-width="1" style="fill:rgb(26, 14, 0);stroke:rgb(180, 83, 9);color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="258" y="277" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#fbbf24" dominant-baseline="central" style="fill:rgb(251, 191, 36);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:12px;font-weight:600;text-anchor:middle;dominant-baseline:central">Summary</text>
<text x="258" y="294" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#b45309" dominant-baseline="central" style="fill:rgb(180, 83, 9);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:central">LLM · Groq</text>

<rect x="342" y="264" width="147" height="38" rx="6" fill="#1a0606" stroke="#b91c1c" stroke-width="1" style="fill:rgb(26, 6, 6);stroke:rgb(185, 28, 28);color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="415" y="277" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#f87171" dominant-baseline="central" style="fill:rgb(248, 113, 113);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:12px;font-weight:600;text-anchor:middle;dominant-baseline:central">Tools</text>
<text x="415" y="294" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#b91c1c" dominant-baseline="central" style="fill:rgb(185, 28, 28);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:central">Fn Calling · GitHub · HR</text>

<rect x="499" y="264" width="147" height="38" rx="6" fill="#1a0606" stroke="#b91c1c" stroke-width="1" style="fill:rgb(26, 6, 6);stroke:rgb(185, 28, 28);color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="572" y="277" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#f87171" dominant-baseline="central" style="fill:rgb(248, 113, 113);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:12px;font-weight:600;text-anchor:middle;dominant-baseline:central">Admin</text>
<text x="572" y="294" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#b91c1c" dominant-baseline="central" style="fill:rgb(185, 28, 28);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:central">Stats · Members</text>

<!-- Arrows Backend → Services -->
<line x1="88" y1="322" x2="88" y2="342" stroke="#30363d" stroke-width="1.5" marker-end="url(#a)" style="fill:rgb(0, 0, 0);stroke:rgb(48, 54, 61);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="248" y1="322" x2="248" y2="342" stroke="#30363d" stroke-width="1.5" marker-end="url(#a)" style="fill:rgb(0, 0, 0);stroke:rgb(48, 54, 61);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="412" y1="322" x2="412" y2="342" stroke="#d97706" stroke-width="1.5" marker-end="url(#ao)" style="fill:rgb(0, 0, 0);stroke:rgb(217, 119, 6);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="568" y1="322" x2="568" y2="342" stroke="#0e7490" stroke-width="1.5" marker-end="url(#a)" style="fill:rgb(0, 0, 0);stroke:rgb(14, 116, 144);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>

<!-- Service Boxes -->
<rect x="14" y="342" width="148" height="54" rx="8" fill="#0a1628" stroke="#1d4ed8" stroke-width="1.5" style="fill:rgb(10, 22, 40);stroke:rgb(29, 78, 216);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="88" y="360" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="600" fill="#3b82f6" dominant-baseline="central" style="fill:rgb(59, 130, 246);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:13px;font-weight:600;text-anchor:middle;dominant-baseline:central">PostgreSQL</text>
<text x="88" y="378" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e40af" dominant-baseline="central" style="fill:rgb(30, 64, 175);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:central">Users · Docs · Chat</text>

<rect x="174" y="342" width="148" height="54" rx="8" fill="#1a103d" stroke="#7c3aed" stroke-width="1.5" style="fill:rgb(26, 16, 61);stroke:rgb(124, 58, 237);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="248" y="360" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="600" fill="#a78bfa" dominant-baseline="central" style="fill:rgb(167, 139, 250);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:13px;font-weight:600;text-anchor:middle;dominant-baseline:central">Qdrant</text>
<text x="248" y="378" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#7c3aed" dominant-baseline="central" style="fill:rgb(124, 58, 237);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:central">Vector Store</text>

<rect x="334" y="342" width="148" height="54" rx="8" fill="#1a0e00" stroke="#d97706" stroke-width="1.5" style="fill:rgb(26, 14, 0);stroke:rgb(217, 119, 6);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="408" y="360" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="600" fill="#fbbf24" dominant-baseline="central" style="fill:rgb(251, 191, 36);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:13px;font-weight:600;text-anchor:middle;dominant-baseline:central">Groq API</text>
<text x="408" y="378" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#d97706" dominant-baseline="central" style="fill:rgb(217, 119, 6);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:central">LLaMA 3.3-70b</text>

<rect x="494" y="342" width="148" height="54" rx="8" fill="#061820" stroke="#0e7490" stroke-width="1.5" style="fill:rgb(6, 24, 32);stroke:rgb(14, 116, 144);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="568" y="360" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="600" fill="#22d3ee" dominant-baseline="central" style="fill:rgb(34, 211, 238);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:13px;font-weight:600;text-anchor:middle;dominant-baseline:central">Jina AI</text>
<text x="568" y="378" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#0e7490" dominant-baseline="central" style="fill:rgb(14, 116, 144);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:central">Embedding Model</text>

<!-- RAG Pipeline -->
<text x="340" y="416" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#4b5563" letter-spacing="2" style="fill:rgb(75, 85, 99);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:middle;dominant-baseline:auto">RAG PIPELINE FLOW</text>

<rect x="14" y="424" width="108" height="30" rx="6" fill="#161b22" stroke="#30363d" stroke-width="1" style="fill:rgb(22, 27, 34);stroke:rgb(48, 54, 61);color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="68" y="439" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#8b949e" dominant-baseline="central" style="fill:rgb(139, 148, 158);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:11px;font-weight:400;text-anchor:middle;dominant-baseline:central">Upload</text>
<line x1="125" y1="439" x2="139" y2="439" stroke="#30363d" stroke-width="1.5" marker-end="url(#a)" style="fill:rgb(0, 0, 0);stroke:rgb(48, 54, 61);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>

<rect x="142" y="424" width="108" height="30" rx="6" fill="#161b22" stroke="#30363d" stroke-width="1" style="fill:rgb(22, 27, 34);stroke:rgb(48, 54, 61);color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="196" y="439" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#8b949e" dominant-baseline="central" style="fill:rgb(139, 148, 158);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:11px;font-weight:400;text-anchor:middle;dominant-baseline:central">Parse · Chunk</text>
<line x1="253" y1="439" x2="267" y2="439" stroke="#30363d" stroke-width="1.5" marker-end="url(#a)" style="fill:rgb(0, 0, 0);stroke:rgb(48, 54, 61);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>

<rect x="270" y="424" width="108" height="30" rx="6" fill="#061a0c" stroke="#15803d" stroke-width="1" style="fill:rgb(6, 26, 12);stroke:rgb(21, 128, 61);color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="324" y="439" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#4ade80" dominant-baseline="central" style="fill:rgb(74, 222, 128);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:11px;font-weight:400;text-anchor:middle;dominant-baseline:central">Embed · Store</text>
<line x1="381" y1="439" x2="395" y2="439" stroke="#30363d" stroke-width="1.5" marker-end="url(#a)" style="fill:rgb(0, 0, 0);stroke:rgb(48, 54, 61);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>

<rect x="398" y="424" width="108" height="30" rx="6" fill="#1a103d" stroke="#7c3aed" stroke-width="1" style="fill:rgb(26, 16, 61);stroke:rgb(124, 58, 237);color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="452" y="439" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#a78bfa" dominant-baseline="central" style="fill:rgb(167, 139, 250);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:11px;font-weight:400;text-anchor:middle;dominant-baseline:central">RAG Retrieve</text>
<line x1="509" y1="439" x2="523" y2="439" stroke="#d97706" stroke-width="1.5" marker-end="url(#ao)" style="fill:rgb(0, 0, 0);stroke:rgb(217, 119, 6);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>

<rect x="526" y="424" width="130" height="30" rx="6" fill="#1a0e00" stroke="#d97706" stroke-width="1" style="fill:rgb(26, 14, 0);stroke:rgb(217, 119, 6);color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="591" y="439" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#fbbf24" dominant-baseline="central" style="fill:rgb(251, 191, 36);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:11px;font-weight:400;text-anchor:middle;dominant-baseline:central">LLM · SSE Stream</text>

<!-- Legend -->
<line x1="50" y1="476" x2="68" y2="476" stroke="#30363d" stroke-width="1.5" marker-end="url(#a)" style="fill:rgb(0, 0, 0);stroke:rgb(48, 54, 61);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="72" y="476" font-family="system-ui,sans-serif" font-size="10" fill="#4b5563" dominant-baseline="central" style="fill:rgb(75, 85, 99);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:start;dominant-baseline:central">Service routing</text>
<line x1="230" y1="476" x2="248" y2="476" stroke="#1d4ed8" stroke-width="1.5" marker-end="url(#ab)" style="fill:rgb(0, 0, 0);stroke:rgb(29, 78, 216);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="252" y="476" font-family="system-ui,sans-serif" font-size="10" fill="#4b5563" dominant-baseline="central" style="fill:rgb(75, 85, 99);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:start;dominant-baseline:central">Data flow</text>
<line x1="370" y1="476" x2="388" y2="476" stroke="#d97706" stroke-width="1.5" marker-end="url(#ao)" style="fill:rgb(0, 0, 0);stroke:rgb(217, 119, 6);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="392" y="476" font-family="system-ui,sans-serif" font-size="10" fill="#4b5563" dominant-baseline="central" style="fill:rgb(75, 85, 99);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:system-ui, sans-serif;font-size:10px;font-weight:400;text-anchor:start;dominant-baseline:central">AI / LLM call</text>
</svg>
---

## What is NEXUS?

**NEXUS** stands for *Neural Enterprise Knowledge Unification System*.

NEXUS is a full-stack AI workspace platform where teams can upload documents (PDF, DOCX, TXT), chat with them using Retrieval-Augmented Generation (RAG), run semantic searches across workspace documents, and get AI-powered summaries — all within isolated, role-protected workspaces.

It is built on top of **Spring AI 1.0.0**, uses **Groq's LLaMA 3.3-70b** model for generation, **Jina AI** for document embeddings, and **Qdrant** as the vector store. The frontend is a React 19 + TypeScript SPA with real-time SSE streaming for chat responses.

---

## ✨ Features

- 🧠 **RAG-Based Document Chat** — Ask questions over your uploaded documents; answers are grounded in actual content via Qdrant similarity search
- 🔍 **Semantic Search** — Search workspace documents by meaning, not just keywords
- 📄 **Document Ingestion** — Upload PDF, DOCX, or TXT files; parsed with Apache Tika and embedded with Jina AI
- ⚡ **Streaming Chat** — Responses stream in real time via Server-Sent Events (SSE)
- 🗂️ **Multi-Workspace Support** — Create isolated workspaces, invite members, manage access
- 💬 **Persistent Chat Memory** — JDBC-backed Spring AI chat memory stored in PostgreSQL per session
- 📝 **AI Document Summary** — Generate summaries of ingested documents via Groq LLaMA
- 🛠️ **Function Calling Tools** — GitHub repo info + HR employee tools via Spring AI tool calling
- 🔐 **JWT Authentication** — Stateless auth with access + refresh tokens via Spring Security 6
- 👤 **Role-Based Access** — ADMIN and MEMBER roles with workspace-scoped security

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Java 17 | Core language |
| Spring Boot 3.3.5 | Backend framework |
| Spring AI 1.0.0 | AI integration (RAG, embeddings, tools, chat memory) |
| Groq API (LLaMA 3.3-70b) | LLM for chat generation and summarization |
| Jina AI (jina-embeddings-v2-base-en) | Document embedding model |
| Qdrant Vector Store | Vector similarity search |
| Spring Security 6 + JWT | Authentication and authorization |
| Spring WebFlux | SSE streaming for chat responses |
| Apache Tika | Document parsing (PDF, DOCX, TXT) |
| Spring Data JPA + Hibernate | ORM and database access |
| PostgreSQL | Relational database |
| Lombok | Boilerplate reduction |
| Docker + Docker Compose | Infrastructure (PostgreSQL + Qdrant) |

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript 5.7 | Type-safe frontend development |
| Vite 8 | Build tool and dev server |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui + Radix UI | UI component primitives |
| React Router DOM v7 | Client-side routing |
| Axios | HTTP client with JWT interceptor |
| Custom SSE Hook | Real-time streaming chat |

---

## 🚀 Getting Started (Local Setup)

### Prerequisites

- Java 17+
- Node.js 18+
- Docker + Docker Compose
- Groq API key — [console.groq.com](https://console.groq.com) (free)
- Jina AI API key — [jina.ai](https://jina.ai) (free tier available)

---

### 1. Clone the repository

```bash
git clone https://github.com/ritik-hedau18/NEXUS.git
cd NEXUS
```

### 2. Start infrastructure

```bash
docker-compose up -d
```

Starts PostgreSQL on `:5432` and Qdrant on `:6333` / `:6334`.

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Fill in `backend/.env`:

```env
DB_USERNAME=postgres
DB_PASSWORD=your_db_password
GROQ_API_KEY=your_groq_api_key
JINA_API_KEY=your_jina_api_key
QDRANT_HOST=localhost
JWT_SECRET=your_256bit_hex_encoded_secret
```

Set these in your IDE run configuration (IntelliJ: Run → Edit Configurations → Environment Variables) or export them in your shell.

### 4. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend starts at `http://localhost:8080`

### 5. Run the frontend

```bash
cd nexus-frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

---

## 🔌 API Reference

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login, returns JWT tokens | ❌ |
| POST | `/api/auth/refresh` | Refresh access token | ❌ |

### Workspace Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/workspaces` | List user's workspaces | ✅ |
| POST | `/api/workspaces` | Create a workspace | ✅ |
| POST | `/api/workspaces/{id}/members` | Add member to workspace | ✅ |
| DELETE | `/api/workspaces/{id}/members/{userId}` | Remove member | ✅ |

### Document Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/documents/upload` | Upload and ingest a document | ✅ |
| GET | `/api/documents` | List documents in workspace | ✅ |
| DELETE | `/api/documents/{id}` | Delete a document | ✅ |

### AI Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/chat/stream` | SSE streaming RAG chat | ✅ |
| GET | `/api/chat/history` | Get chat history for session | ✅ |
| GET | `/api/search` | Semantic search over documents | ✅ |
| POST | `/api/summary/{documentId}` | Generate document summary | ✅ |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/admin/workspaces/stats` | Workspace statistics | ✅ ADMIN |
| GET | `/api/admin/members` | All workspace members | ✅ ADMIN |

---

## 🔒 Security

- Passwords hashed using **BCrypt**
- JWT access token expires in **1 hour**, refresh token in **24 hours** (configurable)
- All endpoints except `/api/auth/**` require a valid Bearer JWT
- Workspace-scoped security — members can only access their own workspace data
- Spring Security 6 with stateless session (no HttpSession)
- Sensitive config (API keys, JWT secret) kept out of source via environment variables

---

## 🗄️ Database Schema

| Table | Purpose |
|---|---|
| `users` | User accounts with roles (ADMIN / MEMBER) |
| `workspaces` | Workspace definitions with owner reference |
| `workspace_members` | Many-to-many workspace-user membership |
| `documents` | Document metadata with ingestion status (PROCESSING / READY / FAILED) |
| `chat_messages` | Chat history per session and workspace |
| `employees` | Mock HR employee data for function calling demo |
| `SPRING_AI_CHAT_MEMORY` | Spring AI JDBC-backed persistent chat memory |

---

## 👤 Author

**Ritik Hedau**
Java Full Stack Developer | Spring Boot | Spring AI | React
📍 India

[![GitHub](https://img.shields.io/badge/GitHub-ritik--hedau18-black?style=flat-square&logo=github)](https://github.com/ritik-hedau18)

---

## 🔗 Related Projects

| Project | Description |
|---|---|
| [SRIJAN](https://github.com/ritik-hedau18/SRIJAN) | AI-powered Spring Boot code generator using Groq LLaMA + Spring AI |
| [TRACE](https://github.com/ritik-hedau18/TRACE-Transaction-Risk-and-Anomaly-Classification-Engine) | Real-time fraud detection system using Spring Boot microservices + Kafka |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
