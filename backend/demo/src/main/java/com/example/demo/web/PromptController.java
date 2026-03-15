package com.example.demo.web;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.PromptService;
import com.example.demo.domain.User;
import com.example.demo.dto.PromptHistoryItem;
import com.example.demo.dto.PromptRequest;
import com.example.demo.dto.PromptResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/prompt")
@RequiredArgsConstructor
public class PromptController {

    private final PromptService promptService;

    @PostMapping
    public ResponseEntity<PromptResponse> submitPrompt(
            @Valid @RequestBody PromptRequest request,
            @AuthenticationPrincipal User user
    ) {
        
        return ResponseEntity.ok(promptService.submitPrompt(request, user));
    }

    @GetMapping("/history")
    public ResponseEntity<List<PromptHistoryItem>> getHistory(
            @AuthenticationPrincipal User user
    ) {
        List<PromptHistoryItem> history = promptService.getHistoryForUser(user);
        return ResponseEntity.ok(history);
    }
}
