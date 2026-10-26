package com.example.backend.dto;

import com.example.backend.entity.Card;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record CardResponse(
        UUID id,
        String title,
        String description,
        String priority,
        LocalDate dueDate,
        String status,
        int position,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
    public static CardResponse from(Card card) {
        return new CardResponse(
                card.getId(),
                card.getTitle(),
                card.getDescription(),
                card.getPriority(),
                card.getDueDate(),
                card.getStatus(),
                card.getPosition(),
                card.getCreatedAt(),
                card.getUpdatedAt()
        );
    }
}
