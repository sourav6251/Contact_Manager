package com.contact.service;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Service
public class MailService {
    private final JavaMailSender javaMailSender;
    private final String emailID;

    public MailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
        Dotenv dotenv = Dotenv.load();
        emailID = dotenv.get("EMAIL_ID");
    }

    public void sendMail(String to, String name, String data, String mailFor) throws MessagingException, IOException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(emailID);
        helper.setTo(to);
        String subject = getSubject(mailFor);
        String text = loadEmailTemplate(data, name, mailFor);
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

    private String loadEmailTemplate(String otp, String name, String mailFor) throws IOException {
        switch (mailFor) {
            case "otp": {
                ClassPathResource resource = new ClassPathResource("templates/otpMail.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content.replace("{{otp}}", otp)
                        .replace("{{name}}", name)
                        .replace("{{time}}", LocalDateTime.now().toString())
                        ;
            }
            case "loginSuccess": {

                ClassPathResource resource = new ClassPathResource("templates/loginSuccessMail.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content.replace("{{date}}", LocalDateTime.now().toString())
                        .replace("{{name}}", name)
//                .replace("{{supportLink}}", supportLink)
                        ;
            }
            case "loginFail": {

                ClassPathResource resource = new ClassPathResource("templates/loginFailMail.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content.replace("{{date}}", LocalDateTime.now().toString())
                        .replace("{{name}}", name)
                        ;
            }
            case "register": {
                ClassPathResource resource = new ClassPathResource("templates/register.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        ;
            }
            case "passwordChange": {
                ClassPathResource resource = new ClassPathResource("templates/successPasswordChange.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        ;
            }
            case "failPasswordChange": {
                ClassPathResource resource = new ClassPathResource("templates/failPasswordChange.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        ;
            }
            case "passwordChangeAttempt": {
                ClassPathResource resource = new ClassPathResource("templates/passwordChangeAttempt.html.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        .replace("{{otp}}", otp)
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
            case "passwordChange" -> "Password change successfully";
            case "failPasswordChange" -> "Failed attempted to change password";
            case "passwordChangeAttempt" -> "Someone try to change password";
            default -> "Notification";
        };
    }

}
