package com.nexus.admin;

import java.util.UUID;

public record MemberInfo(UUID id, String name, String email, String role) {}
