package com.contact.service;

import com.contact.dto.ClientHeadersDTO;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class MailService {
    private final JavaMailSender javaMailSender;
    private final String emailID;

    public MailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
        Dotenv dotenv = Dotenv.load();
        emailID = dotenv.get("EMAIL_ID");
    }

    public void sendMail(String to, String name, String data, String mailFor, ClientHeadersDTO clientHeadersDTO) throws MessagingException, IOException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(emailID);
        helper.setTo(to);
        String subject = getSubject(mailFor);
        String text = loadEmailTemplate(data, name, mailFor,clientHeadersDTO);
        helper.setSubject(subject);
        helper.setText(text,true);

        System.out.println("Mail prepare to send " + mailFor + to + name + data);
        try {
            javaMailSender.send(mimeMessage);
            System.out.println("Mail send successfully" + mailFor + to + name + data);
        } catch (RuntimeException e) {
            System.err.println("Runtime error");
//            throw new RuntimeException(e);
        }
    }

    private String loadEmailTemplate(String data, String name, String mailFor, ClientHeadersDTO clientHeadersDTO) throws IOException {
        Instant instant = Instant.parse(clientHeadersDTO.clientTime());
        ZonedDateTime zdt = instant.atZone(ZoneId.of("UTC"));
        String clientDateTime = zdt.format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"))+" "+zdt.format(DateTimeFormatter.ofPattern("hh:mm a z"));
//        String clientTime = zdt.format(DateTimeFormatter.ofPattern("hh:mm a z"));
        switch (mailFor) {
            case "otp": {
                ClassPathResource resource = new ClassPathResource("templates/otpMail.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        .replace("{{clientDevice}}", clientHeadersDTO.clientDevice())
                        .replace("{{clientLocation}}", clientHeadersDTO.clientLocation())
                        .replace("{{clientIp}}", clientHeadersDTO.clientIp())
                        .replace("{{clientTime}}", clientDateTime)
                        .replace("{{clientOS}}", clientHeadersDTO.clientOS())
                        .replace("{{clientBrowser}}", clientHeadersDTO.clientBrowser())
                        .replace("{{clientUserAgent}}", clientHeadersDTO.clientUserAgent())
                        .replace("{{clientPlatform}}", clientHeadersDTO.clientPlatform())
                        .replace("{{otp}}", data)
                        .replace("{{time}}", LocalDateTime.now().toString())
                        ;
            }
            case "loginSuccess": {

                ClassPathResource resource = new ClassPathResource("templates/loginSuccessMail.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        .replace("{{clientDevice}}", clientHeadersDTO.clientDevice())
                        .replace("{{clientLocation}}", clientHeadersDTO.clientLocation())
                        .replace("{{clientIp}}", clientHeadersDTO.clientIp())
                        .replace("{{clientTime}}", clientDateTime)
                        .replace("{{clientOS}}", clientHeadersDTO.clientOS())
                        .replace("{{clientBrowser}}", clientHeadersDTO.clientBrowser())
                        .replace("{{clientUserAgent}}", clientHeadersDTO.clientUserAgent())
                        .replace("{{clientPlatform}}", clientHeadersDTO.clientPlatform())
                        .replace("{{email}}", "dassourav3738@gmail.com")
                        ;
            }
            case "loginFail": {

                ClassPathResource resource = new ClassPathResource("templates/loginFailMail.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        .replace("{{clientDevice}}", clientHeadersDTO.clientDevice())
                        .replace("{{clientLocation}}", clientHeadersDTO.clientLocation())
                        .replace("{{clientIp}}", clientHeadersDTO.clientIp())
                        .replace("{{clientTime}}", clientDateTime)
                        .replace("{{clientOS}}", clientHeadersDTO.clientOS())
                        .replace("{{clientBrowser}}", clientHeadersDTO.clientBrowser())
                        .replace("{{clientUserAgent}}", clientHeadersDTO.clientUserAgent())
                        .replace("{{clientPlatform}}", clientHeadersDTO.clientPlatform())
                        ;
            }
            case "register": {
                ClassPathResource resource = new ClassPathResource("templates/register.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        .replace("{{clientDevice}}", clientHeadersDTO.clientDevice())
                        .replace("{{clientLocation}}", clientHeadersDTO.clientLocation())
                        .replace("{{clientIp}}", clientHeadersDTO.clientIp())
                        .replace("{{clientTime}}", clientDateTime)
                        .replace("{{clientOS}}", clientHeadersDTO.clientOS())
                        .replace("{{clientBrowser}}", clientHeadersDTO.clientBrowser())
                        .replace("{{clientUserAgent}}", clientHeadersDTO.clientUserAgent())
                        .replace("{{clientPlatform}}", clientHeadersDTO.clientPlatform())

//                        .replace("{{otpCode}}", data)
                        ;
            }
            case "passwordChange": {
                ClassPathResource resource = new ClassPathResource("templates/successPasswordChange.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        .replace("{{clientDevice}}", clientHeadersDTO.clientDevice())
                        .replace("{{clientLocation}}", clientHeadersDTO.clientLocation())
                        .replace("{{clientIp}}", clientHeadersDTO.clientIp())
                        .replace("{{clientTime}}", clientDateTime)
                        .replace("{{clientOS}}", clientHeadersDTO.clientOS())
                        .replace("{{clientBrowser}}", clientHeadersDTO.clientBrowser())
                        .replace("{{clientUserAgent}}", clientHeadersDTO.clientUserAgent())
                        .replace("{{clientPlatform}}", clientHeadersDTO.clientPlatform())
                        ;
            }
            case "failPasswordChange": {
                ClassPathResource resource = new ClassPathResource("templates/failPasswordChange.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        .replace("{{clientDevice}}", clientHeadersDTO.clientDevice())
                        .replace("{{clientLocation}}", clientHeadersDTO.clientLocation())
                        .replace("{{clientIp}}", clientHeadersDTO.clientIp())
                        .replace("{{clientTime}}", clientDateTime)
                        .replace("{{clientOS}}", clientHeadersDTO.clientOS())
                        .replace("{{clientBrowser}}", clientHeadersDTO.clientBrowser())
                        .replace("{{clientUserAgent}}", clientHeadersDTO.clientUserAgent())
                        .replace("{{clientPlatform}}", clientHeadersDTO.clientPlatform())

                        ;
            }
            case "changePassword": {
                ClassPathResource resource = new ClassPathResource("templates/passwordChangeAttempt.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        .replace("{{clientDevice}}", clientHeadersDTO.clientDevice())
                        .replace("{{clientLocation}}", clientHeadersDTO.clientLocation())
                        .replace("{{clientIp}}", clientHeadersDTO.clientIp())
                        .replace("{{clientTime}}", clientDateTime)
                        .replace("{{clientOS}}", clientHeadersDTO.clientOS())
                        .replace("{{clientBrowser}}", clientHeadersDTO.clientBrowser())
                        .replace("{{clientUserAgent}}", clientHeadersDTO.clientUserAgent())
                        .replace("{{clientPlatform}}", clientHeadersDTO.clientPlatform())

                        .replace("{{otp}}", data)
                        ;
            }
            case "updateProfile": {
//                String[] parts=data.split("%");
//               String name1=parts[0];
                String media;
                if (data!=null){
                    media="updated";
                }else {
                    media="not update";
                }
                ClassPathResource resource = new ClassPathResource("templates/updateProfile.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        .replace("{{clientDevice}}", clientHeadersDTO.clientDevice())
                        .replace("{{clientLocation}}", clientHeadersDTO.clientLocation())
                        .replace("{{clientIp}}", clientHeadersDTO.clientIp())
                        .replace("{{clientTime}}", clientDateTime)
                        .replace("{{clientOS}}", clientHeadersDTO.clientOS())
                        .replace("{{clientBrowser}}", clientHeadersDTO.clientBrowser())
                        .replace("{{clientUserAgent}}", clientHeadersDTO.clientUserAgent())
                        .replace("{{clientPlatform}}", clientHeadersDTO.clientPlatform())

                        .replace("{{photo}}", media)
//                        .replace("{{data}}", data)
                        ;
            }
            case "deleteAccount": {
                System.err.println("Enter into deleteAccount Mail");
                ClassPathResource resource = new ClassPathResource("templates/deleteAccount.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        .replace("{{clientDevice}}", clientHeadersDTO.clientDevice())
                        .replace("{{clientLocation}}", clientHeadersDTO.clientLocation())
                        .replace("{{clientIp}}", clientHeadersDTO.clientIp())
                        .replace("{{clientTime}}", clientDateTime)
                        .replace("{{clientOS}}", clientHeadersDTO.clientOS())
                        .replace("{{clientBrowser}}", clientHeadersDTO.clientBrowser())
                        .replace("{{clientUserAgent}}", clientHeadersDTO.clientUserAgent())
                        .replace("{{clientPlatform}}", clientHeadersDTO.clientPlatform())

                        .replace("{{otpCode}}", data)
                        ;
            }
            case "existRegister": {  // todo: not working
                System.err.println("Enter into deleteAccount Mail");
                ClassPathResource resource = new ClassPathResource("templates/existEmailRegister.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        .replace("{{clientDevice}}", clientHeadersDTO.clientDevice())
                        .replace("{{clientLocation}}", clientHeadersDTO.clientLocation())
                        .replace("{{clientIp}}", clientHeadersDTO.clientIp())
                        .replace("{{clientTime}}", clientDateTime)
                        .replace("{{clientOS}}", clientHeadersDTO.clientOS())
                        .replace("{{clientBrowser}}", clientHeadersDTO.clientBrowser())
                        .replace("{{clientUserAgent}}", clientHeadersDTO.clientUserAgent())
                        .replace("{{clientPlatform}}", clientHeadersDTO.clientPlatform())

                        .replace("{{aname}}", data)
                        ;
            }
            case "verifyProfile": {
                System.err.println("Enter into deleteAccount Mail");
                ClassPathResource resource = new ClassPathResource("templates/verifyProfile.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        .replace("{{clientDevice}}", clientHeadersDTO.clientDevice())
                        .replace("{{clientLocation}}", clientHeadersDTO.clientLocation())
                        .replace("{{clientIp}}", clientHeadersDTO.clientIp())
                        .replace("{{clientTime}}", clientDateTime)
                        .replace("{{clientOS}}", clientHeadersDTO.clientOS())
                        .replace("{{clientBrowser}}", clientHeadersDTO.clientBrowser())
                        .replace("{{clientUserAgent}}", clientHeadersDTO.clientUserAgent())
                        .replace("{{clientPlatform}}", clientHeadersDTO.clientPlatform())

                        .replace("{{otpCode}}", data)
                        ;
            }
            default: {
                ClassPathResource resource = new ClassPathResource("templates/normalMail.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        ;

            }
        }

    }

    private String getSubject(String mailFor) {
        return switch (mailFor) {
            case "otp" -> "Your OTP Code";
            case "loginSuccess" -> "Login Successful";
            case "loginFail" -> "Suspicious Login Attempt";
            case "register" -> "Welcome to Our Platform";
            case "deleteAccount" -> "Account delete alert ";
            case "passwordChange" -> "Password change successfully";
            case "updateProfile" -> "Profile update successfully";
            case "failPasswordChange" -> "Failed attempted to change password";
            case "passwordChangeAttempt" -> "Someone try to change password";
            case "existRegister" -> "Someone try to Register";
            case "verifyProfile" -> "Verify profile";
            default -> "Notification";
        };
    }

}
