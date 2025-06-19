package com.contact.service;

import com.contact.dao.ContactDAO;
import com.contact.dto.ContactDTO;
import com.contact.model.Contacts;
import com.contact.util.HttpStatus;
import com.contact.util.exception.ContactExistException;
import com.contact.util.exception.NotImage;
import com.contact.util.exception.NotShareContact;
import com.contact.util.exception.OTPException;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ContactService {

    private final ContactDAO contactDAO;
    private final ImagekitService imagekitService;


    public ContactService(ContactDAO contactDAO, ImagekitService imagekitService) {
        this.contactDAO = contactDAO;
        this.imagekitService = imagekitService;


    }

    public HttpStatus createContact(UUID userID, ContactDTO contactDTO) {
        String mediaID;
        String mediaURL;
        try {
            List<String> list = imagekitService.uploadFile(contactDTO.getFile());
            mediaURL = list.getFirst();
            mediaID = list.getLast();
        } catch (NotImage e) {
            return new HttpStatus(400, e.getMessage());
        } catch (Exception e) {
            return new HttpStatus(500);
        }
        ContactDTO contactDTO1 = new ContactDTO(mediaURL, mediaID, contactDTO.getName(), contactDTO.getEmail(), contactDTO.getPhone());
        try {
            Contacts contacts = contactDAO.createContact(userID, contactDTO1);
            return new HttpStatus(200, contacts);
        } catch (NoSuchElementException e) {
            return new HttpStatus(400, "User doesn't exist");
        } catch (ContactExistException e) {
            if (mediaID !=null && !mediaID.isBlank()){
//                try{
                    imagekitService.deleteFile(mediaID);
//                } catch (RuntimeException ex) {
//                    throw new RuntimeException(ex);
//                }
            }
            return new HttpStatus(400, e.getMessage());
        } catch (RuntimeException e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus updateContact(UUID userID, ContactDTO contactDTO) {
        String mediaID = null;
        String mediaURL = null;
        if (contactDTO.getFile() != null) {
            try {
                List<String> list = imagekitService.uploadFile(contactDTO.getFile());
                mediaURL = list.getFirst();
                mediaID = list.getLast();
                contactDTO.setMediaUrl(mediaURL);
                contactDTO.setMediaId(mediaID);
            } catch (NotImage e) {
                return new HttpStatus(400, e.getMessage());
            } catch (Exception e) {
                return new HttpStatus(500);
            }
        }
        try {
            Contacts contacts = contactDAO.updateContact(userID, contactDTO);
            return new HttpStatus(200, contacts);

        } catch (NoSuchElementException e) {
            return new HttpStatus(204, e);
        } catch (RuntimeException e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus showAllContact(UUID userID) {
        try {
            List<Contacts> contacts = contactDAO.showAllContact(userID);
            return new HttpStatus(200, contacts);
        } catch (NoSuchElementException e) {
            return new HttpStatus(204, "No data found");
        } catch (RuntimeException e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus showContacts(UUID contactID) {
        try {
            Contacts contacts = contactDAO.showContacts(contactID);
            return new HttpStatus(200, contacts);
        } catch (NoSuchElementException e) {
            return new HttpStatus(204, e);
        } catch (RuntimeException e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus deleteContact(UUID contactID) {
        try {
            contactDAO.deleteContact(contactID);
            return new HttpStatus(200);
        } catch (NoSuchElementException e) {
            return new HttpStatus(400, e);
        } catch (RuntimeException e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus showAllContactPagination(UUID userID, String query, int page, int contactNo) {
        try {
            Page<Contacts> contacts = contactDAO.showAllContactPagination(userID, query, page, contactNo);
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "success");
            response.put("data", contacts.getContent());
            response.put("currentPage", contacts.getNumber());
            response.put("totalItems", contacts.getTotalElements());
            response.put("totalPages", contacts.getTotalPages());
            response.put("pageSize", contacts.getSize());
            System.out.println(response);
            System.out.println("nn\n\n\nresponse");
            return new HttpStatus(200, response);

        } catch (NoSuchElementException e) {
            return new HttpStatus(204, "Contact not exist");
        } catch (Exception e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus activateShareContact(UUID userID, UUID contactID, int days) {
        try {
            String email = contactDAO.activateShareContact(userID, contactID, days);
            return new HttpStatus(200, email);
        } catch (NoSuchElementException e) {
            return new HttpStatus(204);
        } catch (Exception e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus deleteShareContact(UUID userID, UUID contactID) {
        try {
            String email = contactDAO.deleteShareContact(userID, contactID);
            return new HttpStatus(200, email);
        } catch (NoSuchElementException e) {
            return new HttpStatus(204);
        } catch (Exception e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus verifyShareContact(  UUID contactID,Long otp) {
        try {
            ContactDTO email = contactDAO.verifyShareContact( contactID,otp);
            return new HttpStatus(200, email);
        }  catch (NotShareContact |NoSuchElementException | OTPException e) {

            return new HttpStatus(400,e.getMessage());
        } catch (Exception e) {
            return new HttpStatus(500);
        }
    }

}
