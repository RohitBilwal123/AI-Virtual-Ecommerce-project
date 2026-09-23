package com.ecommerce.backend.controller;

import com.ecommerce.backend.ai.SizeRecommendationService;
import com.ecommerce.backend.ai.VirtualTryOnService;
import com.ecommerce.backend.entity.BodyProfile;
import com.ecommerce.backend.entity.ProductSize;
import com.ecommerce.backend.service.BodyProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/try-on")
@CrossOrigin(origins = "*")
public class VirtualTryOnController {

    private final VirtualTryOnService virtualTryOnService;
    private final BodyProfileService bodyProfileService;
    private final SizeRecommendationService sizeRecommendationService;

    public VirtualTryOnController(
            VirtualTryOnService virtualTryOnService,
            BodyProfileService bodyProfileService,
            SizeRecommendationService sizeRecommendationService) {

        this.virtualTryOnService = virtualTryOnService;
        this.bodyProfileService = bodyProfileService;
        this.sizeRecommendationService = sizeRecommendationService;
    }

    @PostMapping
    public String startTryOn(
            @RequestParam String userPhoto,
            @RequestParam String productImage,
            @RequestParam Long customerId,
            @RequestParam Long productId) {

        BodyProfile bodyProfile =
                bodyProfileService.getByCustomerId(customerId);

        if (bodyProfile == null) {
            return "Body profile not found. Please create your body profile first.";
        }

        ProductSize recommendedSize =
                sizeRecommendationService.recommendSize(
                        bodyProfile,
                        productId
                );

        String tryOnResult =
                virtualTryOnService.processTryOn(
                        userPhoto,
                        productImage,
                        bodyProfile
                );

        if (recommendedSize == null) {
            return tryOnResult
                    + "\n\nNo size recommendation available.";
        }

        return tryOnResult
                + "\n\nRecommended Size: "
                + recommendedSize.getSize()
                + "\nChest: "
                + recommendedSize.getChest()
                + " cm"
                + "\nWaist: "
                + recommendedSize.getWaist()
                + " cm"
                + "\nShoulder: "
                + recommendedSize.getShoulder()
                + " cm"
                + "\nLength: "
                + recommendedSize.getLength()
                + " cm";
    }
}