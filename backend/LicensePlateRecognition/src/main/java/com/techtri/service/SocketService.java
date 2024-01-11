package com.techtri.service;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techtri.config.SocketHandler;
import com.techtri.dto.PredictResultDto;
import com.techtri.dto.SocketResponseDto;

@Service
public class SocketService {
	private static final int PRE_PREDICTION_FOLDER_INDEX = 0;

	private SocketHandler socketHandler; 
	private PredictService predictService;
	private S3Service s3Service;
	
	public SocketService(SocketHandler socketHandler, S3Service s3Service, PredictService predictService) {
		this.socketHandler = socketHandler;
		this.s3Service = s3Service;
		this.predictService = predictService;
	}
	
	private void sendMapData(SocketResponseDto dto) { 
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			String valueString = objectMapper.writeValueAsString(dto);
			socketHandler.sendData(valueString);
		} catch (JsonProcessingException e) {
			System.out.println("Error:" + e.getMessage());
		}
	}
	
	private String uploadAndSendImage(MultipartFile file) throws IOException {
		String preImage = s3Service.uploadFiles(file, PRE_PREDICTION_FOLDER_INDEX);
		SocketResponseDto dto = SocketResponseDto.builder().type("pre-prediction")
				.imageUrl(preImage).build();
		sendMapData(dto);
		return preImage;
	}
	
	private void predictAndSendResult(String preImage) throws IOException {
		PredictResultDto result = predictService.predictLicensePlate(preImage);
		SocketResponseDto dto = SocketResponseDto.builder().type("result").predictResult(result).build();
		sendMapData(dto);
	}
	
	public void sendAndProcessImage(MultipartFile file) throws IOException {
		String preImage = uploadAndSendImage(file);
	    predictAndSendResult(preImage);
	}
}
