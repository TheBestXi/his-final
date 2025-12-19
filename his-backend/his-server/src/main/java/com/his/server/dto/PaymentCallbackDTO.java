package com.his.server.dto;

import lombok.Data;

@Data
public class PaymentCallbackDTO {
    private Integer financeId;
    private String status; // SUCCESS, FAIL
    private String transactionId;
}
