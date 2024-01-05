package com.techtri.dto;

import java.sql.Timestamp;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.techtri.domain.RegisteredCars;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PredictResultDto {
	private String licensePlateImage;
	private String objectImage;
	private boolean isSuccess;
	private int predictId;
	private String predictResult;
	private List<RegisteredCars> numberList;
	
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
	private Timestamp time;
}
