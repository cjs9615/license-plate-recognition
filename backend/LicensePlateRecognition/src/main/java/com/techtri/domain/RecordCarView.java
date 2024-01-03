package com.techtri.domain;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecordCarView {
	@Id
	private int seq; // recordID
	private String writer;
	@JsonFormat(timezone = "Asia/Seoul")
	private Timestamp timestamp;
	private String status;
	private String plateNumber;
	private int predictId;
	private String comment; 
}
