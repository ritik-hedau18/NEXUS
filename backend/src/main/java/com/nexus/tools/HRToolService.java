package com.nexus.tools;

import com.nexus.tools.model.Employee;
import com.nexus.tools.repository.EmployeeRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class HRToolService {

    private final EmployeeRepository employeeRepository;

    public HRToolService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Tool(description = "Look up an employee's leave balance or department from HR records using their name")
    public String getEmployeeInfo(String employeeName) {
        Optional<Employee> employeeOpt = employeeRepository.findByNameIgnoreCase(employeeName);
        if (employeeOpt.isEmpty()) {
            return "Employee '" + employeeName + "' not found in HR records.";
        }
        Employee emp = employeeOpt.get();
        return String.format("Employee Found: Name: %s, Email: %s, Department: %s, Leave Balance: %d days",
                emp.getName(), emp.getEmail(), emp.getDepartment(), emp.getLeaveBalance());
    }
}
