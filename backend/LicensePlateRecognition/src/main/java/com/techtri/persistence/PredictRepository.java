package com.techtri.persistence;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.techtri.domain.Predict;

public interface PredictRepository extends JpaRepository<Predict, Integer>, QuerydslPredicateExecutor<Predict> {
	List<Object[]> countByIsSuccess(boolean isSuccess);
	List<Object[]> countByIsSuccessAndTimeBetween(boolean isSuccess, Timestamp start, Timestamp end);
}