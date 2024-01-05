package com.techtri.service;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.querydsl.core.BooleanBuilder;
import com.techtri.domain.Images;
import com.techtri.domain.Member;
import com.techtri.domain.Predict;
import com.techtri.domain.QRecordCarView;
import com.techtri.domain.RecordCarView;
import com.techtri.domain.RegisteredCars;
import com.techtri.domain.Search;
import com.techtri.domain.WorkRecord;
import com.techtri.persistence.ImagesRepository;
import com.techtri.persistence.MemberRepository;
import com.techtri.persistence.PredictRepository;
import com.techtri.persistence.RecordCarViewRepository;
import com.techtri.persistence.RegisteredCarsRepository;
import com.techtri.persistence.WorkRecordRepository;

@Service
public class RecordService {
	private RecordCarViewRepository viewRepo;
	private WorkRecordRepository recordRepo;
	private ImagesRepository imageRepo;
	private PredictRepository predRepo;
	private RegisteredCarsRepository regiCarRepo;
	private MemberRepository memberRepo;
	
	public RecordService(RecordCarViewRepository viewRepo, WorkRecordRepository recordRepo, ImagesRepository imageRepo
				, RegisteredCarsRepository regiCarRepo, PredictRepository predRepo, MemberRepository memberRepo) {
		this.viewRepo = viewRepo;
		this.recordRepo = recordRepo;
		this.imageRepo = imageRepo;
		this.predRepo = predRepo;
		this.regiCarRepo = regiCarRepo;
		this.memberRepo = memberRepo;
	}
	
	public Page<RecordCarView> getRecordList(int pageNo, Search search) {
		BooleanBuilder builder = new BooleanBuilder();
	
		QRecordCarView qview = QRecordCarView.recordCarView;
		Pageable pageable = PageRequest.of(pageNo-1, 10, Sort.Direction.DESC, "seq");
		
		if(search.getSearchCondition().equals("total"))
			return viewRepo.findAll(pageable);
		else if(search.getSearchCondition().equals("number")) {
			builder.and(qview.plateNumber.like("%"+search.getNumber()+"%"));
		} else {
			builder.and(qview.timestamp.between(Timestamp.valueOf(search.getFromDate()), Timestamp.valueOf(search.getToDate())));
		}
		return viewRepo.findAll(builder, pageable);
	}
	
	public ResponseEntity<?> getRecordDetail(int recordNo) {
		Map<String, Object> data = new HashMap<>();
		if(!recordRepo.findById(recordNo).isPresent())
			return ResponseEntity.badRequest().build();
		
		RecordCarView detail = viewRepo.findById(recordNo).get();
		
		WorkRecord record = recordRepo.findById(recordNo).get();
		
		List<Images> imageUrl = imageRepo.findByPredictIdAndTypeContaining(record.getPredict().getId(),"pre-prediction");
	
		
		data.put("detail", detail);
		data.put("images", imageUrl);
		return ResponseEntity.ok().body(data);
	}
	
	public List<RegisteredCars> getLicensePlateNumbers(int predictId) {
		Predict predict = predRepo.findById(predictId).get();
		
		String plateNumber = predict.getNumber();
		if(plateNumber.length() > 4)
			plateNumber = plateNumber.substring(plateNumber.length()-4, plateNumber.length());
		plateNumber = plateNumber.replaceAll("[^0-9]", "");		
		
		List<RegisteredCars> list = regiCarRepo.findByPlateNumberContainingAndStatus(plateNumber, true);
		
		return list;
	}
	
	public ResponseEntity<?> updateRecord(int recordId,int carId) {
		if(recordRepo.findById(recordId).isPresent()) {
			WorkRecord record = recordRepo.findById(recordId).get();
			RegisteredCars regiCar = regiCarRepo.findById(carId).get();
			record.updateCarId(regiCar);
			recordRepo.save(record);
			return ResponseEntity.ok().build();
		}
		
		return ResponseEntity.badRequest().build();
	}
	
	public ResponseEntity<?> createWorkRecord(int carId, int predictId, String writer) {
		RegisteredCars car = regiCarRepo.findById(carId).get();
		Predict predict = predRepo.findById(predictId).get();
		Member member = memberRepo.findById(writer).get();
		
		WorkRecord workRecord = WorkRecord.builder().registeredCar(car)
				.timestamp(predict.getTime()).predict(predict).member(member).build();
		
		recordRepo.save(workRecord);
		
		return ResponseEntity.ok().build();
	}
}
