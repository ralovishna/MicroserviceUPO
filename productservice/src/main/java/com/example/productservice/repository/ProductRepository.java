package com.example.productservice.repository;

import com.example.productservice.model.Product;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByName(@NotBlank(message = "Product name is required") @Size(max = 100) String name);

    boolean existsByName(@NotBlank(message = "Product name is required") @Size(max = 100) String name);
}
