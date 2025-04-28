package com.contact.dao;

import com.contact.dto.ContactDTO;
import com.contact.model.Contacts;
import com.contact.model.Users;
import com.contact.util.HttpStatus;
import com.contact.util.reposetry.ContactRepository;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Component
public class ContactDAO {

    private final ContactRepository contactRepository;
    private final UserDAO userDAO;

    public ContactDAO(ContactRepository contactRepository, UserDAO userDAO) {
        this.contactRepository = contactRepository;
        this.userDAO = userDAO;
    }

    public int createContact(UUID userID, ContactDTO contactDTO) {
        if (userDAO.checkUser(userID)) {
            if (contactRepository.existsByUserIdAndPhone(userID, contactDTO.getPhone())) {
                return 400;
            }
            try {
                Users users = userDAO.findUserById(userID);
                Contacts contacts = contactDAOToContact(contactDTO);
                contacts.setUsers(users);
                contactRepository.save(contacts);
                return 201;
            } catch (Exception e) {
                return 500;
            }
        }

        return 404;
    }


//    public HttpStatus updateContact(UUID userID, UUID contactID, ContactDTO contactDTO) {
////        if (userDAO.checkUser(userID)) {
////        if (isContactExist(contactID)) {
//            try {
//                Contacts contacts = contactRepository.findByUserIdAndContactId(userID, contactID).orElseThrow();
////                Contacts convertContact=contactDAOToContact(contactDTO);
//                if (!contactDTO.getMediaUrl().isBlank()) {
//                    contacts.setMediaUrl(contactDTO.getMediaUrl());
//                }
//                if (!contactDTO.getMediaId().isBlank()) {
//                    contacts.setMediaId(contactDTO.getMediaId());
//                }
//                if (!contactDTO.getName().isBlank()) {
//                    contacts.setName(contactDTO.getName());
//                }
//                if (!contactDTO.getEmail().isBlank()) {
//                    contacts.setEmail(contactDTO.getEmail());
//                }
//                contactRepository.save(contacts);
//                return new HttpStatus(200);
//            } catch (NoSuchElementException e) {
//                return new HttpStatus(400, "Contact not found");
//            } catch (Exception e) {
//                return new HttpStatus(500);
//            }
////            }
////            return new HttpStatus(400,"Contact not found");
////        }
////        return new HttpStatus(400, "Contact not found");
//
//    }
//

    public HttpStatus showContacts(UUID contactID){
        try{
            Contacts  contacts=contactRepository.findById(contactID).orElseThrow();
            return new HttpStatus(200,contacts);
        } catch (NoSuchElementException e) {
            return new HttpStatus(400,"Contact not found");
        } catch (Exception e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus updateContact(UUID userID, UUID contactID, ContactDTO contactDTO) {
        try {
            Contacts contacts = contactRepository.findByUserIdAndContactId(userID, contactID).orElseThrow();

            if (StringUtils.hasText(contactDTO.getMediaUrl())) {
                contacts.setMediaUrl(contactDTO.getMediaUrl());
            }
            if (StringUtils.hasText(contactDTO.getMediaId())) {
                contacts.setMediaId(contactDTO.getMediaId());
            }
            if (StringUtils.hasText(contactDTO.getName())) {
                contacts.setName(contactDTO.getName());
            }
            if (StringUtils.hasText(contactDTO.getEmail())) {
                contacts.setEmail(contactDTO.getEmail());
            }

            contactRepository.save(contacts);
            return new HttpStatus(200);

        } catch (NoSuchElementException e) {
            return new HttpStatus(400, "Contact not found");
        } catch (Exception e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus showAllContact(UUID userID) {
        if (userDAO.checkUser(userID)) {

            Optional<List<Contacts>> contactsList = contactRepository.findByUserId(userID);
            if (contactsList.isPresent() && !contactsList.get().isEmpty()) {
                return new HttpStatus(200, contactsList.get());
            } else {
                return new HttpStatus(204);
            }
        }
        return new HttpStatus(400, "User doesn't exist");
    }

    public HttpStatus deleteContact(UUID contactID) {
        try{
            contactRepository.deleteById(contactID);
            return new HttpStatus(200);
        }catch (Exception e){
            return new HttpStatus(500);
        }
    }

    private boolean isContactExist(UUID contactId) {
        return contactRepository.existsById(contactId);
    }

    private Contacts contactDAOToContact(ContactDTO contactDTO) {
        return new Contacts(contactDTO.getMediaUrl(), contactDTO.getMediaId(), contactDTO.getName(), contactDTO.getEmail(), contactDTO.getPhone());

    }

}
