package com.contact.dto;

public class ClientHeadersDTO {
    private String clientIp;
    private String clientLocation;
    private String clientDevice;
    private String clientTime;


    public ClientHeadersDTO() {}

    public ClientHeadersDTO(String clientIp, String clientLocation, String clientDevice, String clientTime) {
        this.clientIp = clientIp;
        this.clientLocation = clientLocation;
        this.clientDevice = clientDevice;
        this.clientTime = clientTime;
    }

    public String getClientIp() {
        return clientIp;
    }

    public void setClientIp(String clientIp) {
        this.clientIp = clientIp;
    }

    public String getClientLocation() {
        return clientLocation;
    }

    public void setClientLocation(String clientLocation) {
        this.clientLocation = clientLocation;
    }

    public String getClientDevice() {
        return clientDevice;
    }

    public void setClientDevice(String clientDevice) {
        this.clientDevice = clientDevice;
    }

    public String getClientTime() {
        return clientTime;
    }

    public void setClientTime(String clientTime) {
        this.clientTime = clientTime;
    }

    @Override
    public String toString() {
        return "ClientHeadersDTO{" +
                "clientIp='" + clientIp + '\'' +
                ", clientLocation='" + clientLocation + '\'' +
                ", clientDevice='" + clientDevice + '\'' +
                ", clientTime='" + clientTime + '\'' +
                '}';
    }
}