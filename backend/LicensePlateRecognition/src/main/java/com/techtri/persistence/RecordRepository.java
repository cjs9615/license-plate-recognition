package com.techtri.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.techtri.domain.Record;

public interface RecordRepository extends JpaRepository<Record, Integer> {
	@Query(value="select count(*) from record "
			+ "where timestamp between %?1% and %?2%", nativeQuery = true)
	List<Object[]> getRecordCount(String startDate, String endDate);
}
