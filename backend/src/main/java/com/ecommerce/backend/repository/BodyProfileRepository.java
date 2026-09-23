package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.BodyProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BodyProfileRepository extends JpaRepository<BodyProfile, Long> {

    Optional<BodyProfile> findByCustomerId(Long customerId);
}