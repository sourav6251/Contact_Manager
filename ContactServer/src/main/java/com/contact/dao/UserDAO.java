package com.contact.dao;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.contact.dto.UserDTO;
import com.contact.util.exception.*;
import com.contact.model.Users;
import com.contact.util.reposetry.UserRepository;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class UserDAO {

    private final UserRepository userRepository;
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

    public UserDAO(UserRepository userRepository) {
        this.userRepository = userRepository;
        Dotenv dotenv = Dotenv.load();
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", dotenv.get("CLOUDINARY_CLOUD_NAME"),
                "api_key", dotenv.get("CLOUDINARY_API_KEY"),
                "api_secret", dotenv.get("CLOUDINARY_API_SECRET")
        ));
    }

    public Users register(UserDTO userDTO) {
        if (userDTO.getMediaUrl() == null || userDTO.getMediaUrl().isBlank()) {
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
        Users users1 = userRepository.findByEmail(userDTO.getEmail());
        if (users1!=null) {
            throw new UserExistException(users1.getEmail()+"!"+users1.getName());
        } else {
            try {
                Users users = userDtoToUsers(userDTO, LocalDateTime.now());
                return userRepository.save(users);
            } catch (RuntimeException e) {
                throw new RuntimeException(e);
            }
        }
//        if (!checkUserByEmail(userDTO.getEmail())) {
//            Users users = userDtoToUsers(userDTO, LocalDateTime.now());
//
//            try {
//                return userRepository.save(users);
//            } catch (Exception e) {
//                return 500;
//            }
//        }
//        return 400;
    }

    public Users login(String email, String password) {
        try {
            Users users = userRepository.findByEmail(email);
            System.err.println("UserDAO=>" + users);
            if (users.getPassword().equals(password)) {
                return users;
            } else {
//                System.err.println("LoginException2=>" + email);
                throw new LoginException(users.getName());
            }
        } catch (NoSuchElementException e) {
//            System.err.println("LoginException3=>" + email);
            throw new NoSuchElementException("User Doesn't exist ");
        } catch (LoginException e) {
            throw e; // Let it bubble up
        } catch (Exception e) {
//            System.err.println("LoginException4=>" + email);
            throw new RuntimeException(e);
        }
    }

    public List<Users> showUser() {
        try {
            List<Users> users=   userRepository.findAll();
            if (users.isEmpty()){
                throw new NoUserException("No User Exist");
            }

            return users;
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    public Users updateProfile(UserDTO userDTO, UUID userID) {
        try{
            Users users= userRepository.findById(userID).orElseThrow(() -> new NoSuchElementException("User doesn't exist"));
            if (users.getMediaId()!=null && users.getMediaId().equals(userDTO.getMediaId())){
                users.setMediaId(userDTO.getMediaId());
                users.setMediaUrl(userDTO.getMediaUrl());
            }
            users.setName(userDTO.getName());
            return  userRepository.save(users);
        }
        catch (RuntimeException e){
            throw new RuntimeException(e);
        }

    }

    public boolean checkUser(UUID userID) {
        return userRepository.existsById(userID);
    }

    public boolean checkUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Users getByEmail(String email) {
//        try{
        return userRepository.findByEmail(email);
//        }catch (){
//
//        }
    }

    public Users findUserById(UUID userID) {
        return userRepository.findById(userID).orElseThrow(()->new NoSuchElementException("User not found"));
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
    public Map<String, Object>  showUserByID(UUID userID) {
        try {
            Users user = userRepository.findById(userID).orElseThrow(()->new NoSuchElementException("User not found"));

            // Create a response map
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("user", user);
            responseData.put("totalContacts", user.getContacts() != null ? user.getContacts().size() : 0);

            return responseData;

//            return new HttpStatus(200, responseData);

        }catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteUser(UUID userID) {
        try {
            Users users=userRepository.findById(userID).orElseThrow(()->new NoSuchElementException("User not found"));
            userRepository.deleteById(userID);
            deleteFileFromCloudinary(users.getMediaId());

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Users generateOTP(long otp, UUID userID) {
        System.err.println("Enter into userID");
        try {
            Users users = userRepository.findById(userID).orElseThrow(() -> new NoSuchElementException("User Not found"));
            users.setOtp(otp);
            users.setOtpCreate(LocalDateTime.now());
            Users users1 = userRepository.save(users);
            System.err.println("users=>" + users1);
            return users1;
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    public void verifyOTP(UUID userID, long otp) {
        Users users;
        try {
            users = userRepository.findById(userID).orElseThrow(() -> new NoSuchElementException("User not Found"));
        } catch (RuntimeException e) {
            throw new RuntimeException("User not found");
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

    public Users updatePasswordWithOldPassword(UUID userID, UserDTO userDTO) {
        Users users;
        try {
            users = userRepository.getReferenceById(userID);
        } catch (NoSuchElementException e) {
            throw new NoSuchElementException("No user exist");
        }
        if (users.getPassword().equals(userDTO.getCurrentPassword())) {
            users.setPassword(userDTO.getNewPassword());
        } else {
            throw new PasswordNotMatch(users.getEmail() + "!" + users.getName());
        }
        return userRepository.save(users);
    }

    public void updatePasswordWithPassword(UUID userID, UserDTO userDTO) {
        Users users;
        try {
            users = userRepository.getReferenceById(userID);
        } catch (NoSuchElementException e) {
            throw new NoSuchElementException("No user exist");
        }
        users.setPassword(userDTO.getNewPassword());

        userRepository.save(users);
    }

    public boolean isVerifiedProfile(UUID userID){
        try {
            Users users = findUserById(userID);
            return users.isVerify();
        }catch (NoSuchElementException e){
            throw new NoSuchElementException(e.getMessage());
        }

    }


}


