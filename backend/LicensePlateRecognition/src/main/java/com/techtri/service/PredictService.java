package com.techtri.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

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
import com.techtri.domain.RegisteredCars;
import com.techtri.dto.PredictResultDto;
import com.techtri.dto.RequestFlaskDto;
import com.techtri.dto.ResponseFlaskDto;
import com.techtri.persistence.ImagesRepository;
import com.techtri.persistence.PredictRepository;
import com.techtri.persistence.RegisteredCarsRepository;
import com.techtri.util.JavaFileToMultipartFile;

import jakarta.transaction.Transactional;

@Service
public class PredictService {
	private PredictRepository predictRepo;
	private ImagesRepository imagesRepo;
	private RegisteredCarsRepository regiCarRepo;
	private S3Service s3Service;

	private ObjectMapper objectMapper; // JSON 객체 변환을 위해 사용

	public PredictService(S3Service s3Service, PredictRepository predictRepo, ImagesRepository imagesRepo, RegisteredCarsRepository regiCarRepo) {
		this.s3Service = s3Service;
		this.objectMapper = new ObjectMapper();
		this.predictRepo = predictRepo;
		this.imagesRepo = imagesRepo;
		this.regiCarRepo = regiCarRepo;
	}

	private ResponseFlaskDto sendToFlask(RequestFlaskDto dto) throws JsonProcessingException {
		RestTemplate restTemplate = new RestTemplate();

		// 헤더를 JSON으로 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String param = objectMapper.writeValueAsString(dto);
		HttpEntity<String> entity = new HttpEntity<String>(param, headers);

		String url = "http://10.125.121.209:5000/receive_image_url";

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
	
	@Transactional
	public PredictResultDto predictLicensePlate(String preImage) throws IOException {
		RequestFlaskDto requestDto = RequestFlaskDto.builder().url(preImage).build();
		ResponseFlaskDto responseDto = sendToFlask(requestDto);
		
		Predict predict = predictRepo.save(Predict.builder()
				.isSuccess(responseDto.isSuccess())
				.number(responseDto.getResult()).comment(responseDto.getMessage()).build());

		imagesRepo.save(Images.builder().type("pre-prediction").url(preImage).predictId(predict.getSeq()).build());

		if (!responseDto.isSuccess())
			return PredictResultDto.builder().isSuccess(false).build();

		String licensePlateImage = decodeFile(responseDto);
		imagesRepo.save(
				Images.builder().type("license-plate").url(licensePlateImage).predictId(predict.getSeq()).build());

		
		// result 값 DB검색
		String plateNumber= responseDto.getResult(); 
		if(plateNumber.length() > 4)
			plateNumber = plateNumber.substring(plateNumber.length()-4, plateNumber.length());
		plateNumber = plateNumber.replaceAll("[^0-9]", "");		
		List<RegisteredCars> numberList = regiCarRepo.findByPlateNumberContainingAndStatus(plateNumber, true);
		
		PredictResultDto result = PredictResultDto.builder()
					.licensePlateImage(licensePlateImage).isSuccess(responseDto.isSuccess())
					.predictResult(plateNumber).numberList(numberList).predictId(predict.getSeq()).build();

		return result;
	}
	
	public PredictResultDto predictLicensePlate2(MultipartFile file) throws IOException {
		String preImage = s3Service.uploadFiles(file, 0);
		return predictLicensePlate(preImage);
	}
}
