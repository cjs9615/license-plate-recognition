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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class WorkRecord { // 입출차 기록T
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int seq;
	
	@CreationTimestamp 
	@JsonFormat(timezone = "Asia/Seoul")
	private Timestamp timestamp;
	
//	private int carId; // 등록차량 ID
	@ManyToOne
	@JoinColumn(name="car_id")
	private RegisteredCars registeredCar;
	
//	private String writer; // 기록 유저 ID
	@ManyToOne
	@JoinColumn(name="member_id")
	private Member member;
	
	//private int predictId; // 관련 추론 ID
	@ManyToOne
	@JoinColumn(name="predict_id")
	private Predict predict;
	
	@Column(nullable = true)
	private String comment; // 비고사항
	
	public void updateCarId(RegisteredCars registerdCar) {
		this.registeredCar = registerdCar;
	}
}
