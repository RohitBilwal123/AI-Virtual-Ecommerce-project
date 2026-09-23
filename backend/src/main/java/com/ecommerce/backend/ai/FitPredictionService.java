package com.ecommerce.backend.ai;

import com.ecommerce.backend.entity.BodyProfile;
import com.ecommerce.backend.entity.Product;
import org.springframework.stereotype.Service;

@Service
public class FitPredictionService {

    public String predictFit(BodyProfile bodyProfile, Product product) {

        double chestDifference =
                product.getChest() - bodyProfile.getChest();

        double waistDifference =
                product.getWaist() - bodyProfile.getWaist();

        double shoulderDifference =
                product.getShoulder() - bodyProfile.getShoulder();

        String chestFit = getFitResult(chestDifference);
        String waistFit = getFitResult(waistDifference);
        String shoulderFit = getFitResult(shoulderDifference);

        String overallFit;

        if (chestFit.equals("Tight")
                || waistFit.equals("Tight")
                || shoulderFit.equals("Tight")) {

            overallFit = "Tight";

        } else if (chestFit.equals("Loose")
                || waistFit.equals("Loose")
                || shoulderFit.equals("Loose")) {

            overallFit = "Loose";

        } else {

            overallFit = "Good Fit";
        }

        return "Recommended Size: " + product.getSize()
                + "\n\n"
                + "Chest: " + chestFit
                + "\n"
                + "Waist: " + waistFit
                + "\n"
                + "Shoulder: " + shoulderFit
                + "\n\n"
                + "Overall Fit: " + overallFit;
    }

    private String getFitResult(double difference) {

        if (difference < -4) {
            return "Tight";
        }

        if (difference > 12) {
            return "Loose";
        }

        return "Good Fit";
    }
}