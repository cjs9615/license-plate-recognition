package com.techtri.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocketResponseDto {
	private String type;
	private String imageUrl;
	private PredictResultDto predictResult;
	
}
