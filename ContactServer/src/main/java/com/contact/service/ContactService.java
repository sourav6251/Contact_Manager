package com.contact.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.contact.dao.ContactDAO;
import com.contact.dto.ContactDTO;
import com.contact.model.Contacts;
import com.contact.util.HttpStatus;
import com.contact.util.exception.ContactExistException;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class ContactService {

    private final ContactDAO contactDAO;
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

    public ContactService(ContactDAO contactDAO) {
        this.contactDAO = contactDAO;

        Dotenv dotenv = Dotenv.load();
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", dotenv.get("CLOUDINARY_CLOUD_NAME"),
                "api_key", dotenv.get("CLOUDINARY_API_KEY"),
                "api_secret", dotenv.get("CLOUDINARY_API_SECRET")
        ));
    }

    public HttpStatus createContact(UUID userID, ContactDTO contactDTO) {
        try {
            Contacts contacts = contactDAO.createContact(userID, contactDTO);
            return new HttpStatus(200, contacts);
        } catch (NoSuchElementException e) {
            return new HttpStatus(400, "User doesn't exist");
        } catch (ContactExistException e) {
            return new HttpStatus(400, e.getMessage());
        } catch (RuntimeException e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus updateContact(UUID userID, UUID contactID, ContactDTO contactDTO) {
        try{
            Contacts contacts=contactDAO.updateContact(userID, contactID, contactDTO);
            return new HttpStatus(200,contacts);

        }catch (NoSuchElementException e){
            return new HttpStatus(204,e);
        } catch (RuntimeException e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus showAllContact(UUID userID) {
        try{
            List<Contacts> contacts= contactDAO.showAllContact(userID);
            return new HttpStatus(200,contacts);
        }catch (NoSuchElementException e){
            return new HttpStatus(204,"No data found");
        } catch (RuntimeException e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus showContacts(UUID contactID) {
        try {
           Contacts contacts= contactDAO.showContacts(contactID);
            return new HttpStatus(200,contacts);
        } catch (NoSuchElementException e) {
            return new HttpStatus(204, e);
        } catch (RuntimeException e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus deleteContact(UUID contactID) {
        try{
            contactDAO.deleteContact(contactID);
            return new HttpStatus(200);
        }catch (NoSuchElementException e){
            return new HttpStatus(400,e);
        } catch (RuntimeException e) {
            return new HttpStatus(500);
        }
    }

    // You can now use `cloudinary` to delete or upload images
}
