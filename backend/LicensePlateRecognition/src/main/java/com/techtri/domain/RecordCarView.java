package com.techtri.domain;

import java.sql.Timestamp;

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
	private Timestamp time;
	private String status;
	private String plateNumber;
}
