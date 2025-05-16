package com.contact.dao;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.contact.dto.ContactDTO;
import com.contact.model.Contacts;
import com.contact.model.Users;
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
    private final Cloudinary cloudinary;

    public void deleteFileFromCloudinary(String publicId) {
        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            if ("ok".equals(result.get("result"))) {
                System.out.println("File deleted successfully from Cloudinary.");
            } else {
//                System.errout.println("Cloudinary deletion failed: " + result);
                System.err.println("Cloudinary deletion failed: " + result);
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Exception occurred while deleting file from Cloudinary.");
        }
    }


    public ContactDAO(ContactRepository contactRepository, UserDAO userDAO) {
        this.contactRepository = contactRepository;
        this.userDAO = userDAO;
        Dotenv dotenv = Dotenv.load();
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", dotenv.get("CLOUDINARY_CLOUD_NAME"),
                "api_key", dotenv.get("CLOUDINARY_API_KEY"),
                "api_secret", dotenv.get("CLOUDINARY_API_SECRET")
        ));
    }

    public Contacts createContact(UUID userID, ContactDTO contactDTO) {
//        if (userDAO.checkUser(userID)) {
            if (contactRepository.existsByUserIdAndPhone(userID, contactDTO.getPhone())) {
                throw new ContactExistException("Contact already exist");
            }
            try {
                Users users = userDAO.findUserById(userID);
                Contacts contacts = contactDAOToContact(contactDTO);
                contacts.setUsers(users);
               return contactRepository.save(contacts);
//                return 201;
            } catch (NoSuchElementException e) {
                throw new NoSuchElementException(e);
            } catch (RuntimeException e) {
                throw new RuntimeException(e);
            }
//        }

//        return 404;
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

    public Contacts showContacts(UUID contactID){
        try{
            return  contactRepository.findById(contactID).orElseThrow(()->new NoSuchElementException("No Contact exist"));

        } catch (NoSuchElementException e) {
            throw new NoSuchElementException(e);
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
//            return new HttpStatus(500);
        }
    }

    public Contacts updateContact(UUID userID, UUID contactID, ContactDTO contactDTO) {

        try {
            Contacts contacts = contactRepository.findByUserIdAndContactId(userID, contactID).orElseThrow();
            if (!contactDTO.getMediaId().equals(contacts.getMediaId())){
                deleteFileFromCloudinary(contacts.getMediaId());
            }
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

            return  contactRepository.save(contacts);

        } catch (NoSuchElementException e) {
            throw new NoSuchElementException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<Contacts> showAllContact(UUID userID) {
//        if (userDAO.checkUser(userID)) {

        try{
            return contactRepository.findByUserId(userID).orElseThrow(() -> new NoSuchElementException("User doesn't exist"));

        } catch (NoSuchElementException e) {
            throw new NoSuchElementException(e);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteContact(UUID contactID) {
        try{
            Contacts contacts=contactRepository.findById(contactID).orElseThrow(()->new NoSuchElementException("No element found"));
            contactRepository.deleteById(contactID);
            deleteFileFromCloudinary(contacts.getMediaId());
//            return new HttpStatus(200,contacts.getMediaId());
        }catch (NoSuchElementException e){
            throw new NoSuchElementException(e);
        }
        catch (Exception e){
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
