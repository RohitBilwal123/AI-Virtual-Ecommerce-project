package com.ecommerce.backend.controller;

import com.ecommerce.backend.ai.FitPredictionService;
import com.ecommerce.backend.entity.BodyProfile;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.service.BodyProfileService;
import com.ecommerce.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fit")
@CrossOrigin(origins = "*")
public class FitPredictionController {

    private final FitPredictionService fitPredictionService;
    private final BodyProfileService bodyProfileService;
    private final ProductService productService;

    public FitPredictionController(
            FitPredictionService fitPredictionService,
            BodyProfileService bodyProfileService,
            ProductService productService) {

        this.fitPredictionService = fitPredictionService;
        this.bodyProfileService = bodyProfileService;
        this.productService = productService;
    }

    @GetMapping
    public String predictFit(
            @RequestParam Long customerId,
            @RequestParam Long productId) {

        BodyProfile bodyProfile =
                bodyProfileService.getByCustomerId(customerId);

        if (bodyProfile == null) {
            return "Body profile not found.";
        }

        Product product =
                productService.getProductById(productId);

        if (product == null) {
            return "Product not found.";
        }

        return fitPredictionService.predictFit(
                bodyProfile,
                product
        );
    }
}