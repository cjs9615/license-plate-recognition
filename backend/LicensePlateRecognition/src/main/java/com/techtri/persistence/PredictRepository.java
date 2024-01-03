package com.techtri.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.techtri.domain.Predict;

public interface PredictRepository extends JpaRepository<Predict, Integer>, QuerydslPredicateExecutor<Predict> {
	@Query(value="select is_success, count(*) from predict "
			+ "where time between %?1% and %?2% group by is_success", nativeQuery = true)
	List<Object[]> getTodayPredictResult(String start, String end);
}
