package com.example.backend.service;

import com.example.backend.dto.CardCreateRequest;
import com.example.backend.dto.CardMoveRequest;
import com.example.backend.dto.CardResponse;
import com.example.backend.entity.Card;
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

    @Transactional
    public CardResponse move(UUID id, CardMoveRequest req) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new CardNotFoundException(id));
        card.setStatus(req.status());
        card.setPosition(req.position());
        return CardResponse.from(cardRepository.save(card));
    }

    @Transactional
    public CardResponse create(CardCreateRequest req) {
        int nextPosition = cardRepository.findByStatusOrderByPosition(req.status()).size();

        Card card = new Card();
        card.setTitle(req.title());
        card.setDescription(req.description());
        card.setPriority(req.priority());
        card.setDueDate(req.dueDate());
        card.setStatus(req.status());
        card.setPosition(nextPosition);

        return CardResponse.from(cardRepository.save(card));
    }
}
