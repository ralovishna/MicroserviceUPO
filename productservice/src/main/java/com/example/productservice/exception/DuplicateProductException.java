package com.example.productservice.exception;

public class DuplicateProductException extends RuntimeException {
    public DuplicateProductException(String name) {
        super("Product already exists with name: " + name);
    }
}
