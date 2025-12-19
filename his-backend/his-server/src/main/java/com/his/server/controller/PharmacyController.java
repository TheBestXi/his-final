package com.his.server.controller;

import com.his.common.result.GlobalResult;
import com.his.server.entity.PharmacyInventory;
import com.his.server.entity.Prescription;
import com.his.server.service.PharmacyInventoryService;
import com.his.server.repository.PrescriptionRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "药房管理")
@RestController
@RequestMapping("/api/pharmacy")
@RequiredArgsConstructor
public class PharmacyController {

    private final PharmacyInventoryService inventoryService;
    private final PrescriptionRepository prescriptionRepository;

    @Operation(summary = "查询药品列表")
    @GetMapping("/list")
    public GlobalResult<List<PharmacyInventory>> list(@RequestParam(required = false) String name,
                                                      @RequestParam(required = false) String category) {
        return GlobalResult.success(inventoryService.list(name, category));
    }

    @Operation(summary = "待发药处方列表")
    @GetMapping("/prescriptions/pending")
    public GlobalResult<List<Prescription>> listPending() {
        return GlobalResult.success(prescriptionRepository.findByStatus(1)); // 1=已支付/待发药
    }

    @Operation(summary = "发药")
    @PostMapping("/dispense")
    public GlobalResult<String> dispense(@RequestBody DispenseDTO dto) {
        inventoryService.dispenseMedicine(dto.getPrescriptionId(), dto.getMedicineId(), dto.getQuantity(), "admin"); 
        return GlobalResult.success("发药成功");
    }

    @Operation(summary = "库存预检查")
    @PostMapping("/check-stock")
    public GlobalResult<Boolean> checkStock(@RequestBody CheckStockDTO dto) {
        // Simple check: find inventory and check quantity
        // In real world, this should be in service
        return GlobalResult.success(inventoryService.checkStock(dto.getMedicineId(), dto.getQuantity()));
    }

    @lombok.Data
    public static class CheckStockDTO {
        private Integer medicineId;
        private Integer quantity;
    }

    @lombok.Data
    public static class DispenseDTO {
        private Integer prescriptionId;
        private Integer medicineId;
        private Integer quantity;
    }
}
