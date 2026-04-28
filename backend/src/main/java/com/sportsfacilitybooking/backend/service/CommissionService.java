package com.sportsfacilitybooking.backend.service;

import com.sportsfacilitybooking.backend.entity.Commission;
import com.sportsfacilitybooking.backend.repository.CommissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class CommissionService {

    @Autowired
    private CommissionRepository commissionRepository;

    
    public Commission getSystemCommission() {
        return commissionRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    Commission newConfig = new Commission();
                    newConfig.setCommissionRate(new BigDecimal("10.0")); // Mặc định 10%
                    return commissionRepository.save(newConfig);
                });
    }

    
    public Commission updateCommissionRate(BigDecimal newRate) {
        Commission config = getSystemCommission();
        config.setCommissionRate(newRate);
        return commissionRepository.save(config);
    }
}