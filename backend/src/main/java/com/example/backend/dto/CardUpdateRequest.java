package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CardUpdateRequest(

        @NotBlank
        @Size(max = 100)
        String title,

        @Size(max = 500)
        String description,

        @NotBlank
        @Pattern(regexp = "high|mid|low")
        String priority,

        LocalDate dueDate,

        @NotBlank
        @Pattern(regexp = "todo|doing|done")
        String status
) {}
