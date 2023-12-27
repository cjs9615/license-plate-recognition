package com.techtri.dto;

import java.util.List;

import com.techtri.domain.RegisteredCars;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PredictResultDto {
	private String licensePlateImage;
	private boolean isSuccess;
	private int predictId;
	private String predictResult;
	private double confidenceScore;
	private List<RegisteredCars> numberList;
}
