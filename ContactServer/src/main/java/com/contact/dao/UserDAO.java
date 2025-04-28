package com.contact.dao;

import com.contact.dto.UserDTO;
import com.contact.model.Users;
import com.contact.util.HttpStatus;
import com.contact.util.reposetry.UserRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Component
public class UserDAO {

    private final UserRepository userRepository;

    public UserDAO(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public int register(UserDTO userDTO) {
        if (!checkUserByEmail(userDTO.getEmail())) {
            Users users = userDtoToUsers(userDTO, LocalDateTime.now());

            try {
                userRepository.save(users);
                return 200;
            } catch (Exception e) {
                return 500;
            }
        }
        return 400;
    }

    public List<Users> showUser() {
        return userRepository.findAll();
    }

    public int updateProfile(UserDTO userDTO, UUID userID) {

        if (checkUser(userID)) {
            try {
                Users users = userRepository.findById(userID).orElseThrow();

                if (userDTO.getMediaUrl() != null && !userDTO.getMediaUrl().isBlank()) {
                    users.setMediaUrl(userDTO.getMediaUrl());
                }
                if (userDTO.getMediaId() != null && !userDTO.getMediaId().isBlank()) {
                    users.setMediaId(userDTO.getMediaId());
                }
                if (userDTO.getName() != null && !userDTO.getName().isBlank()) {
                    users.setName(userDTO.getName());
                }
//                if (userDTO.getEmail() != null && !userDTO.getEmail().isBlank()) {
//                    users.setEmail(userDTO.getEmail());
//                }

                userRepository.save(users);
                return 200;
            } catch (Exception e) {
                return 500;
            }

        } else {
            return 404;
        }
    }

    public boolean checkUser(UUID userID) {
        return userRepository.existsById(userID);
    }

    public boolean checkUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Users findUserById(UUID userID) {
        return userRepository.findById(userID).orElseThrow();
    }

    private Users userDtoToUsers(UserDTO userDTO, LocalDateTime localDateTime) {
        return new Users(
                userDTO.getUserId(),
                userDTO.getMediaUrl(),
                userDTO.getMediaId(),
                userDTO.getName(),
                userDTO.getEmail(),
                userDTO.getNewPassword(),
                userDTO.getOtp(),
                userDTO.getOtpCreate(),
                localDateTime,
                LocalDateTime.now(),
                null
        );
    }

    public HttpStatus showUserByID(UUID userID) {
        try {
            Users users = userRepository.findById(userID).orElseThrow();
            return new HttpStatus(200, users);
        } catch (NoSuchElementException e) {
            return new HttpStatus(400, "User Doesn't found");
        } catch (Exception e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus deleteUser(UUID userID){
        try{
            userRepository.deleteById(userID);
            return new HttpStatus(200);
        }catch (Exception e){
            return new HttpStatus(500);
        }
    }

}


