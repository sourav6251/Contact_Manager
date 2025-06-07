package com.contact.dao;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.contact.dto.ContactDTO;
import com.contact.model.Contacts;
import com.contact.model.Users;
import com.contact.service.ImagekitService;
import com.contact.util.HttpStatus;
import com.contact.util.exception.ContactExistException;
import com.contact.util.reposetry.ContactRepository;
import com.contact.util.reposetry.UserRepository;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.*;

@Component
public class ContactDAO {

    private final ContactRepository contactRepository;
    private final UserDAO userDAO;
    private final ImagekitService imagekitService;


    public ContactDAO(ContactRepository contactRepository, UserDAO userDAO, ImagekitService imagekitService) {
        this.contactRepository = contactRepository;
        this.userDAO = userDAO;
        this.imagekitService = imagekitService;

    }

    public Contacts createContact(UUID userID, ContactDTO contactDTO) {
        if (contactRepository.existsByUserIdAndPhone(userID, contactDTO.getPhone())) {
            throw new ContactExistException("Contact already exist");
        }
        try {
            Users users = userDAO.findUserById(userID);
            Contacts contacts = contactDAOToContact(contactDTO);
            contacts.setUsers(users);
            return contactRepository.save(contacts);
        } catch (NoSuchElementException e) {
            throw new NoSuchElementException(e);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    public Contacts showContacts(UUID contactID) {
        try {
            return contactRepository.findById(contactID).orElseThrow(() -> new NoSuchElementException("No Contact exist"));

        } catch (NoSuchElementException e) {
            throw new NoSuchElementException(e);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
//            return new HttpStatus(500);
        }
    }

    public Contacts updateContact(UUID userID, ContactDTO contactDTO) {

        System.err.println("updateContact=>  " + contactDTO.toString());
        try {
            Contacts contacts = contactRepository.findByUserIdAndContactId(userID, contactDTO.getContactID()).orElseThrow();
            if (contactDTO.getMediaId() != null) {
                imagekitService.deleteFile(contacts.getMediaId());
                contacts.setMediaUrl(contactDTO.getMediaUrl());
                contacts.setMediaId(contactDTO.getMediaId());
            }

            if (StringUtils.hasText(contactDTO.getName())) {
                contacts.setName(contactDTO.getName());
            }
            if (StringUtils.hasText(contactDTO.getEmail())) {
                contacts.setEmail(contactDTO.getEmail());
            }

            return contactRepository.save(contacts);

        } catch (NoSuchElementException e) {
            throw new NoSuchElementException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<Contacts> showAllContact(UUID userID) {

        try {
            return contactRepository.findByUserId(userID).orElseThrow(() -> new NoSuchElementException("User doesn't exist"));

        } catch (NoSuchElementException e) {
            throw new NoSuchElementException(e);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteContact(UUID contactID) {
        try {
            Contacts contacts = contactRepository.findById(contactID).orElseThrow(() -> new NoSuchElementException("No element found"));
            contactRepository.deleteById(contactID);
            imagekitService.deleteFile(contacts.getMediaId());
        } catch (NoSuchElementException e) {
            throw new NoSuchElementException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private boolean isContactExist(UUID contactId) {
        return contactRepository.existsById(contactId);
    }

    private Contacts contactDAOToContact(ContactDTO contactDTO) {
        return new Contacts(contactDTO.getMediaUrl(), contactDTO.getMediaId(), contactDTO.getName(), contactDTO.getEmail(), contactDTO.getPhone());

    }


}
