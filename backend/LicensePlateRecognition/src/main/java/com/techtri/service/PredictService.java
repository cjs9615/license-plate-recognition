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

	private String decodeFile(String imageByte, ResponseFlaskDto dto, int category) {
		byte[] imageBytes = Base64.getDecoder().decode(imageByte);
		try {
			ByteArrayInputStream inputStream = new ByteArrayInputStream(imageBytes);
			BufferedImage image = ImageIO.read(inputStream);

			File outputfile = new File("temp_image.jpg");
			ImageIO.write(image, dto.getFormat(), outputfile);

			JavaFileToMultipartFile mFile = new JavaFileToMultipartFile(outputfile);
			return s3Service.uploadFiles(mFile, category);

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
		imagesRepo.save(Images.builder().type("pre-prediction").url(preImage).predict(predict).build());

		if (!responseDto.isSuccess())
			return PredictResultDto.builder().isSuccess(false).build();

		String licensePlateImage = decodeFile(responseDto.getLicense_plate_image(), responseDto,1);
		String truckImage = decodeFile(responseDto.getTruck_image(), responseDto,2);
		
		imagesRepo.save(
				Images.builder().type("license-plate").url(licensePlateImage).predict(predict).build());
		imagesRepo.save(
				Images.builder().type("object-image").url(truckImage).predict(predict).build());

		
		// result 값 DB검색
		String plateNumber= responseDto.getResult(); 
		plateNumber = plateNumber.replaceAll("[^0-9\s]", "");	
		if(plateNumber.length() > 4)
			plateNumber = plateNumber.substring(plateNumber.length()-4, plateNumber.length());
		plateNumber = plateNumber.replaceAll(" ", "");
		List<RegisteredCars> numberList = regiCarRepo.findByPlateNumberContainingAndStatus(plateNumber, true);
		
		PredictResultDto result = PredictResultDto.builder()
					.licensePlateImage(licensePlateImage).objectImage(truckImage).isSuccess(responseDto.isSuccess())
					.predictResult(plateNumber).numberList(numberList).predictId(predict.getId()).build();

		return result;
	}
	
	public PredictResultDto predictLicensePlate2(MultipartFile file) throws IOException {
		//String preImage = s3Service.uploadFiles(file, 0);
		String preImage = "https://techtri-s3-bucket.s3.ap-northeast-2.amazonaws.com/pre-prediction-images/0ec5005c-ac50-4212-9a8b-b5ce63d3fb0e-7962.jpg";
		return predictLicensePlate(preImage);
	}
}
