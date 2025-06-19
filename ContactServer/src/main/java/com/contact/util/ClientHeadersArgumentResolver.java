package com.contact.util;

import com.contact.dto.ClientHeadersDTO;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class ClientHeadersArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(ExtractClientHeaders.class)
                && parameter.getParameterType().equals(ClientHeadersDTO.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {
        return new ClientHeadersDTO(
                webRequest.getHeader("X-Client-IP"),
                webRequest.getHeader("X-Client-Location"),
                webRequest.getHeader("X-Client-Device"),
                webRequest.getHeader("X-Client-OS"),
                webRequest.getHeader("X-Client-Browser"),
                webRequest.getHeader("X-Client-Time"),
                webRequest.getHeader("X-Client-User-Agent"),
                webRequest.getHeader("X-Client-Platform")
        );
    }
}

