package com.techtri;

import java.util.List;
import java.util.Map;

import com.techtri.dto.PredictResultDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class TestPredListDto {
	private String[] name;
	private String[] number;
}
