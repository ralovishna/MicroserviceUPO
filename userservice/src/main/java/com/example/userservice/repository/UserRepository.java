package com.example.userservice.repository;

import com.example.userservice.model.User;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(@Email(message = "Invalid email format") String email);

    boolean existsByEmail(@Email(message = "Invalid email format") String email);
}

