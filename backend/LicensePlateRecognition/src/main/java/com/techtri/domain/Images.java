package com.techtri.domain;


import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@ToString(exclude = "predict")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Images { // 이미지 url 저장 테이블
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int seq;
	
	private String url;
	private String type;
		
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="predict_id")
	private Predict predict;
	

}
