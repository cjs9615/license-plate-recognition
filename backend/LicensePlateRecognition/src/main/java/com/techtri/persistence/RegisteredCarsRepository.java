package com.techtri.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.techtri.domain.RegisteredCars;

public interface RegisteredCarsRepository extends JpaRepository<RegisteredCars, Integer>,  QuerydslPredicateExecutor<RegisteredCars> {
	List<RegisteredCars> findByPlateNumberContaining(String number);
	List<RegisteredCars> findByPlateNumberContainingAndStatus(String number,boolean status);
	
	@Query(value="select count(*) from registered_cars where regi_date=%?1%", nativeQuery = true)
	List<Object[]> getTodayRegisteredCar(String date);
}
