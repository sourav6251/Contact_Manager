package com.contact.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
public class Contacts {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID contactId;
    private String mediaUrl;
    private String mediaId;
    private String name;
    private String email;
    private String phone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private Users users;

    public Contacts() {
    }

    public UUID getContactId() {
        return contactId;
    }

    public void setContactId(UUID contactId) {
        this.contactId = contactId;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public Contacts(UUID contactId, String mediaUrl, String mediaId, String name, String email, String phone, Users users) {
        this.contactId = contactId;
        this.mediaUrl = mediaUrl;
        this.mediaId = mediaId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.users = users;
    }

    public Contacts(  String mediaUrl, String mediaId, String name, String email, String phone ) {
        this.mediaUrl = mediaUrl;
        this.mediaId = mediaId;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
}
