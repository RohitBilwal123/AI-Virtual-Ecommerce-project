package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.BodyProfile;
import com.ecommerce.backend.service.BodyProfileService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/body-profiles")
@CrossOrigin(origins = "*")
public class BodyProfileController {

    private final BodyProfileService bodyProfileService;

    public BodyProfileController(BodyProfileService bodyProfileService) {
        this.bodyProfileService = bodyProfileService;
    }

    @PostMapping
    public BodyProfile createBodyProfile(
            @RequestBody BodyProfile bodyProfile) {

        return bodyProfileService.createBodyProfile(bodyProfile);
    }

    @GetMapping
    public List<BodyProfile> getAllBodyProfiles() {
        return bodyProfileService.getAllBodyProfiles();
    }

    @GetMapping("/{id}")
    public BodyProfile getBodyProfileById(
            @PathVariable Long id) {

        return bodyProfileService.getBodyProfileById(id);
    }

    @GetMapping("/customer/{customerId}")
    public BodyProfile getByCustomerId(
            @PathVariable Long customerId) {

        return bodyProfileService.getByCustomerId(customerId);
    }
}