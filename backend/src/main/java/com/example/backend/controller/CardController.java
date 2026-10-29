package com.example.backend.controller;

import com.example.backend.dto.CardCreateRequest;
import com.example.backend.dto.CardMoveRequest;
import com.example.backend.dto.CardReorderItem;
import com.example.backend.dto.CardResponse;
import com.example.backend.dto.CardUpdateRequest;
import com.example.backend.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @GetMapping
    public List<CardResponse> list(@RequestParam(required = false) String status) {
        return cardService.findAll(status);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(cardService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CardResponse> update(@PathVariable UUID id,
                                               @Valid @RequestBody CardUpdateRequest req) {
        return ResponseEntity.ok(cardService.update(id, req));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CardResponse> move(@PathVariable UUID id,
                                             @Valid @RequestBody CardMoveRequest req) {
        return ResponseEntity.ok(cardService.move(id, req));
    }

    @PatchMapping("/reorder")
    public ResponseEntity<Void> reorder(@RequestBody List<CardReorderItem> items) {
        cardService.reorder(items);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<CardResponse> create(@Valid @RequestBody CardCreateRequest req) {
        CardResponse created = cardService.create(req);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }
}
