package com.his.server.controller;

import com.his.common.result.GlobalResult;
import com.his.server.dto.PrescriptionDTO;
import com.his.server.entity.Prescription;
import com.his.server.service.PrescriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "处方管理")
@RestController
@RequestMapping("/api/prescription")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @Operation(summary = "开具处方")
    @PostMapping
    public GlobalResult<Prescription> create(@RequestBody PrescriptionDTO dto) {
        return GlobalResult.success(prescriptionService.createPrescription(dto));
    }

    @Operation(summary = "查询患者处方")
    @GetMapping("/patient/{pid}")
    public GlobalResult<List<Prescription>> listByPatient(@PathVariable("pid") Integer pid) {
        return GlobalResult.success(prescriptionService.listByPatient(pid));
    }

    @Operation(summary = "库存预检查")
    @PostMapping("/check-stock")
    public GlobalResult<Boolean> checkStock(@RequestBody CheckStockDTO dto) {
        // 如果库存不足，checkStock方法会抛出异常，全局异常处理器会捕获并返回错误信息
        // 这里为了符合 check-stock 语义，也可以捕获异常返回 false，或者让前端处理错误
        // 简单起见，我们直接调用 checkStock，成功则返回 true
        prescriptionService.checkStock(dto.getMedicineId(), dto.getQuantity());
        return GlobalResult.success(true);
    }
    
    @lombok.Data
    public static class CheckStockDTO {
        private Integer medicineId;
        private Integer quantity;
    }
}
