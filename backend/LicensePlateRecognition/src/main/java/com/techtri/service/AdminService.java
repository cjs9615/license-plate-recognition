package com.techtri.service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.YearMonth;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.querydsl.core.BooleanBuilder;
import com.techtri.domain.Images;
import com.techtri.domain.Predict;
import com.techtri.domain.QPredict;
import com.techtri.domain.QRegisteredCars;
import com.techtri.domain.RegisteredCars;
import com.techtri.domain.Search;
import com.techtri.dto.PredictResultDto;
import com.techtri.persistence.ImagesRepository;
import com.techtri.persistence.PredictRepository;
import com.techtri.persistence.RegisteredCarsRepository;
import com.techtri.persistence.WorkRecordRepository;

@Service
public class AdminService {
	private RegisteredCarsRepository regiCarRepo;
	private PredictRepository predictRepo;
	private WorkRecordRepository recordRepo;
	private ImagesRepository imageRepo;
	
	public AdminService(RegisteredCarsRepository regiCarRepo, PredictRepository predictRepo, WorkRecordRepository recordRepo,
			ImagesRepository imageRepo) {
		this.regiCarRepo = regiCarRepo;
		this.predictRepo = predictRepo;
		this.recordRepo = recordRepo;
		this.imageRepo = imageRepo;
	}
	
	private String getTodayRegisteredCar() {		
		List<Object[]> list = regiCarRepo.countByRegiDate(new Date());
		return Long.toString((long) list.get(0)[0]);
	}
	
	private String getRecordCount() {
		YearMonth today = YearMonth.now();
		String start = today.atDay(1).toString();
		String end = today.atEndOfMonth().toString();
				
		Timestamp startTimestamp = Timestamp.valueOf(start+" 00:00:00");
		Timestamp endTimestamp = Timestamp.valueOf(end+" 23:59:59");
		
		List<Object[]> list = recordRepo.countByTimestampBetween(
				startTimestamp, endTimestamp);
		
		return Long.toString((long) list.get(0)[0]);
	}
	
	private Long getPredictionCountByStatus(boolean isSuccess, Timestamp start, Timestamp end) {
        List<Object[]> result = predictRepo.countByIsSuccessAndTimeBetween(isSuccess, start, end);
        if (!result.isEmpty()) {
            return (Long) result.get(0)[0];
        }
        return 0L;
    }
	
	private Map<String, Object> getTodayPredictResult() {
		Map<String, Object> map = new HashMap<>();

		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date now = new Date();
		String today = format.format(now);
		
		Timestamp start = Timestamp.valueOf(today+" 00:00:00");
		Timestamp end = Timestamp.valueOf(today+" 23:59:59");
		
		map.put("success", getPredictionCountByStatus(true, start, end));
		map.put("fail", getPredictionCountByStatus(false, start, end));

		return map;
	}
	
	public Page<RegisteredCars> getCarList(int pageNo, Search search) {
		BooleanBuilder builder = new BooleanBuilder();
		
		QRegisteredCars qcar = QRegisteredCars.registeredCars;
		Pageable pageable = PageRequest.of(pageNo-1,10, Sort.Direction.DESC,"id");
		
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
		Pageable pageable = PageRequest.of(pageNo-1,10,Sort.Direction.DESC,"id");
		
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
	
	public ResponseEntity<?> registerCar(String plateNumber) {
		if(!regiCarRepo.findByPlateNumberContaining(plateNumber).isEmpty())
			return ResponseEntity.badRequest().build();
		RegisteredCars regiCar = RegisteredCars.builder().plateNumber(plateNumber).regiDate(new Date()).status(true)
			.four_digits(plateNumber.substring(plateNumber.length()-4, plateNumber.length())).build();
		regiCarRepo.save(regiCar);
		
		return ResponseEntity.ok().build();
	}
	
	public ResponseEntity<?> changeCarStatus(int carId) {
		if(!regiCarRepo.findById(carId).isPresent())
			return ResponseEntity.badRequest().build();
		RegisteredCars car = regiCarRepo.findById(carId).get();
		car.updateCarStatus();
		regiCarRepo.save(car);
		return ResponseEntity.ok().build();
	}
	
	public Map<String, Object>  getPredictDetail(int predictId) {
		Map<String, Object> detail = new HashMap<>();
		Predict predict = predictRepo.findById(predictId).get();
		List<Images> imageList = imageRepo.findByPredictId(predict.getId());
		detail.put("predictDetail", predict);
		detail.put("imageList", imageList);
		return detail;
	}
}
