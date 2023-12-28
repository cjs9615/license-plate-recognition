package com.techtri.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techtri.domain.RegisteredCars;

public interface RegisteredCarsRepository extends JpaRepository<RegisteredCars, Integer> {
	List<RegisteredCars> findByPlateNumberContaining(String number);
}
