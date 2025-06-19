package com.contact.controller;

import com.contact.dto.ClientHeadersDTO;
import com.contact.dto.UserDTO;
import com.contact.dto.imp.OnRegister;
import com.contact.dto.imp.Test;
import com.contact.service.ContactService;
import com.contact.service.ImagekitService;
import com.contact.service.UserService;
import com.contact.util.ExtractClientHeaders;
import com.contact.util.HttpStatus;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class NonSecureController {
    @Autowired
    private ImagekitService imagekitService;

    private final UserService userService;
    private final ContactService contactService;

    public NonSecureController(UserService userService , ContactService contactService ) {
        this.userService = userService;
        this.contactService = contactService;
    }

    @GetMapping("/")
    public ResponseEntity<String> normal() {
        return ResponseEntity.ok("Everything is correct");
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@ExtractClientHeaders ClientHeadersDTO clientHeadersDTO,@Validated(OnRegister.class) @RequestBody UserDTO userDTO) {
        System.err.println("userDTO=>" + userDTO.toString());
        HttpStatus httpStatus = userService.register(userDTO,clientHeadersDTO);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }

    @GetMapping("/login")
    public ResponseEntity<Object> login(@ExtractClientHeaders ClientHeadersDTO clientHeadersDTO, @RequestParam("email") String email, @RequestParam("password") String password, HttpServletResponse response) {
        HttpStatus status = userService.login(email, password,clientHeadersDTO);
//        Map<String, Object> dataMap = (Map<String, Object>) status.data();
//        Users user = (Users) dataMap.get("user");
//        String token = (String) dataMap.get("token");
        System.err.println(clientHeadersDTO.toString());
        if (status.statusCode() == 200) {

            ResponseCookie cookie = ResponseCookie.from("AccessToken", status.cookies())
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(15 * 24 * 60 * 60)
                    .sameSite("Lax")
                    .build();
            response.setHeader("Set-Cookie", cookie.toString());
        }

        System.err.println(status.data().toString());
        return ResponseEntity.status(status.statusCode()).body(status.data());
    }

    @GetMapping("/logout")
    public ResponseEntity<Object> logout(HttpServletResponse response) {
        System.err.println("Enter into logout");
        ResponseCookie cookie = ResponseCookie.from("AccessToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0) // <-- expire cookie
                .sameSite("Lax")
                .build();

        response.setHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.ok().body("Logged out successfully");
    }

    @PostMapping("/upload")
    public ResponseEntity<Object> upload(@Validated(Test.class) @ModelAttribute  UserDTO userDTO){
        MultipartFile file= userDTO.getFile();
       List<String> result= imagekitService.uploadFile(file);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/delete/{ID}")
    public ResponseEntity<Object> delete(@PathVariable("ID") String ID){
       boolean result= imagekitService.deleteFile(ID);
        return ResponseEntity.ok(result);
    }



    @GetMapping("/verifysharecontact")
    public ResponseEntity<Object> verifyShareContact(@RequestParam("contactID") UUID contactID, @RequestParam("otp") Long otp) {
        HttpStatus httpStatus=contactService.verifyShareContact( contactID,otp);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }

}
