package com.contact.util;


import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Component
public class JWTUtil {
    private final String secret;

    public JWTUtil() {
        Dotenv dotenv = Dotenv.load();
        secret = dotenv.get("JWT_SECRETE");
    }

    public boolean isExpire(String token) {
        Date expireDate = extractClaims(token, Claims::getExpiration);
        return new Date().after(expireDate);

    }

    public String extractUserName(String token) {
        return extractClaims(token, Claims::getSubject);
    }


    public boolean isValid(String token, String userName) {
        String extractUserName = extractClaims(token, Claims::getSubject);
        boolean isExpire = isExpire(token);
        return extractUserName.equals(userName) && !isExpire;

    }

    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(secret.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsTFunction.apply(claims);
    }


//    private Claims extractAllClaims(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(secret.getBytes())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }


//    private Claims claims(){
//        Claims claims=new  DefaultClaims();
//    }

    public String jwtGenerator(UserDetails userDetails, UUID userID) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userID);
//        claims.put("role", role); // Or userDetails.getAuthorities() if needed
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setExpiration(new Date(System.currentTimeMillis() + 15L * 24 * 60 * 60 * 1000))//15days 60 * 60 * 24 * 1000
                .setIssuedAt(new Date())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
