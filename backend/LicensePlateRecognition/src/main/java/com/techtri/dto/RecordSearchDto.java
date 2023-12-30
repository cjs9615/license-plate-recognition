package com.techtri.dto;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordSearchDto {
	private int seq;
	private Timestamp time;
	private String status;
	private String plateNumber;
}
