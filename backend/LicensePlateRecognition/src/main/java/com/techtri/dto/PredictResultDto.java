package com.techtri.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PredictResultDto {
	private String licensePlateImage;
	private String predictResult;
	private String confidenceScore;
	//private List<> numberList;
}
