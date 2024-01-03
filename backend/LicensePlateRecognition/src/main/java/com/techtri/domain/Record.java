package com.techtri.domain;

import java.sql.Timestamp;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

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
public class Record { // 입출차 기록T
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int seq;
	
	@CreationTimestamp 
	@JsonFormat(timezone = "Asia/Seoul")
	private Timestamp timestamp;
	private String status; // 입/출차 유형
	
	private int carId; // 등록차량 ID
	private String writer; // 기록 유저 ID
	private int predictId; // 관련 추론 ID
	
	@Column(nullable = true)
	private String comment; // 비고사항
	
	public void updateCarId(int carId) {
		this.carId = carId;
	}
}
