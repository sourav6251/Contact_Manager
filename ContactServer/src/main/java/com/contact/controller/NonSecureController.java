package com.contact.controller;

import com.contact.dto.UserDTO;
import com.contact.dto.imp.OnRegister;
import com.contact.model.Users;
import com.contact.service.UserService;
import com.contact.util.HttpStatus;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/api/v1")
public class NonSecureController {

    private final UserService userService;

    public NonSecureController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public  ResponseEntity<String> normal(){
        return ResponseEntity.ok("Everything is correct");
    }
    @PostMapping("/register")
    public ResponseEntity<Object> register(@Validated(OnRegister.class) @RequestBody UserDTO userDTO) {
        HttpStatus httpStatus = userService.register(userDTO);
        return ResponseEntity.status(httpStatus.statusCode()).body(httpStatus.data());
    }

    @GetMapping("/login")
    public ResponseEntity<Object> login(@RequestParam("email") String email, @RequestParam("password") String password , HttpServletResponse response) {
        HttpStatus status = userService.login(email, password);
//        Map<String, Object> dataMap = (Map<String, Object>) status.data();
//        Users user = (Users) dataMap.get("user");
//        String token = (String) dataMap.get("token");

        ResponseCookie cookie=ResponseCookie.from("AccessToken",status.cookies())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(15*24*60*60)
                .sameSite("Lax")
                .build();
        response.setHeader("Set-Cookie",cookie.toString());
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



}
