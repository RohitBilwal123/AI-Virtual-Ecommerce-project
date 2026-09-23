package com.ecommerce.backend.ai;

import com.ecommerce.backend.entity.BodyProfile;
import com.ecommerce.backend.entity.ProductSize;
import com.ecommerce.backend.repository.ProductSizeRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class SizeRecommendationService {

    private final ProductSizeRepository productSizeRepository;

    public SizeRecommendationService(
            ProductSizeRepository productSizeRepository) {

        this.productSizeRepository = productSizeRepository;
    }

    public ProductSize recommendSize(
            BodyProfile bodyProfile,
            Long productId) {

        List<ProductSize> sizes =
                productSizeRepository.findByProductId(productId);

        if (sizes == null || sizes.isEmpty()) {
            return null;
        }

        return sizes.stream()
                .min(Comparator.comparingDouble(size ->
                        calculateScore(bodyProfile, size)))
                .orElse(null);
    }

    private double calculateScore(
            BodyProfile bodyProfile,
            ProductSize size) {

        double chestDifference =
                Math.abs(size.getChest() - bodyProfile.getChest());

        double waistDifference =
                Math.abs(size.getWaist() - bodyProfile.getWaist());

        double shoulderDifference =
                Math.abs(size.getShoulder() - bodyProfile.getShoulder());

        return chestDifference
                + waistDifference
                + shoulderDifference;
    }
}