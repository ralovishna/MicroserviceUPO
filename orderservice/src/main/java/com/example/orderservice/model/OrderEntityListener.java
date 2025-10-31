package com.example.orderservice.model;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

public class OrderEntityListener {

    @PrePersist
    @PreUpdate
    public void calculateTotalPrice(Order order) {
        if (order.getQuantity() != null && order.getProductPrice() != null) {
            order.setTotalPrice(order.getQuantity() * order.getProductPrice());
        }
    }
}
