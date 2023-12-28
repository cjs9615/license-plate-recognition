package com.techtri.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.techtri.dto.PredictResultDto;
import com.techtri.service.PredictService;
import com.techtri.service.S3Service;

@RestController
public class PredictController {
	private PredictService predictService;
	
	public PredictController(PredictService predictService) {
		this.predictService = predictService;
	}
	
	@PostMapping("/api/techtri/predict")
	public PredictResultDto predictLicensePlate(@RequestParam(value = "file") MultipartFile file) throws IOException{
		return predictService.predictLicensePlate(file);
	}
		
}
