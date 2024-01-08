package com.techtri.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseFlaskDto {
	private String format;
	private String license_plate_image;
	private String truck_image;
	private String result;
	private boolean success;
	private String message;
}
