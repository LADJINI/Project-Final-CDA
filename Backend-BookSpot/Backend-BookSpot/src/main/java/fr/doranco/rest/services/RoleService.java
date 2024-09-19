package fr.doranco.rest.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import fr.doranco.rest.dto.RoleDto;
import fr.doranco.rest.entities.Role;
import fr.doranco.rest.repository.IRoleRepository;

@Service
public class RoleService {
    @Autowired
    private IRoleRepository roleRepository;

    @Transactional
    public Optional<RoleDto> findById(Integer id) {
        return roleRepository.findById(id)
            .map(this::convertToDto);
    }

    private RoleDto convertToDto(Role role) {
        RoleDto dto = new RoleDto();
        dto.setId(role.getId());
        dto.setName(role.getName());
        return dto;
    }
}