package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.BodyProfile;
import com.ecommerce.backend.repository.BodyProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BodyProfileService {

    private final BodyProfileRepository bodyProfileRepository;

    public BodyProfileService(BodyProfileRepository bodyProfileRepository) {
        this.bodyProfileRepository = bodyProfileRepository;
    }

    public BodyProfile createBodyProfile(BodyProfile bodyProfile) {
        return bodyProfileRepository.save(bodyProfile);
    }

    public List<BodyProfile> getAllBodyProfiles() {
        return bodyProfileRepository.findAll();
    }

    public BodyProfile getBodyProfileById(Long id) {
        return bodyProfileRepository.findById(id).orElse(null);
    }

    public BodyProfile getByCustomerId(Long customerId) {
        return bodyProfileRepository
                .findByCustomerId(customerId)
                .orElse(null);
    }

    public BodyProfile updateBodyProfile(
            Long customerId,
            BodyProfile updatedProfile) {

        BodyProfile existing =
                bodyProfileRepository
                        .findByCustomerId(customerId)
                        .orElse(null);

        if (existing == null) {
            updatedProfile.setCustomer(
                    updatedProfile.getCustomer()
            );

            return bodyProfileRepository.save(updatedProfile);
        }

        existing.setHeight(updatedProfile.getHeight());
        existing.setWeight(updatedProfile.getWeight());
        existing.setChest(updatedProfile.getChest());
        existing.setWaist(updatedProfile.getWaist());
        existing.setHip(updatedProfile.getHip());
        existing.setShoulder(updatedProfile.getShoulder());
        existing.setPhotoUrl(updatedProfile.getPhotoUrl());

        return bodyProfileRepository.save(existing);
    }
}