package com.techtri.persistence;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techtri.domain.WorkRecord;

public interface WorkRecordRepository extends JpaRepository<WorkRecord, Integer> {
	List<Object[]> countByTimestampBetween(Timestamp startDate, Timestamp endDate);
}
