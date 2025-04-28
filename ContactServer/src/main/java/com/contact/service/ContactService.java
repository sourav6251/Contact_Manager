package com.contact.service;

import com.contact.dao.ContactDAO;
import com.contact.dto.ContactDTO;
import com.contact.model.Contacts;
import com.contact.util.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ContactService {

    private final ContactDAO contactDAO;

    public ContactService(ContactDAO contactDAO) {
        this.contactDAO = contactDAO;
    }

    public HttpStatus createContact(UUID userID, ContactDTO contactDTO) {
        int status = contactDAO.createContact(userID, contactDTO);
        return switch (status){
            case 201-> new HttpStatus(200,"Contact Save successfully");
            case 404-> new HttpStatus(404,"User not found");
            case 400-> new HttpStatus(400,"Phone no already exist");
            default -> new HttpStatus(500);
        };
    }

    public HttpStatus updateContact(UUID userID,UUID contactID, ContactDTO contactDTO) {
        return  contactDAO.updateContact(userID,contactID, contactDTO);
//        return switch (status){
//            case 201-> new HttpStatus(200,"Contact Save successfully");
//            case 404-> new HttpStatus(404,"User not found");
//            case 400-> new HttpStatus(400,"Phone no already exist");
//            default -> new HttpStatus(500);
//        };
    }

    public HttpStatus showAllContact(UUID userID){
        return contactDAO.showAllContact(userID);
    }

    public HttpStatus showContacts(UUID contactID){
        return contactDAO.showContacts(contactID);
    }

    public HttpStatus deleteContact(UUID contactID){
        return contactDAO.deleteContact(contactID);
    }



}
