package com.his.server.controller;

import com.his.common.result.GlobalResult;
import com.his.server.dto.PaymentCallbackDTO;
import com.his.server.service.FinanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "支付回调")
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final FinanceService financeService;

    @Operation(summary = "支付回调")
    @PostMapping("/callback")
    public GlobalResult<String> callback(@RequestBody PaymentCallbackDTO dto) {
        log.info("收到支付回调: {}", dto);
        if ("SUCCESS".equalsIgnoreCase(dto.getStatus())) {
            try {
                financeService.pay(dto.getFinanceId());
                return GlobalResult.success("回调处理成功");
            } catch (Exception e) {
                log.error("支付回调处理失败", e);
                return GlobalResult.error(500, "处理失败: " + e.getMessage());
            }
        }
        return GlobalResult.success("回调忽略 (状态非SUCCESS)");
    }
}
