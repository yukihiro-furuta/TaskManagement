package com.example.backend.repository;

import com.example.backend.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CardRepository extends JpaRepository<Card, UUID> {

    List<Card> findByStatusOrderByPosition(String status);

    @Query("SELECT COALESCE(MAX(c.position), -1) + 1 FROM Card c WHERE c.status = :status")
    int nextPositionByStatus(@Param("status") String status);
}
