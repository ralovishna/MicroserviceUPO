package com.example.productservice.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.productservice.model.Product;
import com.example.productservice.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService service;
    private final Cloudinary cloudinary;

    public ProductController(ProductService service) {
        this.service = service;
        // Initialize Cloudinary using environment variables or config properties
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", System.getenv("CLOUDINARY_CLOUD_NAME"),
                "api_key", System.getenv("CLOUDINARY_API_KEY"),
                "api_secret", System.getenv("CLOUDINARY_API_SECRET")
        ));
    }

    @GetMapping
    public Object getAllProducts(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (page != null && size != null) {
            return service.getAllProducts(page, size);
        } else {
            return service.getAllProducts();
        }
    }


    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getProductById(id));
    }

    // Create new product with optional image upload or image URL
    @PostMapping
    public ResponseEntity<Product> createProduct(
            @Valid @ModelAttribute Product product,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "imageUrl", required = false) String imageUrl
    ) throws IOException {

        if (imageFile != null && !imageFile.isEmpty()) {
            // Upload image to Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(imageFile.getBytes(), ObjectUtils.emptyMap());
            product.setImageUrl(uploadResult.get("secure_url").toString());
        } else if (imageUrl != null && !imageUrl.isBlank()) {
            product.setImageUrl(imageUrl);
        } else {
            product.setImageUrl(null);
        }

        return ResponseEntity.ok(service.createProduct(product));
    }

    // Update product with optional new image or URL
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @Valid @ModelAttribute Product product,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "imageUrl", required = false) String imageUrl
    ) throws IOException {

        if (imageFile != null && !imageFile.isEmpty()) {
            // Upload new image to Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(imageFile.getBytes(), ObjectUtils.emptyMap());
            product.setImageUrl(uploadResult.get("secure_url").toString());
        } else if (imageUrl != null && !imageUrl.isBlank()) {
            product.setImageUrl(imageUrl);
        } else {
            // Keep existing image URL (handled in service)
            product.setImageUrl(service.getProductById(id).getImageUrl());
        }

        return ResponseEntity.ok(service.updateProduct(id, product));
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        service.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}
