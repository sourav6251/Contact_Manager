package com.contact.dao;

import com.contact.dto.ContactDTO;
import com.contact.model.Contacts;
import com.contact.model.Users;
import com.contact.service.ImagekitService;
import com.contact.util.exception.ContactExistException;
import com.contact.util.exception.NotShareContact;
import com.contact.util.exception.OTPException;
import com.contact.util.reposetry.ContactRepository;
import com.contact.util.reposetry.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.random.RandomGenerator;

@Component
public class ContactDAO {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final UserDAO userDAO;
    private final ImagekitService imagekitService;


    public ContactDAO(ContactRepository contactRepository, UserDAO userDAO, ImagekitService imagekitService, UserRepository userRepository) {
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
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

    public Page<Contacts> showAllContactPagination(UUID userID, String query, int page, int contactNo) {

        Pageable pageable = PageRequest.of(page, contactNo);
        try {
            Page<Contacts> contacts = contactRepository.searchContacts(userID, query, pageable);
            System.out.println(contacts);
            System.out.println("contacts");
            if (contacts.hasContent()) {
                return contacts;
            }
            throw new NoSuchElementException("No contact exist");
        } catch (NoSuchElementException e) {

            throw new NoSuchElementException("No contact exist");
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

    }

    public String activateShareContact(UUID userID, UUID contactID, int days) {
        try {
            Contacts contacts = contactRepository.findByUserIdAndContactId(userID, contactID).orElseThrow(() -> new NoSuchElementException("Contact not exist"));
            RandomGenerator gen = RandomGenerator.getDefault();
            long otp = gen.nextInt(100000, 999999);
            contacts.setShare(true);
            contacts.setShareOTP(otp);
            contacts.setShareExpire(LocalDateTime.now(ZoneOffset.UTC).plusDays(days));
            contactRepository.save(contacts);
            Users users = userRepository.getReferenceById(userID);
            return users.getEmail();
        } catch (NoSuchElementException e) {
            throw new NoSuchElementException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String deleteShareContact(UUID userID, UUID contactID) {
        try {
            Contacts contacts = contactRepository.findByUserIdAndContactId(userID, contactID).orElseThrow(() -> new NoSuchElementException("Contact not exist"));
            contacts.setShare(false);
            contacts.setShareExpire(null);
            contacts.setShareOTP(0L);  //null
            contactRepository.save(contacts);
            return contacts.getEmail();
        } catch (NoSuchElementException e) {
            throw new NoSuchElementException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public ContactDTO verifyShareContact(UUID contactID, Long otp) {
        Contacts contacts = contactRepository
                .findById(contactID)
                .orElseThrow(() -> new NoSuchElementException("Contact not exist"));

        if (!contacts.isShare()) {
            throw new NotShareContact("OTP is not shared");
        }

        if (contacts.getShareOTP() == null || !Long.valueOf(contacts.getShareOTP()).equals(otp)) {
            throw new OTPException("Wrong OTP");
        }

        if (contacts.getShareExpire() == null || contacts.getShareExpire().isBefore(LocalDateTime.now())) {
            throw new OTPException("OTP expired");
        }
        return new ContactDTO(contacts.getContactId(), contacts.getMediaUrl(), contacts.getName(), contacts.getEmail(), contacts.getPhone());

    }


}
