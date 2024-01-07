package com.techtri.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.techtri.domain.RecordCarView;
import com.techtri.domain.RegisteredCars;
import com.techtri.domain.Search;
import com.techtri.service.RecordService;

@RestController
public class RecordController {
	private RecordService recordService;
	
	public RecordController(RecordService recordService) {
		this.recordService = recordService;
	}
	
	@PostMapping("/api/techtri/record/{pageNo}")
	public Page<RecordCarView> getRecord(@PathVariable Integer pageNo, @RequestBody Search search) {
		return recordService.getRecordList(pageNo, search);
	}

	@GetMapping("/api/techtri/record/detail/{seq}")
	public ResponseEntity<?> getRecordDetail(@PathVariable Integer seq) {
		return recordService.getRecordDetail(seq);
	}
	
	@GetMapping("/api/techtri/record/numbers")
	public List<RegisteredCars> getLicensePlateNumbers(@RequestParam Integer predictId){
		return recordService.getLicensePlateNumbers(predictId);
	}
	
	@PutMapping("/api/techtri/record/detail/{recordId}")
	public ResponseEntity<?> updateRecord(@PathVariable Integer recordId,@RequestParam Integer carId) {
		return recordService.updateRecord(recordId, carId);
	}
	
	@PostMapping("/api/techtri/record/work/{carId}/{predictId}")
	public ResponseEntity<?> createWorkRecord(@PathVariable Integer carId, @PathVariable Integer predictId,
			@RequestParam String writer) {
		return recordService.createWorkRecord(carId, predictId, writer);
	}
}
