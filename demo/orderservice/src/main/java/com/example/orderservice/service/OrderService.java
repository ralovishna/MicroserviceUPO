package com.example.orderservice.service;

import com.example.orderservice.model.Order;
import com.example.orderservice.repository.OrderRepository;
import lombok.Getter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository repository;
    private final RestTemplate restTemplate;

    public OrderService(OrderRepository repository, RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    public List<Order> getAllOrders() {
        return repository.findAll();
    }

    public Order createOrder(Long userId, Long productId, Integer quantity) {
        // Call User Service
        String userUrl = "http://localhost:8081/users/" + userId;
        Object user = restTemplate.getForObject(userUrl, Object.class);
        if (user == null) throw new RuntimeException("User not found");

        // Call Product Service
        String productUrl = "http://localhost:8082/products/" + productId;
        Product product = restTemplate.getForObject(productUrl, Product.class);
        if (product == null) throw new RuntimeException("Product not found");

        double totalPrice = product.getPrice() * quantity;
        Order order = new Order(userId, productId, quantity, totalPrice);
        return repository.save(order);
    }

    // Inner class to map Product JSON
    public static class Product {
        private Long id;
        private String name;
        private String description;
        @Getter
        private Double price;
    }
}
