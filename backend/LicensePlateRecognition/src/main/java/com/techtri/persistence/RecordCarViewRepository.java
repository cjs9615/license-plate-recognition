package com.techtri.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.techtri.domain.RecordCarView;

public interface RecordCarViewRepository extends JpaRepository<RecordCarView, Integer>, QuerydslPredicateExecutor<RecordCarView> {
}
