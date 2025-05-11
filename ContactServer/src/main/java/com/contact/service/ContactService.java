package com.contact.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.contact.dao.ContactDAO;
import com.contact.dto.ContactDTO;
import com.contact.model.Contacts;
import com.contact.util.HttpStatus;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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
        int status = contactDAO.createContact(userID, contactDTO);
        return switch (status) {
            case 201 -> new HttpStatus(200, "Contact saved successfully");
            case 404 -> new HttpStatus(404, "User not found");
            case 400 -> new HttpStatus(400, "Phone number already exists");
            default -> new HttpStatus(500);
        };
    }

    public HttpStatus updateContact(UUID userID, UUID contactID, ContactDTO contactDTO) {
        return contactDAO.updateContact(userID, contactID, contactDTO);
    }

    public HttpStatus showAllContact(UUID userID) {
        return contactDAO.showAllContact(userID);
    }

    public HttpStatus showContacts(UUID contactID) {
        return contactDAO.showContacts(contactID);
    }

    public HttpStatus deleteContact(UUID contactID) {
        HttpStatus httpStatus = contactDAO.deleteContact(contactID);
        if (httpStatus.statusCode() == 200) {
            try {
                deleteFileFromCloudinary(httpStatus.data().toString());
            } catch (RuntimeException e) {
                throw new RuntimeException(e);
            }

        }
        return httpStatus;
    }

    // You can now use `cloudinary` to delete or upload images
}
