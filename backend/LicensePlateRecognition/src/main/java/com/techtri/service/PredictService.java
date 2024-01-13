package com.techtri.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

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
	private static final String FLASK_PREDICT_URL = "http://10.125.121.209:5000/receive_image_url";
	private static final String FLASK_OBJECT_URL = "http://10.125.121.209:5000/receive_number_list";

	private static final int LICENSE_PLATE_FOLDER_INDEX = 1;
	private static final int OBJECT_IMAGE_FOLDER_INDEX = 2;
	private static final int NUMBER_LENGTH = 4;

	private PredictRepository predictRepo;
	private ImagesRepository imagesRepo;
	private RegisteredCarsRepository regiCarRepo;
	private S3Service s3Service;

	private ObjectMapper objectMapper; // JSON 객체 변환을 위해 사용

	public PredictService(S3Service s3Service, PredictRepository predictRepo, ImagesRepository imagesRepo,
			RegisteredCarsRepository regiCarRepo) {
		this.s3Service = s3Service;
		this.objectMapper = createObjectMapper();
		this.predictRepo = predictRepo;
		this.imagesRepo = imagesRepo;
		this.regiCarRepo = regiCarRepo;
	}

	private ObjectMapper createObjectMapper() {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
		return objectMapper;
	}

	@Transactional
	public PredictResultDto predictLicensePlate(String preImage) throws IOException {
		RequestFlaskDto requestDto = RequestFlaskDto.builder().url(preImage).build();
		ResponseFlaskDto responseDto = sendToFlask(requestDto, FLASK_PREDICT_URL);

		boolean isSuccess = responseDto.isSuccess();

		Predict predict = null;

		if (isSuccess && !containsNumbersOnly(responseDto.getResult())) { // 추론결과는 성공, 숫자 없이 문자만 찾아진 경우
			isSuccess = false;
			predict = predictRepo.save(Predict.builder().isSuccess(isSuccess).number("")
					.comment("number_prediction_failed : " + responseDto.getResult()).build());
		} else {
			predict = predictRepo.save(Predict.builder().isSuccess(responseDto.isSuccess())
					.number(responseDto.getResult()).comment(responseDto.getMessage()).build());
		}

		imagesRepo.save(Images.builder().type("pre-prediction").url(preImage).predict(predict).build());

		if (!isSuccess)
			return PredictResultDto.builder().time(predict.getTime()).isSuccess(false).build();

		String licensePlateImage = decodeAndUploadImage(responseDto.getLicense_plate_image(), responseDto, LICENSE_PLATE_FOLDER_INDEX);
		String objectImage = decodeAndUploadImage(responseDto.getTruck_image(), responseDto, OBJECT_IMAGE_FOLDER_INDEX);
		saveImage(predict, licensePlateImage, objectImage);
		String plateNumber = cleanupPlateNumber(responseDto.getResult());
		// cleanup된 번호판 길이가 1~3자리인 경우 feature matching
		if(plateNumber.length() < NUMBER_LENGTH)
			plateNumber = handleNonFourDigitPlateNumber(plateNumber, predict);		
		
		// db에서 번호판 검색
		List<RegisteredCars> numberList = regiCarRepo.findByPlateNumberContainingAndStatus(plateNumber, true);

		return PredictResultDto.builder().licensePlateImage(licensePlateImage)
				.objectImage(objectImage).isSuccess(responseDto.isSuccess()).predictResult(plateNumber)
				.numberList(numberList).time(predict.getTime()).predictId(predict.getId()).build();
	}
	
	//기존 메인페이지에서 사용하기 위한 코드 (추후에 제거)
	public PredictResultDto predictLicensePlate2(MultipartFile file) throws IOException {
		String preImage = s3Service.uploadFiles(file, 0);
		return predictLicensePlate(preImage);
	}

	private boolean containsNumbersOnly(String input) {
		String regex = ".*\\d+.*";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(input);
		return matcher.find();

	}

	private String cleanupPlateNumber(String plateNumber) {
		plateNumber = plateNumber.replaceAll("[^0-9\s]", "");
		if (plateNumber.length() > 4)
			plateNumber = plateNumber.substring(plateNumber.length() - 4, plateNumber.length());
		return plateNumber.replaceAll(" ", "");
	}

	private ResponseFlaskDto sendToFlask(Object object, String url) throws JsonProcessingException {
		RestTemplate restTemplate = new RestTemplate();

		// 헤더를 JSON으로 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String param = objectMapper.writeValueAsString(object);
		HttpEntity<String> entity = new HttpEntity<String>(param, headers);

		// response 파싱
		HttpEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
		ResponseFlaskDto responseDto = objectMapper.readValue(response.getBody(), ResponseFlaskDto.class);
		return responseDto;
	}

	private String decodeAndUploadImage(String imageByte, ResponseFlaskDto dto, int category) {
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
	
	private void saveImage(Predict predict, String licensePlateImage, String objectImage) {
		imagesRepo.save(Images.builder().type("license-plate").url(licensePlateImage).predict(predict).build());
		imagesRepo.save(Images.builder().type("object-image").url(objectImage).predict(predict).build());
	}
	
	private String handleNonFourDigitPlateNumber(String plateNumber, Predict predict) throws JsonProcessingException {
		List<String> searchStrings = new ArrayList<>(); // DB검색 문자열 리스트
		List<String> result = new ArrayList<>();
		
		int[] arr = {0, 1, 2, 3};
		boolean[] visited = new boolean[4];
		findsearchStrings(searchStrings, arr, visited, 0, NUMBER_LENGTH, NUMBER_LENGTH-plateNumber.length(), plateNumber);
		
		for(int i=0; i< searchStrings.size() ;i++) 
			result.addAll(regiCarRepo.findFourDigitLikeQuery(searchStrings.get(i)));

		result = result.stream().distinct().collect(Collectors.toList()); // 중복 제거
		Map<String, List<String>> map = new HashMap<>();
		map.put("searchResult", result);
		
		ResponseFlaskDto objectResult = sendToFlask(map, FLASK_OBJECT_URL);
		String predictNumber = objectResult.getResult().substring(0,4);
		predict.updateNumberAndComment(predictNumber);
		predictRepo.save(predict);
		
		return predictNumber;
	}
	
	private List<Integer> findUnderscoreIndex(int[] arr, boolean[] visited, int n) {
		List<Integer> underscoreIndex = new ArrayList<>();
		for (int i = 0; i < n; i++) {
			if(visited[i]) {
				underscoreIndex.add(arr[i]);
			}
		}
		return underscoreIndex;
	}
	
	private void findsearchStrings(List<String> searchStrings,int[] arr, boolean[] visited, int start, int n, int r,String str) {
	    if(r == 0) {
	    	List<Integer> underscoreIndex = findUnderscoreIndex(arr, visited, n);
	    	
	    	StringBuffer sb = new StringBuffer();
	    	sb.append(str);
	    	
	    	for(int index = 0; index<underscoreIndex.size(); index++) {
	    		sb.insert(underscoreIndex.get(index), "_");
	    	}
	    	searchStrings.add(sb.toString());
	    	return;
	    } 

	    for(int i=start; i<n; i++) {
	        visited[i] = true;
	        findsearchStrings(searchStrings, arr, visited, i + 1, n, r - 1, str);
	        visited[i] = false;
	    }
	}
	

}
