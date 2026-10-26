package com.example.backend.service;

import com.example.backend.dto.CardResponse;
import com.example.backend.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CardService {

    private final CardRepository cardRepository;

    public List<CardResponse> findAll(String status) {
        if (status != null) {
            return cardRepository.findByStatusOrderByPosition(status)
                    .stream().map(CardResponse::from).toList();
        }
        return cardRepository.findAll()
                .stream().map(CardResponse::from).toList();
    }

    public CardResponse findById(UUID id) {
        return cardRepository.findById(id)
                .map(CardResponse::from)
                .orElseThrow(() -> new CardNotFoundException(id));
    }
}
