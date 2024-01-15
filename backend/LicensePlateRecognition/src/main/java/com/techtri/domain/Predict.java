package com.techtri.domain;

import java.sql.Timestamp;

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
public class Predict {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@CreationTimestamp
	@JsonFormat(timezone = "Asia/Seoul")
	private Timestamp time;

	private Boolean isSuccess; // 추론 결과

	private String number; // 추론한 번호

	@Column(nullable = true)
	private String comment; // 비고사항

	public void updateNumberAndComment(String number) {
		this.number = number;
		this.comment = "executed_object_feature_matching";
	}
	
	public void updateIsSuccess(String predictNumber) {
		this.isSuccess = !isSuccess;
		this.comment = "incorrect_number : "+predictNumber;

	}
}
