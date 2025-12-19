package com.his.server.service;

import com.his.common.exception.BusinessException;
import com.his.server.entity.MedicineIssueRecord;
import com.his.server.entity.PharmacyInventory;
import com.his.server.entity.Prescription;
import com.his.server.repository.MedicineIssueRecordRepository;
import com.his.server.repository.PharmacyInventoryRepository;
import com.his.server.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PharmacyInventoryService {

    private final PharmacyInventoryRepository inventoryRepository;
    private final MedicineIssueRecordRepository issueRecordRepository;
    private final PrescriptionRepository prescriptionRepository;

    public List<PharmacyInventory> list(String name, String category) {
        if (name != null && !name.isEmpty()) {
            return inventoryRepository.findByNameContaining(name);
        }
        if (category != null && !category.isEmpty()) {
            return inventoryRepository.findByCategory(category);
        }
        return inventoryRepository.findAll();
    }

    public List<PharmacyInventory> listExpiringSoon() {
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysLater = today.plusDays(30);
        return inventoryRepository.findByExpirationDateBetween(today, thirtyDaysLater);
    }

    public PharmacyInventory save(PharmacyInventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public PharmacyInventory getById(Integer id) {
        return inventoryRepository.findById(id).orElse(null);
    }

    public Boolean checkStock(Integer medicineId, Integer quantity) {
        PharmacyInventory inventory = inventoryRepository.findById(medicineId)
                .orElseThrow(() -> new BusinessException("药品不存在"));
        return inventory.getQuantity() >= quantity;
    }

    @Transactional
    public void dispenseMedicine(Integer prescriptionId, Integer medicineId, Integer quantity, String operator) {
        PharmacyInventory inventory = inventoryRepository.findById(medicineId)
                .orElseThrow(() -> new BusinessException("药品不存在"));
        
        if (inventory.getQuantity() < quantity) {
            throw new BusinessException("库存不足，无法发药");
        }

        // 扣减库存
        inventory.setQuantity(inventory.getQuantity() - quantity);
        inventoryRepository.save(inventory);

        // 记录发药
        MedicineIssueRecord record = new MedicineIssueRecord();
        record.setPrescriptionId(prescriptionId);
        record.setMedicineId(medicineId);
        record.setIssueQuantity(quantity);
        record.setOperator(operator);
        record.setIssueTime(LocalDateTime.now());
        issueRecordRepository.save(record);

        // 更新处方状态
        Prescription prescription = prescriptionRepository.findById(prescriptionId).orElse(null);
        if (prescription != null) {
            prescription.setStatus(2); // 已发药
            prescriptionRepository.save(prescription);
        }
    }
}