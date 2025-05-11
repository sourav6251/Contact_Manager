package com.contact.service;

import com.contact.dao.UserDAO;
import com.contact.dto.UserDTO;
import com.contact.util.exception.PasswordNotMatch;
import com.contact.model.Users;
import com.contact.util.HttpStatus;
import com.contact.util.exception.LoginException;
import com.contact.util.exception.OTPException;
import org.springframework.stereotype.Service;


import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class UserService {
    private final UserDAO userDAO;
    private final MailService mailService;

    public UserService(UserDAO userDAO, MailService mailService) {
        this.userDAO = userDAO;
        this.mailService = mailService;
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
    public HttpStatus login(String email, String password) {
        try {
            Users users=userDAO.login(email, password);
           return new HttpStatus(200,users);
        }catch (NoSuchElementException e){
            return new HttpStatus(404,"User doesn't exist");
        }catch (LoginException e){
            return new HttpStatus(400,"Enter valid password");
        } catch (RuntimeException e) {
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

    public HttpStatus deleteUser(UUID uuid){
        return userDAO.deleteUser(uuid);
    }

    public HttpStatus generateOTP(UUID userID){
        long otp = ThreadLocalRandom.current().nextInt(100000, 999999);
        try{
            Users users=userDAO.generateOTP(otp, userID);
            mailService.sendMail(users.getEmail(),users.getName(),String.valueOf(otp),"otp");
            return new HttpStatus(200,otp);
        }catch (NoSuchElementException e){
            return new HttpStatus(404,"User doesn't exist");
        } catch (RuntimeException e) {
            return new HttpStatus(500);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public HttpStatus verifyOTP(UUID userID,long otp){
        try{
            userDAO.verifyOTP(userID, otp);
            return new HttpStatus(200,otp);
        }catch (NoSuchElementException e){
            return new HttpStatus(404,"User doesn't exist");
        } catch (OTPException e) {
            return new HttpStatus(400,e.getMessage());
        }
    }

    public HttpStatus updatePasswordWithOldPassword(UUID userID,UserDTO userDTO){
        try{
            userDAO.updatePasswordWithOldPassword(userID,userDTO);
            return new HttpStatus(200);
        }catch (PasswordNotMatch e){
            return new HttpStatus(400,e);
        }catch (NoSuchElementException e){
            return new HttpStatus(400,e);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
    public HttpStatus updatePasswordWithPassword(UUID userID,UserDTO userDTO){
        try{
            userDAO.updatePasswordWithPassword(userID,userDTO);
            return new HttpStatus(200);
        }catch (PasswordNotMatch e){
            return new HttpStatus(400,e);
        }catch (NoSuchElementException e){
            return new HttpStatus(400,e);
        } catch (RuntimeException e) {
            return new HttpStatus(500,e);
        }
    }


}


