package com.techtri.domain;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Predict {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int seq;
	private Date time; // 추론 시간
	private Boolean isSuccess; // 추론 결과
	private double confidenceScore; // 신뢰도 점수
	private String number; // 예상 번호판 번호
}
