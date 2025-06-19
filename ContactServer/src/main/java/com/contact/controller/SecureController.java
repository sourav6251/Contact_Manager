package com.contact.controller;

import com.contact.dto.*;
import com.contact.dto.imp.CreateContact;
import com.contact.service.ContactService;
import com.contact.service.UserService;
import com.contact.util.ExtractClientHeaders;
import com.contact.util.HttpStatus;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController()
@RequestMapping("/secure")
public class SecureController {
    private final UserService userService;
    private final ContactService contactService;

    public SecureController(UserService userService, ContactService contactService) {
        this.userService = userService;
        this.contactService = contactService;
    }

    @GetMapping("/")
    public ResponseEntity<Object> hello() {
        return ResponseEntity.ok("Code work properly");
    }


    @GetMapping("/generateotp/{userID}")
    public ResponseEntity<Object> generateOTP(@ExtractClientHeaders ClientHeadersDTO clientHeadersDTO, @PathVariable UUID userID, @RequestParam("otpFor") String otpFor) {
        System.err.println(userID);
        HttpStatus status = userService.generateOTP(userID, otpFor, clientHeadersDTO);
        return ResponseEntity.status(status.statusCode()).body(status.data());
    }

    @GetMapping("/verifyotp/{userID}")
    public ResponseEntity<Object> verifyOTP(@RequestParam("userID") UUID userID, @RequestParam("otp") long otp) {
        HttpStatus status = userService.verifyOTP(userID, otp);
        return ResponseEntity.status(status.statusCode()).body(status.data());

    }

    @GetMapping("showuser")
    public ResponseEntity<?> showUser() {
        HttpStatus httpStatus = userService.showUser();
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());

    }

    @PutMapping("/updateprofile/{userID}")
    public ResponseEntity<Object> updateProfile(@ExtractClientHeaders ClientHeadersDTO clientHeadersDTO, @PathVariable UUID userID, @ModelAttribute UserDTO userDTO) {
        HttpStatus httpStatus = userService.updateProfile(userDTO, userID, clientHeadersDTO);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }

    @GetMapping("/showuserbyid/{userID}")
    public ResponseEntity<Object> showUserByID(@PathVariable UUID userID) {
        HttpStatus httpStatus = userService.showUserByID(userID);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }

    @PutMapping("/updateoldpassword/{userID}")
    public ResponseEntity<Object> updateOldPassword(@ExtractClientHeaders ClientHeadersDTO clientHeadersDTO, @PathVariable UUID userID, @RequestBody UserDTO userDTO) {
        HttpStatus httpStatus = userService.updatePasswordWithOldPassword(userID, userDTO, clientHeadersDTO);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());

    }

    @PutMapping("/updatepassword/{userID}")
    public ResponseEntity<Object> updatePassword(@PathVariable UUID userID, @RequestBody UserDTO userDTO) {
        HttpStatus httpStatus = userService.updatePasswordWithPassword(userID, userDTO);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());

    }


    @DeleteMapping("/deleteuser/{userID}")
    public ResponseEntity<Object> deleteUser(@PathVariable UUID userID, HttpServletResponse response) {
        HttpStatus httpStatus = userService.deleteUser(userID);
        ResponseCookie cookie = ResponseCookie.from("AccessToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0) // <-- expire cookie
                .sameSite("Lax")
                .build();

        response.setHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }


    @GetMapping("/isverified/{userID}")
    public ResponseEntity<Object> isVerifiedProfile(@PathVariable UUID userID) {
        HttpStatus httpStatus = userService.isVerifiedProfile(userID);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }


    @PostMapping("/createcontact/{userID}")
    public ResponseEntity<Object> createContact(@PathVariable UUID userID, @Validated(CreateContact.class) @ModelAttribute ContactDTO contactDTO) {
        System.out.println("data=>" + contactDTO);
        HttpStatus httpStatus = contactService.createContact(userID, contactDTO);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }

    @PutMapping("/updatecontact/{userID}")
    public ResponseEntity<Object> updateContact(@PathVariable("userID") UUID userID, @ModelAttribute ContactDTO contactDTO) {
        HttpStatus httpStatus = contactService.updateContact(userID, contactDTO);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }

    @GetMapping("/showallcontact/{userID}")
    public ResponseEntity<Object> showAllContact(@PathVariable UUID userID) {
        HttpStatus httpStatus = contactService.showAllContact(userID);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());

    }

    @DeleteMapping("/deletecontact/{userID}")
    public ResponseEntity<Object> deleteContact(@PathVariable UUID userID, @RequestParam("contactID") UUID contactID) {
        System.err.println("contactID=> " + contactID + " " + userID);
        HttpStatus httpStatus = contactService.deleteContact(contactID);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }

    @GetMapping("/contactpage")
    public ResponseEntity<Object> showAllContactPagination(@RequestParam("UserID") UUID userID, @RequestParam(value = "query", required = false) String Query, @RequestParam(value = "page", defaultValue = "1") int Page, @RequestParam(value = "contactno", defaultValue = "10") int ContactNo) {
        if (Page - 1 < 0 || ContactNo < 1) {
            return ResponseEntity.badRequest().body("page No minimum 0 and and page size must greater then 1");

        }
        HttpStatus httpStatus = contactService.showAllContactPagination(userID, Query, Page - 1, ContactNo);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());

    }

    @GetMapping("/activatesharecontact/{userID}")
    public ResponseEntity<Object> activateShareContact(@PathVariable UUID userID, @RequestParam("userID") UUID userId, @RequestParam("contactID") UUID contactID, @RequestParam("days") int days) {
        HttpStatus httpStatus=contactService.activateShareContact(userId, contactID, days);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }

    @GetMapping("/deletesharecontact/{userID}")
    public ResponseEntity<Object> deleteShareContact(@PathVariable UUID userID, @RequestParam("userID") UUID userId, @RequestParam("contactID") UUID contactID) {
        HttpStatus httpStatus=contactService.deleteShareContact(userId, contactID);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }


}
