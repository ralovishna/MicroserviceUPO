package com.example.orderservice.service;

import com.example.orderservice.exception.*;
import com.example.orderservice.model.Order;
import com.example.orderservice.repository.OrderRepository;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class OrderService {

    private final OrderRepository repository;
    private final RestTemplate restTemplate;

    public OrderService(OrderRepository repository, RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    public Page<Order> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findAll(pageable);
    }

    public Order getOrderById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }

    public Order createOrder(Order order) {
        // Validate user exists
        validateUser(order.getUserId());

        // Validate product exists and set productPrice
        Product product = validateProduct(order.getProductId());
        order.setProductPrice(product.getPrice());

        // totalPrice is calculated automatically by OrderEntityListener

        return repository.save(order);
    }

    // Update existing order
    public Order updateOrder(Long id, Order updatedOrder) {
        return repository.findById(id).map(order -> {
            // Validate user and product
            validateUser(updatedOrder.getUserId());
            Product product = validateProduct(updatedOrder.getProductId());

            // Update fields
            order.setUserId(updatedOrder.getUserId());
            order.setProductId(updatedOrder.getProductId());
            order.setQuantity(updatedOrder.getQuantity());
            order.setProductPrice(product.getPrice()); // ensure productPrice is set
            order.setStatus(updatedOrder.getStatus());
            order.setShippingAddress(updatedOrder.getShippingAddress());

            return repository.save(order); // totalPrice recalculated automatically
        }).orElseThrow(() -> new OrderNotFoundException(id));
    }

    public void deleteOrder(Long id) {
        if (!repository.existsById(id)) {
            throw new OrderNotFoundException(id);
        }
        repository.deleteById(id);
    }

    private void validateUser(Long userId) {
        try {
            String userUrl = "http://USER-SERVICE/users/" + userId;
            Object user = restTemplate.getForObject(userUrl, Object.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new UserNotFoundException(userId); // 404
        } catch (RestClientException e) {
            throw new UserServiceUnavailableException("User service unavailable");
        }
    }

    private Product validateProduct(Long productId) {
        try {
            String productUrl = "http://PRODUCT-SERVICE/products/" + productId;
            return restTemplate.getForObject(productUrl, Product.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new ProductNotFoundException(productId); // 404
        } catch (RestClientException e) {
            throw new ProductServiceUnavailableException("Product service unavailable"); // 503
        }
    }

    // Inner class for Product mapping
    public static class Product {
        private Long id;
        private String name;
        private String description;
        @Getter
        private Double price;
    }
}
