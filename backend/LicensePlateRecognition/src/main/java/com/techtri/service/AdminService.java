package com.techtri.service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.querydsl.core.BooleanBuilder;
import com.techtri.domain.Predict;
import com.techtri.domain.QPredict;
import com.techtri.domain.QRegisteredCars;
import com.techtri.domain.RegisteredCars;
import com.techtri.domain.Search;
import com.techtri.persistence.PredictRepository;
import com.techtri.persistence.RecordRepository;
import com.techtri.persistence.RegisteredCarsRepository;

@Service
public class AdminService {
	private RegisteredCarsRepository regiCarRepo;
	private PredictRepository predictRepo;
	private RecordRepository recordRepo;
	
	public AdminService(RegisteredCarsRepository regiCarRepo, PredictRepository predictRepo, RecordRepository recordRepo) {
		this.regiCarRepo = regiCarRepo;
		this.predictRepo = predictRepo;
		this.recordRepo = recordRepo;
	}
	
	private String getTodayRegisteredCar() {		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date now = new Date();
		String today = format.format(now);
		
		String count = null;
		List<Object[]> list = regiCarRepo.getTodayRegisteredCar(today); 
		for(Object o[] : list) {
			count = Long.toString((long)o[0]);
		}
		
		return count;
	}
	
	private String getRecordCount() {
		YearMonth today = YearMonth.now();
		String start = today.atDay(1).toString();
		String end = today.atEndOfMonth().toString();
		
		String recordCount = null;
		
		List<Object[]> list = recordRepo.getRecordCount(start, end);
		for(Object o[] : list) {
			recordCount = Long.toString((long)o[0]);
		}
		
		return recordCount;
	}
	
	private Map<String, Object> getTodayPredictResult() {
		Map<String, Object> map = new HashMap<>();
		map.put("success", 0);
		map.put("fail", 0);
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date now = new Date();
		String today = format.format(now);
		
		List<Object[]> list = predictRepo.getTodayPredictResult(today+" 00:00:00", today+" 23:59:59");
		for(Object o[] : list) {
			if((boolean)o[0])
				map.put("success", (Long)o[1]);
			else
				map.put("fail", (Long)o[1]);
		}
		return map;
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
	
	public Page<Predict> getPredictList(int pageNo, String date) {
		BooleanBuilder builder = new BooleanBuilder();
		
		QPredict qpredict = QPredict.predict;
		Pageable pageable = PageRequest.of(pageNo-1,10,Sort.Direction.DESC,"seq");
		
		if(date.equals(""))
			return predictRepo.findAll(pageable);
		String from = date+" 00:00:00";
		String to = date+" 23:59:59";
		builder.and(qpredict.time.between(Timestamp.valueOf(from), Timestamp.valueOf(to)));
		return predictRepo.findAll(builder, pageable);
	}


	public Map<String, Object> getDashBoardInformation() {
		Map<String, Object> map = new HashMap<>();
		
		map.put("totalCarCount", regiCarRepo.count()); // 전체 등록차량수
		map.put("todayPredict", getTodayPredictResult()); //일일 추론 횟수
		map.put("thisMonthRecord", getRecordCount()); // 월간 출입 통계
		map.put("todayRegisteredCarCount", getTodayRegisteredCar()); // 일일 등록 차량 수
		
		return map;
	}
}
