package com.techtri.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.querydsl.core.BooleanBuilder;
import com.techtri.domain.QRegisteredCars;
import com.techtri.domain.RegisteredCars;
import com.techtri.domain.Search;
import com.techtri.persistence.RegisteredCarsRepository;

@Service
public class AdminService {
	private RegisteredCarsRepository regiCarRepo;
	
	public AdminService(RegisteredCarsRepository regiCarRepo) {
		this.regiCarRepo = regiCarRepo;
	}
	
	public Page<RegisteredCars> getCarList(int pageNo, Search search) {
		BooleanBuilder builder = new BooleanBuilder();
		
		QRegisteredCars qcar = QRegisteredCars.registeredCars;
		Pageable pageable = PageRequest.of(pageNo-1,10, Sort.Direction.DESC,"seq");
		
		if(search.getSearchCondition().equals("total"))
			return regiCarRepo.findAll(pageable);
		else {
			builder.and(qcar.plateNumber.like("%"+search.getNumber()+"%"));
		}	
		
		return regiCarRepo.findAll(builder, pageable);
	}
}
