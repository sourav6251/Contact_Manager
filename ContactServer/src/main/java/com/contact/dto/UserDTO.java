package com.contact.dto;

import com.contact.dto.imp.OnRegister;
import com.contact.dto.imp.Test;
import jakarta.validation.constraints.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserDTO {

    @NotBlank
    private UUID userId;
    private String mediaUrl;
    private String mediaId;
    @Size(min = 4, max = 20, groups = {OnRegister.class})
    @NotBlank(groups = {OnRegister.class,Test.class})
    private String name;
    @Email(message = "Enter valid Email ", groups = {OnRegister.class})
    @NotBlank(groups = {OnRegister.class,Test.class})
    private String email;
    private String currentPassword;
    @Size(min = 8, max = 15, groups = {OnRegister.class})
    @NotBlank(groups = {OnRegister.class})
    private String newPassword;
    @Min(6)
    @Max(6)
    private long otp;
    private LocalDateTime otpCreate;
    private LocalDateTime userCreate;
    private LocalDateTime lastLogin;
    @NotNull(groups = Test.class)
    private MultipartFile file;

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }

    public UserDTO() {}

    // Main constructor
    public UserDTO(UUID userId, String mediaUrl, String mediaId, String name, String email,
                   String currentPassword, String newPassword, long otp,
                   LocalDateTime otpCreate, LocalDateTime userCreate, LocalDateTime lastLogin) {
        this.userId = userId;
        this.mediaUrl = cleanSpaces(mediaUrl);
        this.mediaId = cleanSpaces(mediaId);
        this.name = cleanSpaces(name);
        this.email = cleanSpaces(email);
        this.currentPassword = cleanSpaces(currentPassword);
        this.newPassword = cleanSpaces(newPassword);
        this.otp = otp;
        this.otpCreate = otpCreate;
        this.userCreate = userCreate;
        this.lastLogin = lastLogin;
    }

    // Register User
    public UserDTO(String name, String email, String newPassword) {
        this(null, null, null, name, email, null, newPassword, 2, null, LocalDateTime.now(), null);
    }

    // Change Password
    public UserDTO(UUID userId, String currentPassword, String newPassword) {
        this(userId, null, null, null, null, currentPassword, newPassword, 10, null, null, null);
    }

    // Update Profile
    public UserDTO(UUID userId, String mediaUrl, String mediaId, String name, String email) {
        this(userId, mediaUrl, mediaId, name, email, null, null, 1, null, null, null);
    }

    // User Login
    public UserDTO(String email, String currentPassword, LocalDateTime lastLogin) {
        this(null, null, null, null, email, currentPassword, null, 3, null, null, lastLogin);
    }

    // OTP verification
    public UserDTO(UUID userId, long otp, LocalDateTime otpCreate) {
        this(userId, null, null, null, null, null, null, otp, otpCreate, null, null);
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = removeAllSpace(mediaUrl);
    }

    public String getMediaId() {
        return mediaId;
    }

    public void setMediaId(String mediaId) {
        this.mediaId = removeAllSpace(mediaId);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = cleanSpaces(name);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = removeAllSpace(email);
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = removeAllSpace(currentPassword);
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = removeAllSpace(newPassword);
    }

    public long getOtp() {
        return otp;
    }

    public void setOtp(long otp) {
        this.otp = otp;
    }

    public LocalDateTime getOtpCreate() {
        return otpCreate;
    }

    public void setOtpCreate(LocalDateTime otpCreate) {
        this.otpCreate = otpCreate;
    }

    public LocalDateTime getUserCreate() {
        return userCreate;
    }

    public void setUserCreate(LocalDateTime userCreate) {
        this.userCreate = userCreate;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public static String cleanSpaces(String input) {
        return input != null ? input.trim().replaceAll("\\s+", " ") : null;
    }
    public static String removeAllSpace(String input){
        return input !=null ? input.replaceAll("\\s+",""):null;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "userId=" + userId +
                ", mediaUrl='" + mediaUrl + '\'' +
                ", mediaId='" + mediaId + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", currentPassword='" + currentPassword + '\'' +
                ", newPassword='" + newPassword + '\'' +
                ", otp=" + otp +
                ", otpCreate=" + otpCreate +
                ", userCreate=" + userCreate +
                ", lastLogin=" + lastLogin +
                '}';
    }
}
