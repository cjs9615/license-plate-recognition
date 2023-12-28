package com.techtri.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techtri.domain.Record;

public interface RecordRepository extends JpaRepository<Record, Integer> {

}
