package com.example.demo.domain;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.example.demo.datasource.PromptHistoryRepository;
import com.example.demo.dto.PromptHistoryItem;
import com.example.demo.dto.PromptRequest;
import com.example.demo.dto.PromptResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PromptService {

    private final PromptHistoryRepository promptHistoryRepository;
    private final RestTemplate restTemplate;

    @Value("${external.service.url:}")
    private String externalServiceUrl;

    @Transactional
    public PromptResponse submitPrompt(PromptRequest request, User user) {
        String responseText;

        if (externalServiceUrl == null || externalServiceUrl.isBlank()) {
            responseText = "External service URL is not configured. Prompt received: " + request.getPrompt();
        } else {
            try {
                responseText = forwardToExternalService(request.getPrompt());
            } catch (RestClientException e) {
                responseText = "Error forwarding to external service: " + e.getMessage();
            }
        }

        PromptHistory history = PromptHistory.builder()
                .user(user)
                .prompt(request.getPrompt())
                .response(responseText)
                .build();

        PromptHistory saved = promptHistoryRepository.save(history);

        return PromptResponse.builder()
                .id(saved.getId())
                .prompt(saved.getPrompt())
                .response(saved.getResponse())
                .status("success")
                .build();
    }

    private String forwardToExternalService(String prompt) {
        if (externalServiceUrl == null || externalServiceUrl.isBlank()) {
            return "External service not configured";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ExternalPromptRequest externalRequest = new ExternalPromptRequest(prompt);
        HttpEntity<ExternalPromptRequest> entity = new HttpEntity<>(externalRequest, headers);

        try {
            ResponseEntity<ExternalPromptResponse> response = restTemplate.postForEntity(
                    externalServiceUrl,
                    entity,
                    ExternalPromptResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody().response();
            } else {
                return "External service returned status: " + response.getStatusCode();
            }
        } catch (RestClientException e) {
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public List<PromptHistoryItem> getHistoryForUser(User user) {
        Page<PromptHistory> historyPage = promptHistoryRepository.findByUserId(
                user.getId(),
                Pageable.unpaged()
        );

        return historyPage.stream()
                .map(this::toHistoryItem)
                .toList();
    }

    private PromptHistoryItem toHistoryItem(PromptHistory history) {
        return PromptHistoryItem.builder()
                .id(history.getId())
                .prompt(history.getPrompt())
                .response(history.getResponse())
                .createdAt(history.getCreatedAt())
                .build();
    }

    private record ExternalPromptRequest(String prompt) {}

    private record ExternalPromptResponse(String response) {}
}
