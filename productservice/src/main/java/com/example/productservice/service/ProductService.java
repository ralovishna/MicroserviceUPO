package com.example.productservice.service;

import com.example.productservice.exception.ProductAlreadyExistsException;
import com.example.productservice.exception.ProductNotFoundException;
import com.example.productservice.model.Product;
import com.example.productservice.repository.ProductRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public Page<Product> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findAll(pageable);
    }

    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    public Product getProductById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    public Product createProduct(Product product) {
        if (repository.existsByName(product.getName())) {
            throw new ProductAlreadyExistsException(product.getName());
        }
        return repository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        return repository.findById(id).map(existingProduct -> {
            // Check for duplicate name
            if (!existingProduct.getName().equals(updatedProduct.getName()) &&
                    repository.existsByName(updatedProduct.getName())) {
                throw new ProductAlreadyExistsException(updatedProduct.getName());
            }

            // Update core fields
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setDescription(updatedProduct.getDescription());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setStockQuantity(updatedProduct.getStockQuantity());
            existingProduct.setCategory(updatedProduct.getCategory());

            // ✅ Only update image if a new URL is provided
            if (updatedProduct.getImageUrl() != null && !updatedProduct.getImageUrl().isBlank()) {
                existingProduct.setImageUrl(updatedProduct.getImageUrl());
            }

            return repository.save(existingProduct);
        }).orElseThrow(() -> new ProductNotFoundException(id));
    }

    public void deleteProduct(Long id) {
        try {
            if (!repository.existsById(id)) {
                throw new ProductNotFoundException(id);
            }
            repository.deleteById(id);
        } catch (DataIntegrityViolationException ex) {
            throw new RuntimeException("Cannot delete product: product has existing orders");
        }
    }
}
