package com.contact.dto;

public record ClientHeadersDTO(
        String clientIp,
        String clientLocation,
        String clientDevice,
        String clientOS,
        String clientBrowser,
        String clientTime,
        String clientUserAgent,
        String clientPlatform
) {}
