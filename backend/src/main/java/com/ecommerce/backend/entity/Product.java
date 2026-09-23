package com.ecommerce.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double price;
    private String category;
    private String size;
    private double chest;
    private double waist;
    private double shoulder;
    private double length;

    // Existing single image
    private String imageUrl;

    // Multiple product images
    @ElementCollection
    @CollectionTable(
        name = "product_images",
        joinColumns = @JoinColumn(name = "product_id")
    )
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    public Product() {
    }

    public Product(String name, String description, double price,
               String category, String size,
               double chest, double waist,
               double shoulder, double length,
               String imageUrl) {

      this.name = name;
      this.description = description;
      this.price = price;
      this.category = category;
      this.size = size;
      this.chest = chest;
      this.waist = waist;
      this.shoulder = shoulder;
      this.length = length;
      this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public double getChest() {
       return chest;
    }

    public void setChest(double chest) {
     this.chest = chest;
    }

    public double getWaist() {
     return waist;
    }

    public void setWaist(double waist) {
     this.waist = waist;
    }

    public double getShoulder() {
     return shoulder;
    }

    public void setShoulder(double shoulder) {
      this.shoulder = shoulder;
    }

    public double getLength() {
      return length;
    }

    public void setLength(double length) {
      this.length = length;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
}