package com.example.demo.datasource;

import com.example.demo.domain.PromptHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromptHistoryRepository extends JpaRepository<PromptHistory, Long> {

    Page<PromptHistory> findByUserId(Long userId, Pageable pageable);
}
