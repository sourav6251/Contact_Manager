package com.contact.controller;

import com.contact.dto.*;
import com.contact.dto.imp.CreateContact;
import com.contact.dto.imp.OnRegister;
import com.contact.service.ContactService;
import com.contact.service.UserService;
import com.contact.util.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

//@CrossOrigin("http://localhost:5236/")
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

    /**
     * {@code User}
     */

//    @PostMapping("/register")
//    public ResponseEntity<Object> register(@Validated(OnRegister.class) @RequestBody UserDTO userDTO) {
//        HttpStatus httpStatus = userService.register(userDTO);
//        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
//    }

//    @GetMapping("/login")
//    public ResponseEntity<Object> login(@RequestParam("email") String email, @RequestParam("password") String password ,HttpServletResponse response) {
//        HttpStatus status = userService.login(email, password);
//        ResponseCookie cookie=ResponseCookie.from("AccessToken","hi")
//                .httpOnly(true)
//                .secure(false)
//                .path("/")
//                .maxAge(15*24*60*60)
//                .sameSite("Lax")
//                .build();
//        response.setHeader("Set-Cookie",cookie.toString());
//        return ResponseEntity.status(status.statusCode()).body(status.data());
//    }

//    @GetMapping("/logout")
//    public ResponseEntity<Object> logout(HttpServletResponse response) {
//        System.err.println("Enter into logout");
//        ResponseCookie cookie = ResponseCookie.from("AccessToken", "")
//                .httpOnly(true)
//                .secure(false)
//                .path("/")
//                .maxAge(0) // <-- expire cookie
//                .sameSite("Lax")
//                .build();
//
//        response.setHeader("Set-Cookie", cookie.toString());
//        return ResponseEntity.ok().body("Logged out successfully");
//    }
//

    @GetMapping("/generateotp/{userID}")
    public ResponseEntity<Object> generateOTP(@PathVariable UUID userID) {
        System.err.println(userID);
        HttpStatus status = userService.generateOTP(userID);
        return ResponseEntity.status(status.statusCode()).body(status.data());
    }

    @GetMapping("/verifyotp")
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
    public ResponseEntity<Object> updateProfile(@PathVariable UUID userID, @RequestBody UserDTO userDTO) {
        HttpStatus httpStatus = userService.updateProfile(userDTO, userID);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }

    @GetMapping("/showuserbyid/{userID}")
    public ResponseEntity<Object> showUserByID(@PathVariable UUID userID) {
        HttpStatus httpStatus = userService.showUserByID(userID);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }

    @PutMapping("/updateoldpassword/{userID}")
    public ResponseEntity<Object> updateOldPassword(@PathVariable UUID userID, @RequestBody UserDTO userDTO){
        HttpStatus httpStatus=userService.updatePasswordWithOldPassword(userID,userDTO);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());

    }
    @PutMapping("/updatepassword/{userID}")
    public ResponseEntity<Object> updatePassword(@PathVariable UUID userID, @RequestBody UserDTO userDTO){
        HttpStatus httpStatus=userService.updatePasswordWithPassword(userID,userDTO);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());

    }


    @DeleteMapping("/deleteuser/{userID}")
    public ResponseEntity<Object> deleteUser(@PathVariable UUID userID) {
        HttpStatus httpStatus = userService.deleteUser(userID);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }


    /**
     * {@code Contact}
     */
    @PostMapping("/createcontact/{userID}")
    public ResponseEntity<Object> createContact(@PathVariable UUID userID, @Validated(CreateContact.class) @RequestBody ContactDTO contactDTO) {
        System.out.println("data=>"+contactDTO);
        HttpStatus httpStatus = contactService.createContact(userID, contactDTO);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }

    @PutMapping("/updatecontact")
    public ResponseEntity<Object> updateContact(@RequestParam("userid") UUID userID, @RequestParam("contactid") UUID contactID, @RequestBody ContactDTO contactDTO) {
        HttpStatus httpStatus = contactService.updateContact(userID, contactID, contactDTO);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }

    @GetMapping("/showallcontact/{userID}")
    public ResponseEntity<Object> showAllContact(@PathVariable UUID userID) {
        HttpStatus httpStatus = contactService.showAllContact(userID);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());

    }

    @GetMapping("/showcontact/{contactID}")
    public ResponseEntity<Object> showContact(@PathVariable UUID contactID) {
        HttpStatus httpStatus = contactService.showContacts(contactID);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());

    }

    @DeleteMapping("/deletecontact/{contactID}")
    public ResponseEntity<Object> deleteContact(@PathVariable UUID contactID) {
        HttpStatus httpStatus = contactService.deleteContact(contactID);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }
}
