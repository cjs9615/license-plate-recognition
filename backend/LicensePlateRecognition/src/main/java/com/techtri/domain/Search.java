package com.techtri.domain;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class Search {
	private String searchCondition;
	private String number;
	private String fromDate;
	private String toDate;
}
