package com.beet.beetmarket.domain.chat.service;

import com.beet.beetmarket.domain.chat.dto.OpenAiChatMessageDto;
import com.beet.beetmarket.domain.chat.dto.OpenAiChatRequestDto;
import com.beet.beetmarket.domain.chat.dto.OpenAiChatResponseDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
public class RealChatGptServiceImpl implements ChatGptService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${openai.api.model}")
    private String model;

    // JSON 객체만 추출하기 위한 정규 표현식
    private static final Pattern JSON_PATTERN = Pattern.compile("\\{.*\\}", Pattern.DOTALL);


    public RealChatGptServiceImpl(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public String extractScheduleAndLocation(String conversation) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        LocalDate todayKst = LocalDate.now(ZoneId.of("Asia/Seoul"));
        String formattedToday = todayKst.format(DateTimeFormatter.ofPattern("yyyy년 M월 d일"));

        String systemPromptContent = String.format(
            "You are an intelligent assistant. Your task is to extract appointment schedules and locations from Korean chat conversations. " +
                "The current date is %s (KST). Use this date to interpret relative expressions like \"내일\" (tomorrow) or \"다음 주\" (next week). " +
                "Analyze the provided chat conversation to identify any agreed-upon or strongly suggested appointment. " +
                "You MUST return your findings ONLY as a single, valid JSON object. Do not include any other text, explanations, or markdown formatting. " +
                "The JSON object should have two keys: \"schedule\" and \"location\". " +
                "- The \"schedule\" value should be a string in \"YYYY-MM-DDTHH:mm:ss\" format (assume KST if not specified, or use a common time like 14:00:00 if only a date is found). " +
                "- The \"location\" value should be a string representing the appointment place. " +
                "If no clear appointment information can be determined for a field, or if it's too ambiguous, the value for that field in the JSON MUST be null. " +
                "Correct example: {\"schedule\": \"2025-05-19T14:00:00\", \"location\": \"강남역 3번 출구\"} " +
                "Correct example (only location found): {\"schedule\": null, \"location\": \"인사동\"} " +
                "Correct example (nothing found): {\"schedule\": null, \"location\": null}",
            formattedToday
        );

        List<OpenAiChatMessageDto> messages = new ArrayList<>();
        messages.add(new OpenAiChatMessageDto("system", systemPromptContent));
        messages.add(new OpenAiChatMessageDto("user", conversation));

        OpenAiChatRequestDto requestDto = new OpenAiChatRequestDto(
            model,
            messages,
            0.2,
            200
        );

        HttpEntity<OpenAiChatRequestDto> entity = new HttpEntity<>(requestDto, headers);

        try {
            log.info("Requesting schedule extraction from OpenAI. Model: {}", model);
            ResponseEntity<String> responseEntity = restTemplate.exchange(
                apiUrl, HttpMethod.POST, entity, String.class
            );

            String responseBody = responseEntity.getBody();
            log.debug("OpenAI API raw response: {}", responseBody);

            OpenAiChatResponseDto openAiResponse = objectMapper.readValue(responseBody, OpenAiChatResponseDto.class);

            if (openAiResponse.getChoices() != null && !openAiResponse.getChoices().isEmpty()) {
                String assistantMessageContent = openAiResponse.getChoices().get(0).getMessage().getContent();
                log.info("OpenAI assistant message content: {}", assistantMessageContent);

                // ChatGPT 응답에서 순수 JSON 객체 부분만 추출
                Matcher matcher = JSON_PATTERN.matcher(assistantMessageContent);
                if (matcher.find()) {
                    String extractedJson = matcher.group(0);
                    log.info("Successfully extracted JSON from OpenAI: {}", extractedJson);
                    return extractedJson;
                } else {
                    log.warn("Could not find a valid JSON object in OpenAI assistant message: {}", assistantMessageContent);
                    return "{\"schedule\": null, \"location\": null, \"error\": \"No valid JSON found in OpenAI response\"}";
                }
            } else {
                log.warn("OpenAI response did not contain expected choices or message content.");
                return "{\"schedule\": null, \"location\": null, \"error\": \"OpenAI response format error (no choices)\"}";
            }

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            log.error("Error calling OpenAI API: {} - {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            return String.format("{\"schedule\": null, \"location\": null, \"error\": \"OpenAI API error: %s\"}", e.getStatusCode());
        } catch (RestClientException e) {
            log.error("Error with REST client call to OpenAI API: {}", e.getMessage(), e);
            return "{\"schedule\": null, \"location\": null, \"error\": \"Network or client error calling OpenAI\"}";
        } catch (JsonProcessingException e) {
            log.error("Error processing JSON from OpenAI API response: {}", e.getMessage(), e);
            return "{\"schedule\": null, \"location\": null, \"error\": \"Error parsing OpenAI response\"}";
        } catch (Exception e) {
            log.error("An unexpected error occurred while interacting with OpenAI API: {}", e.getMessage(), e);
            return "{\"schedule\": null, \"location\": null, \"error\": \"Unexpected error with OpenAI interaction\"}";
        }
    }
}