package com.contact.service;

import com.contact.dao.UserDAO;
import com.contact.dto.ContactDTO;
import com.contact.dto.UserDTO;
import com.contact.model.Users;
import com.contact.util.HttpStatus;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserDAO userDAO;

    public UserService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public HttpStatus register(UserDTO userDTO) {
        if (userDTO.getEmail().isBlank() || userDTO.getName().isBlank() || userDTO.getNewPassword().isBlank()) {
            return new HttpStatus(400, "Email,Name,Password is required");
        }
        int result = userDAO.register(userDTO);
        return switch (result) {
            case 200 -> new HttpStatus(200, "User Registered successfully");
            case 400 -> new HttpStatus(400, "User already exist with this email");
            default -> new HttpStatus(500);
        };
    }

    public HttpStatus showUser() {
        List<Users> usersList = userDAO.showUser();
        if (usersList.isEmpty()) {
            return new HttpStatus(204);
        }
        return new HttpStatus(200, usersList);
    }

    public HttpStatus updateProfile(UserDTO userDTO, UUID userID) {
        int status = userDAO.updateProfile(userDTO, userID);
        return switch (status) {
            case 200 -> new HttpStatus(200, "Profile Update Successfully");
            case 404 -> new HttpStatus(404, "User doesn't exist");
            default -> new HttpStatus(500, "internal server error");
        };
    }

    public HttpStatus showUserByID(UUID userId) {
        return userDAO.showUserByID(userId);
    }

    public HttpStatus deleteUser(UUID uuid){
        return userDAO.deleteUser(uuid);
    }

}


