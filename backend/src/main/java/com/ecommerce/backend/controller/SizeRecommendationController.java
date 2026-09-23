package com.ecommerce.backend.controller;

import com.ecommerce.backend.ai.SizeRecommendationService;
import com.ecommerce.backend.entity.BodyProfile;
import com.ecommerce.backend.entity.ProductSize;
import com.ecommerce.backend.service.BodyProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommend-size")
@CrossOrigin(origins = "*")
public class SizeRecommendationController {

    private final SizeRecommendationService sizeRecommendationService;
    private final BodyProfileService bodyProfileService;

    public SizeRecommendationController(
            SizeRecommendationService sizeRecommendationService,
            BodyProfileService bodyProfileService) {

        this.sizeRecommendationService = sizeRecommendationService;
        this.bodyProfileService = bodyProfileService;
    }

    @GetMapping
    public String recommendSize(
            @RequestParam Long customerId,
            @RequestParam Long productId) {

        BodyProfile bodyProfile =
                bodyProfileService.getByCustomerId(customerId);

        if (bodyProfile == null) {
            return "Body profile not found.";
        }

        ProductSize recommendedSize =
                sizeRecommendationService.recommendSize(
                        bodyProfile,
                        productId
                );

        if (recommendedSize == null) {
            return "No size information found for this product.";
        }

        return "Recommended Size: "
                + recommendedSize.getSize()
                + "\n"
                + "Chest: "
                + recommendedSize.getChest()
                + " cm\n"
                + "Waist: "
                + recommendedSize.getWaist()
                + " cm\n"
                + "Shoulder: "
                + recommendedSize.getShoulder()
                + " cm\n"
                + "Length: "
                + recommendedSize.getLength()
                + " cm";
    }
}