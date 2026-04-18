package com.nexus.tools.repository;

import com.nexus.tools.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    Optional<Employee> findByNameIgnoreCase(String name);
    List<Employee> findByWorkspaceId(UUID workspaceId);
}
