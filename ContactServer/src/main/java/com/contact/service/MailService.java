package com.contact.service;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
//import java.time.LocalDateTime;

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

    public void sendMail(String to, String name, String data, String mailFor) throws IOException {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(emailID);
        message.setTo(to);
        switch (mailFor){
            case "otp":{
                message.setSubject("OTP");
            }
            default:{

                message.setSubject("Just Test");
            }
        }
        String text = loadEmailTemplate(data, name, mailFor);
        message.setText(text);

        try {
    javaMailSender.send(message);
            System.out.println("Mail send successfully"+mailFor+to+name+data);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    private String loadEmailTemplate(String otp, String name, String mailFor) throws IOException {
        switch (mailFor) {
            case "otp": {
                ClassPathResource resource = new ClassPathResource("templates/otpMail.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content.replace("{{otp}}", otp)
                        .replace("{{name}}", name)
//                .replace("{{supportLink}}", supportLink)
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
            default: {
                ClassPathResource resource = new ClassPathResource("templates/normalMail.html");
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

                return content
                        .replace("{{name}}", name)
                        ;

            }
        }

    }

}
