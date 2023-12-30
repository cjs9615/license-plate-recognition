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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.querydsl.core.BooleanBuilder;
import com.techtri.domain.Images;
import com.techtri.domain.Predict;
import com.techtri.domain.QRecordCarView;
import com.techtri.domain.Record;
import com.techtri.domain.RecordCarView;
import com.techtri.domain.RegisteredCars;
import com.techtri.domain.Search;
import com.techtri.persistence.ImagesRepository;
import com.techtri.persistence.PredictRepository;
import com.techtri.persistence.RecordCarViewRepository;
import com.techtri.persistence.RecordRepository;
import com.techtri.persistence.RegisteredCarsRepository;

@Service
public class RecordService {
	private RecordCarViewRepository viewRepo;
	private RecordRepository recordRepo;
	private ImagesRepository imageRepo;
	private PredictRepository predRepo;
	private RegisteredCarsRepository regiCarRepo;
	
	public RecordService(RecordCarViewRepository viewRepo, RecordRepository recordRepo, ImagesRepository imageRepo
				, RegisteredCarsRepository regiCarRepo, PredictRepository predRepo) {
		this.viewRepo = viewRepo;
		this.recordRepo = recordRepo;
		this.imageRepo = imageRepo;
		this.predRepo = predRepo;
		this.regiCarRepo = regiCarRepo;
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
			builder.and(qview.time.between(Timestamp.valueOf(search.getFromDate()), Timestamp.valueOf(search.getToDate())));
		}
		return viewRepo.findAll(builder, pageable);
	}
	
	public ResponseEntity<?> getRecordDetail(int recordNo) {
		Map<String, Object> data = new HashMap<>();
		if(!recordRepo.findById(recordNo).isPresent())
			return ResponseEntity.badRequest().build();
		
		RecordCarView detail = viewRepo.findById(recordNo).get();

		Record record = recordRepo.findById(recordNo).get();
		List<Images> imageUrl = imageRepo.findByPredictId(record.getPredictId());
		
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
			Record record = recordRepo.findById(recordId).get();
			record.updateCarId(carId);
			recordRepo.save(record);
			return ResponseEntity.ok().build();
		}
		
		return ResponseEntity.badRequest().build();
	}
}
