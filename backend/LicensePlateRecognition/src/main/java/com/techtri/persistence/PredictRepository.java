package com.techtri.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techtri.domain.Predict;

public interface PredictRepository extends JpaRepository<Predict, Integer> {

}
