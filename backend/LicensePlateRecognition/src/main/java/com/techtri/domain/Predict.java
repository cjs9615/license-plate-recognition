package com.techtri.domain;

import java.sql.Timestamp;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.Column;
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

	@CreationTimestamp 
	private Timestamp time;
	
	private Boolean isSuccess; // 추론 결과
	private double confidenceScore; // 신뢰도 점수
	
	private String number; // 추론한 번호
}
