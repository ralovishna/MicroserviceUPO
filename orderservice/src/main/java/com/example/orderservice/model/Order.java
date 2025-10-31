package com.example.orderservice.model;

import com.example.orderservice.validation.PositiveId;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
@EntityListeners(OrderEntityListener.class)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @PositiveId
    private Long userId;

    @NotNull
    @PositiveId
    private Long productId;

    @NotNull
    @DecimalMin(value = "1", message = "Quantity must be at least 1")
    private Integer quantity;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Double productPrice; // calculated internally

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Double totalPrice = 0.0; // calculated internally

    @NotNull
    private LocalDateTime orderDate = LocalDateTime.now();

    @NotNull
    @Size(min = 1, max = 255)
    private String status = "PENDING";

    @Size(max = 200)
    private String shippingAddress;
}
