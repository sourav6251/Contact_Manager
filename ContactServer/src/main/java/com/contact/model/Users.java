package com.contact.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;
    private String mediaUrl;
    private String mediaId;
    private String name;
    @Column(unique = true, nullable = false)
    private String email;
    @JsonIgnore
    private String password;
    @Column(columnDefinition = "boolean default false")
    private boolean isVerify;
    @JsonIgnore
    private long otp;
    @JsonIgnore
    private LocalDateTime otpCreate;
    @JsonIgnore
    private LocalDateTime userCreate;

    private LocalDateTime lastLogin;


    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Contacts> contacts;

    public Users() {
    }

    public UUID getUserId() {
        return userId;
    }

    public boolean isVerify() {
        return isVerify;
    }

    public void setVerify(boolean verify) {
        isVerify = verify;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public String getMediaId() {
        return mediaId;
    }

    public void setMediaId(String mediaId) {
        this.mediaId = mediaId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public List<Contacts> getContacts() {
        return contacts;
    }

    public void setContacts(List<Contacts> contacts) {
        this.contacts = contacts;
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

//    public Users(UUID userId, String mediaUrl, String mediaId, String name, String email, String password, long otp, LocalDateTime otpCreate, LocalDateTime userCreate, LocalDateTime lastLogin, List<Contacts> contacts) {
//        this.userId = userId;
//        this.mediaUrl = mediaUrl;
//        this.mediaId = mediaId;
//        this.name = name;
//        this.email = email;
//        this.password = password;
//        this.otp = otp;
//        this.otpCreate = otpCreate;
//        this.userCreate = userCreate;
//        this.lastLogin = lastLogin;
//        this.contacts = contacts;
//    }

    public Users(String mediaUrl, String mediaId, String email, String name, String password, long otp, LocalDateTime otpCreate) {
        this.mediaUrl = mediaUrl;
        this.mediaId = mediaId;
        this.email = email;
        this.name = name;
        this.password = password;
        this.otp = otp;
        this.otpCreate = otpCreate;
    }

    public Users(UUID userId, String mediaUrl, String mediaId, String name, String email, String password, long otp, LocalDateTime otpCreate, List<Contacts> contacts) {
        this.userId = userId;
        this.mediaUrl = mediaUrl;
        this.mediaId = mediaId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.otp = otp;
        this.otpCreate = otpCreate;
        this.contacts = contacts;
    }

    public Users( UUID userId, String mediaUrl,String mediaId, String name, String email, String password, long otp, LocalDateTime otpCreate, LocalDateTime userCreate, LocalDateTime lastLogin, List<Contacts> contacts) {
        this.mediaUrl = mediaUrl;
        this.userId = userId;
        this.mediaId = mediaId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.otp = otp;
        this.otpCreate = otpCreate;
        this.userCreate = userCreate;
        this.lastLogin = lastLogin;
        this.contacts = contacts;
    }

    @Override
    public String toString() {
        return "Users{" +
                "userId=" + userId +
                ", mediaUrl='" + mediaUrl + '\'' +
                ", mediaId='" + mediaId + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", isVerify=" + isVerify +
                ", otp=" + otp +
                ", otpCreate=" + otpCreate +
                ", userCreate=" + userCreate +
                ", lastLogin=" + lastLogin +
                ", contacts=" + contacts +
                '}';
    }
}
