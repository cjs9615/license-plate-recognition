package com.techtri.domain;

import java.sql.Timestamp;

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
public class WorkRecord {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int seq;
	
	@JsonFormat(timezone = "Asia/Seoul")
	private Timestamp timestamp;
	
	@ManyToOne
	@JoinColumn(name="car_id")
	private RegisteredCars registeredCar;
	
	@ManyToOne
	@JoinColumn(name="member_id")
	private Member member;
	
	@ManyToOne
	@JoinColumn(name="predict_id")
	private Predict predict;
	
	@Column(nullable = true)
	private String comment; // 비고사항
	
	public void updateCarId(RegisteredCars registerdCar) {
		this.registeredCar = registerdCar;
	}
}
