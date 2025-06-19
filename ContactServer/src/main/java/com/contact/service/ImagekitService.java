package com.contact.service;

import com.contact.util.exception.NotImage;
import io.imagekit.sdk.ImageKit;
import io.imagekit.sdk.models.FileCreateRequest;
import io.imagekit.sdk.models.results.Result;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Component
public class ImagekitService {
    private final ImageKit imagekit;

    public ImagekitService(ImageKit imagekit) {
        this.imagekit = imagekit;
    }

    public List<String> uploadFile(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            BufferedImage image = ImageIO.read(inputStream);
            System.err.println(image);
             if(image == null){
                 throw new NotImage("Enter valid image");
             }
        } catch (Exception e) {
            throw new NotImage("Enter valid image");
        }

        try {
            byte[] fileBytes = file.getBytes();
            String base64File = Base64.getEncoder().encodeToString(fileBytes);
            String base64 = "data:" + file.getContentType() + ";base64," + base64File;

            FileCreateRequest fileCreateRequest = new FileCreateRequest(base64, file.getOriginalFilename());
            fileCreateRequest.setFolder("Contact");//ilePath(targetPath + "/" + file.getOriginalFilename());
            Result uploadResult = imagekit.upload(fileCreateRequest);
            System.err.println(uploadResult);
            List<String> list=new ArrayList<>();
            list.add(uploadResult.getUrl());
            list.add(uploadResult.getFileId());


            return list;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }

    }

    public boolean deleteFile(String fileID) {
        try {
            Result result = imagekit.deleteFile(fileID);
            System.err.println(result);
            return true;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
