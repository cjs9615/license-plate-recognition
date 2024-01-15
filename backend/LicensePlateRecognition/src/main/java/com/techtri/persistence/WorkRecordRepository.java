package com.techtri.persistence;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.techtri.domain.WorkRecord;

public interface WorkRecordRepository extends JpaRepository<WorkRecord, Integer> {
	List<Object[]> countByTimestampBetween(Timestamp startDate, Timestamp endDate);
	
	@Query("select month(w.timestamp) as month, count(*) from WorkRecord w "
			+ "where year(w.timestamp) = year(curdate()) group by month(w.timestamp)")
	List<Object[]> getMonthlyWordCount();
}
