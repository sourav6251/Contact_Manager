package com.contact.dao;

import com.contact.dto.UserDTO;
import com.contact.model.Users;
import com.contact.util.HttpStatus;
import com.contact.util.exception.LoginException;
import com.contact.util.exception.OTPException;
import com.contact.util.reposetry.UserRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class UserDAO {

    private final UserRepository userRepository;

    public UserDAO(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public int register(UserDTO userDTO) {
        if (userDTO.getMediaUrl() == null && userDTO.getMediaUrl().isEmpty()) {
            Random random = new Random();
            int number = random.nextInt(10) + 1;
            switch (number) {
                case 1 ->
                        userDTO.setMediaUrl("https://res.cloudinary.com/dkxei4b5s/image/upload/v1746410084/emoji1_dvb2ef.png");
                case 2 ->
                        userDTO.setMediaUrl("https://res.cloudinary.com/dkxei4b5s/image/upload/v1746410151/emoji2_bnsus6.png");
                case 3 ->
                        userDTO.setMediaUrl("https://res.cloudinary.com/dkxei4b5s/image/upload/v1746410265/emoji3_m20ujv.png");
                case 4 ->
                        userDTO.setMediaUrl("https://res.cloudinary.com/dkxei4b5s/image/upload/v1746410263/emoji4_es7xwx.png");
                case 5 ->
                        userDTO.setMediaUrl("https://res.cloudinary.com/dkxei4b5s/image/upload/v1746410495/emoji5_zuifdc.png");
                case 6 ->
                        userDTO.setMediaUrl("https://res.cloudinary.com/dkxei4b5s/image/upload/v1746410495/emoji6_ya0y7h.png");
                case 7 ->
                        userDTO.setMediaUrl("https://res.cloudinary.com/dkxei4b5s/image/upload/v1746410495/emoji7_z7nfgm.png");
                case 8 ->
                        userDTO.setMediaUrl("https://res.cloudinary.com/dkxei4b5s/image/upload/v1746410495/emoji8_vmvzs4.png");
                case 9 ->
                        userDTO.setMediaUrl("https://res.cloudinary.com/dkxei4b5s/image/upload/v1746410493/emoji9_cbqsta.png");
                default ->
                        userDTO.setMediaUrl("https://res.cloudinary.com/dkxei4b5s/image/upload/v1746410493/emoji10_y8yzyd.png");
            }


        }
        if (!checkUserByEmail(userDTO.getEmail())) {
            Users users = userDtoToUsers(userDTO, LocalDateTime.now());

            try {
                userRepository.save(users);
                return 200;
            } catch (Exception e) {
                return 500;
            }
        }
        return 400;
    }

    public Users login(String email, String password) {
        try {
            Users users = userRepository.findByEmail(email);
            if (users.getPassword().equals(password)) {
                return users;
            }
            throw new LoginException("Enter Correct Password");
        } catch (NoSuchElementException e) {
            throw new NoSuchElementException("User Doesn't exist ");
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Users> showUser() {
        return userRepository.findAll();
    }

    public int updateProfile(UserDTO userDTO, UUID userID) {

        if (checkUser(userID)) {
            try {
                Users users = userRepository.findById(userID).orElseThrow();

                if (userDTO.getMediaUrl() != null && !userDTO.getMediaUrl().isBlank()) {
                    users.setMediaUrl(userDTO.getMediaUrl());
                }
                if (userDTO.getMediaId() != null && !userDTO.getMediaId().isBlank()) {
                    users.setMediaId(userDTO.getMediaId());
                }
                if (userDTO.getName() != null && !userDTO.getName().isBlank()) {
                    users.setName(userDTO.getName());
                }
//                if (userDTO.getEmail() != null && !userDTO.getEmail().isBlank()) {
//                    users.setEmail(userDTO.getEmail());
//                }

                userRepository.save(users);
                return 200;
            } catch (Exception e) {
                return 500;
            }

        } else {
            return 404;
        }
    }

    public boolean checkUser(UUID userID) {
        return userRepository.existsById(userID);
    }

    public boolean checkUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Users findUserById(UUID userID) {
        return userRepository.findById(userID).orElseThrow();
    }

    private Users userDtoToUsers(UserDTO userDTO, LocalDateTime localDateTime) {
        return new Users(
                userDTO.getUserId(),
                userDTO.getMediaUrl(),
                userDTO.getMediaId(),
                userDTO.getName(),
                userDTO.getEmail(),
                userDTO.getNewPassword(),
                userDTO.getOtp(),
                userDTO.getOtpCreate(),
                localDateTime,
                LocalDateTime.now(),
                null
        );
    }

    //    public HttpStatus showUserByID(UUID userID) {
//        try {
//            Users users = userRepository.findById(userID).orElseThrow();
//            return new HttpStatus(200, users);
//        } catch (NoSuchElementException e) {
//            return new HttpStatus(400, "User Doesn't found");
//        } catch (Exception e) {
//            return new HttpStatus(500);
//        }
//    }
    public HttpStatus showUserByID(UUID userID) {
        try {
            Users user = userRepository.findById(userID).orElseThrow();

            // Create a response map
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("user", user);
            responseData.put("totalContacts", user.getContacts() != null ? user.getContacts().size() : 0);

            return new HttpStatus(200, responseData);

        } catch (NoSuchElementException e) {
            return new HttpStatus(400, "User Doesn't found");
        } catch (Exception e) {
            return new HttpStatus(500);
        }
    }

    public HttpStatus deleteUser(UUID userID) {
        try {
            userRepository.deleteById(userID);
            return new HttpStatus(200);
        } catch (Exception e) {
            return new HttpStatus(500);
        }
    }

    public void generateOTP(long otp, String email) {
        try {
            Users users = userRepository.findByEmail(email);
            users.setOtp(otp);
            users.setOtpCreate(LocalDateTime.now());
            userRepository.save(users);
        } catch (NoSuchElementException e) {
            throw new NoSuchElementException("User not found");
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    public void verifyOTP(String email, long otp) {
        Users users;
        try {
            users = userRepository.findByEmail(email);
        } catch (NoSuchElementException e) {
            throw new NoSuchElementException("User not found");
        }

        long existingOTP = users.getOtp();
        LocalDateTime otpCreateTime = users.getOtpCreate();

        if (existingOTP != otp) {
            throw new OTPException("Enter valid OTP");
        }

        if (otpCreateTime.plusMinutes(5).isBefore(LocalDateTime.now())) {
            throw new OTPException("OTP expired");
        }
        users.setOtp(0);
        users.setOtpCreate(null);
        users.setVerify(true);
        try {
            userRepository.save(users);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }


}


