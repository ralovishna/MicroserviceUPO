package com.example.orderservice.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PositiveIdValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface PositiveId {
    String message() default "ID must be a positive number";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
