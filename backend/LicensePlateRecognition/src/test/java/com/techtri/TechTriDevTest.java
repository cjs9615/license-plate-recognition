package com.techtri;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techtri.dto.ResponseFlaskDto;
import com.techtri.persistence.RegisteredCarsRepository;


@SpringBootTest
public class TechTriDevTest {
	@Autowired
	private RegisteredCarsRepository regiCarRepo;

	
	
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
	
	public List<String> flaskTest(String predictNumber) {
		int numberLength = 4;

		List<String> searchStrings = new ArrayList<>(); // DB검색 문자열 리스트
		List<String> result = new ArrayList<>();
		
		int[] arr = {0, 1, 2, 3};
		boolean[] visited = new boolean[4];
		findsearchStrings(searchStrings, arr, visited, 0, numberLength, numberLength-predictNumber.length(), predictNumber);
				
		for(int i=0; i< searchStrings.size() ;i++) 
			result.addAll(regiCarRepo.findFourDigitLikeQuery(searchStrings.get(i)));
		result = result.stream().distinct().collect(Collectors.toList()); // 중복 제거
		return result;
	}

	private String cleanupPlateNumber(String plateNumber) {
		plateNumber = plateNumber.replaceAll("[^0-9\s]", "");
		if (plateNumber.length() > 4)
			plateNumber = plateNumber.substring(plateNumber.length() - 4, plateNumber.length());
		return plateNumber.replaceAll(" ", "");
	}
	
	private int testFeatureMatching(String[] nameList, String[] numberList) throws JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		RestTemplate restTemplate = new RestTemplate();

		int result = 0;
		
		for(int i=0;i<numberList.length;i++) {
			System.out.println("["+i+"번] : "+numberList[i]);
			String plateNumber = cleanupPlateNumber(numberList[i]);
			System.out.println("cleanupPlateNumber : "+plateNumber);
			
			if(plateNumber.length()==4) continue;
			
			Map<String, Object> map = new HashMap<>();
			if(plateNumber.length()==0) {
				map.put("searchResult", "");
			}
			else {				
				map.put("searchResult", flaskTest(plateNumber));
			}
			map.put("name", nameList[i]);
			
			String param = objectMapper.writeValueAsString(map);
			HttpEntity<String> entity = new HttpEntity<String>(param, headers);
			String url = "http://10.125.121.209:5000/receive_number_list";

			HttpEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
			ResponseFlaskDto responseDto = objectMapper.readValue(response.getBody(), ResponseFlaskDto.class);
			System.out.println("feature matching result : "+ responseDto.getResult());
			System.out.println();
			if(nameList[i].substring(0, 4).equals(responseDto.getResult().substring(0, 4)))
				result+=1;
		}
		
		return result;
		
	}
	
	@Test
	public void getTest() throws JsonMappingException, JsonProcessingException {
		RestTemplate restTemplate = new RestTemplate();

		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<String> entity = new HttpEntity<String>(headers);
		String url = "http://10.125.121.209:5000/test";
		
		HttpEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
		TestPredListDto responseDto = objectMapper.readValue(response.getBody(), TestPredListDto.class);
		
		
		int result = testFeatureMatching(responseDto.getName(),responseDto.getNumber());
		
		System.out.println("=".repeat(30));
		System.out.println("정답 개수 : "+ result);
	}
	

}
