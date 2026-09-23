package com.ecommerce.backend.ai;

import com.ecommerce.backend.entity.BodyProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VirtualTryOnService {

    @Autowired
    private VirtualTryOnAIService virtualTryOnAIService;

    public String processTryOn(
            String userPhoto,
            String productImage,
            BodyProfile bodyProfile) {

        System.out.println("AI Virtual Try-On Request");
        System.out.println("User Photo: " + userPhoto);
        System.out.println("Product Image: " + productImage);

        if (bodyProfile != null) {
            System.out.println("Height: " + bodyProfile.getHeight());
            System.out.println("Weight: " + bodyProfile.getWeight());
            System.out.println("Chest: " + bodyProfile.getChest());
            System.out.println("Waist: " + bodyProfile.getWaist());
            System.out.println("Hip: " + bodyProfile.getHip());
            System.out.println("Shoulder: " + bodyProfile.getShoulder());
        }

        String aiResult =
                virtualTryOnAIService.generateTryOn(
                        userPhoto,
                        productImage
                );

        System.out.println("AI Result: " + aiResult);

        return "AI Try-On request received with body profile"
                + "\n"
                + aiResult;
    }
}