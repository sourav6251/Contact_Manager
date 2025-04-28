package com.contact.dto;

import com.contact.dto.imp.CreateContact;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class ContactDTO {

    private String mediaUrl;
    private String mediaId;
    @NotBlank(message = "Name is required",groups = {CreateContact.class})
    @Size(min = 4,max = 20,groups = {CreateContact.class})
    private String name;
    @Email(message = "Enter valid email")
    private String email;
    @NotBlank(message = "Phone no is required",groups = {CreateContact.class})
    private String phone;

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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = removeAllSpace(phone);
    }

    public ContactDTO(String mediaUrl, String mediaId, String name, String email, String phone) {
        this.mediaUrl = mediaUrl;
        this.mediaId = mediaId;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    public ContactDTO() {
    }
    public static String cleanSpaces(String input) {
        return input != null ? input.trim().replaceAll("\\s+", " ") : null;
    }
    public static String removeAllSpace(String input){
        return input !=null ? input.replaceAll("\\s+",""):null;
    }
}
