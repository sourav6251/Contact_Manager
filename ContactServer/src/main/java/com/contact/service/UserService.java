package com.contact.service;

import com.contact.dao.UserDAO;
import com.contact.dto.UserDTO;
import com.contact.util.JWTUtil;
import com.contact.util.exception.PasswordNotMatch;
import com.contact.model.Users;
import com.contact.util.HttpStatus;
import com.contact.util.exception.LoginException;
import com.contact.util.exception.OTPException;
import com.contact.util.exception.UserExistException;
import jakarta.mail.MessagingException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import java.io.IOException;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class UserService {
    private final UserDAO userDAO;
    private final MailService mailService;
    private final JWTUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public UserService(UserDAO userDAO, MailService mailService, JWTUtil jwtUtil, UserDetailsService userDetailsService) {
        this.userDAO = userDAO;
        this.mailService = mailService;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    public HttpStatus register(UserDTO userDTO) {
        if (userDTO.getEmail().isBlank() || userDTO.getName().isBlank() || userDTO.getNewPassword().isBlank()) {
            return new HttpStatus(400, "Email,Name,Password is required");
        }
        try {
            Users result = userDAO.register(userDTO);
            return new HttpStatus(200, result);
        } catch (UserExistException e) {
            return new HttpStatus(400, e);
        } catch (RuntimeException e) {
            return new HttpStatus(500);
        }

    }

    public HttpStatus login(String email, String password) {
        Users users;
        UserDetails userDetails;
        try {
            users = userDAO.login(email, password);
            System.err.println("userService=>" + users);
            mailService.sendMail(users.getEmail(), users.getName(), "", "loginSuccess");
            userDetails = userDetailsService.loadUserByUsername(users.getEmail());
            String token = jwtUtil.jwtGenerator(userDetails);
            System.err.println("token=>" + token);
//            Map<String, Object> response = new HashMap<>();
//            response.put("user", users);
//            response.put("token", token);
            return new HttpStatus(200, users, token);
        } catch (NoSuchElementException e) {

            return new HttpStatus(404, "User doesn't exist");
        } catch (LoginException e) {
            try {
                mailService.sendMail(email, e.getMessage(), "", "loginFail");
            } catch (IOException | MessagingException ex) {
                System.err.println(ex.getMessage());
            }
            return new HttpStatus(400, "Enter valid password");
        }catch (UsernameNotFoundException e){
            System.err.println("UsernameNotFoundException");
            return new HttpStatus(500);
        }
        catch (RuntimeException | IOException | MessagingException e) {
            return new HttpStatus(500);
        }
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

    public HttpStatus deleteUser(UUID uuid) {
        return userDAO.deleteUser(uuid);
    }

    public HttpStatus generateOTP(UUID userID) {
        long otp = ThreadLocalRandom.current().nextInt(100000, 999999);
        try {
            Users users = userDAO.generateOTP(otp, userID);
            mailService.sendMail(users.getEmail(), users.getName(), String.valueOf(otp), "otp");
            return new HttpStatus(200, otp);
        } catch (NoSuchElementException e) {
            return new HttpStatus(404, "User doesn't exist");
        } catch (RuntimeException e) {
            return new HttpStatus(500);
        } catch (IOException | MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    public HttpStatus verifyOTP(UUID userID, long otp) {
        try {
            userDAO.verifyOTP(userID, otp);
            return new HttpStatus(200, otp);
        } catch (NoSuchElementException e) {
            return new HttpStatus(404, "User doesn't exist");
        } catch (OTPException e) {
            return new HttpStatus(400, e.getMessage());
        }
    }

    public HttpStatus updatePasswordWithOldPassword(UUID userID, UserDTO userDTO) {
        try {
            Users users = userDAO.updatePasswordWithOldPassword(userID, userDTO);
            mailService.sendMail(users.getEmail(), users.getName(), "PasswordChange", "passwordChange");
            return new HttpStatus(200);
        } catch (PasswordNotMatch e) {
            String combined = e.getMessage();
            String[] parts = combined.split("!");

            String email = parts[0];
            String name = parts[1];

            System.out.println("Email: " + email);
            System.out.println("Name: " + name);

            try {
                mailService.sendMail(email, name, "PasswordChange", "failPasswordChange");
            } catch (IOException | MessagingException ex) {
                System.err.println("Mail not send");
            }
            return new HttpStatus(400, e);
        } catch (NoSuchElementException e) {
            return new HttpStatus(400, e);
        } catch (RuntimeException | MessagingException | IOException e) {
            System.err.println("Mail not send");
            return new HttpStatus(500, e);
        }
    }

    public HttpStatus updatePasswordWithPassword(UUID userID, UserDTO userDTO) {
        try {
            userDAO.updatePasswordWithPassword(userID, userDTO);
            return new HttpStatus(200);
        } catch (PasswordNotMatch e) {
            return new HttpStatus(400, e);
        } catch (NoSuchElementException e) {
            return new HttpStatus(400, e);
        } catch (RuntimeException e) {
            return new HttpStatus(500, e);
        }
    }


}


