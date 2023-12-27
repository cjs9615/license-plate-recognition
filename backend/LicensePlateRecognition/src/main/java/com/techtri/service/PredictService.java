package com.techtri.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.Base64;

import javax.imageio.ImageIO;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techtri.domain.Images;
import com.techtri.domain.Predict;
import com.techtri.dto.PredictResultDto;
import com.techtri.dto.RequestFlaskDto;
import com.techtri.dto.ResponseFlaskDto;
import com.techtri.persistence.ImagesRepository;
import com.techtri.persistence.PredictRepository;

@Service
public class PredictService {
	private PredictRepository predictRepo;
	private ImagesRepository imagesRepo;
	private S3Service s3Service;
	
	private ObjectMapper objectMapper; // JSON 객체 변환을 위해 사용

	public PredictService(S3Service s3Service, PredictRepository predictRepo, ImagesRepository imagesRepo) {
		this.s3Service = s3Service;
		this.objectMapper = new ObjectMapper();
		this.predictRepo = predictRepo;
		this.imagesRepo = imagesRepo;
	}

	private ResponseFlaskDto sendToFlask(RequestFlaskDto dto) throws JsonProcessingException {
		RestTemplate restTemplate = new RestTemplate();

		// 헤더를 JSON으로 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String param = objectMapper.writeValueAsString(dto);
		HttpEntity<String> entity = new HttpEntity<String>(param, headers);

		String url = "http://10.125.121.209:5000/receive_string";

		// response 파싱
		HttpEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
		objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
		ResponseFlaskDto responseDto = objectMapper.readValue(response.getBody(), ResponseFlaskDto.class);
		return responseDto;
	}

	private String decodeFile(ResponseFlaskDto dto) {
		byte[] imageBytes = Base64.getDecoder().decode(dto.getImage());
		try {
			ByteArrayInputStream inputStream = new ByteArrayInputStream(imageBytes);
			BufferedImage image = ImageIO.read(inputStream);

			File outputfile = new File("license_plate.jpg");
			ImageIO.write(image, dto.getFormat(), outputfile);

			JavaFileToMultipartFile mFile = new JavaFileToMultipartFile(outputfile);
			return s3Service.uploadFiles(mFile, 1);

		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	public PredictResultDto predictLicensePlate(MultipartFile file) throws IOException {
		String preImage = s3Service.uploadFiles(file,0);
		
		RequestFlaskDto requestDto = RequestFlaskDto.builder().url(preImage).build();				
		ResponseFlaskDto responseDto = sendToFlask(requestDto);
		
		String licensePlateImage = decodeFile(responseDto);
		
		Predict predict = predictRepo.save(Predict.builder()
					.isSuccess(responseDto.getResult() != null? true : false)
					.number(responseDto.getResult())
					.build());
	
		imagesRepo.save(Images.builder()
				.type("pre-prediction")
				.url(preImage)
				.predictId(predict.getSeq()).build());
		
		if(predict.getIsSuccess())
			imagesRepo.save(Images.builder()
					.type("license-plate")
					.url(licensePlateImage)
					.predictId(predict.getSeq()).build());
		
		//result에 있는 값 DB검색
		
		//PredictResultDto 전송

		return null;
	}
}
