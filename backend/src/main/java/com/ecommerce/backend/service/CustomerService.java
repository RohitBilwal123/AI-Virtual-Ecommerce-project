package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Customer;
import com.ecommerce.backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer createOrGetCustomer(Customer customer) {

        // Check existing customer by email
        return customerRepository.findByEmail(customer.getEmail())
                .orElseGet(() ->
                    customerRepository.findByPhone(customer.getPhone())
                        .orElseGet(() ->
                            customerRepository.save(customer)
                        )
                );
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }
}