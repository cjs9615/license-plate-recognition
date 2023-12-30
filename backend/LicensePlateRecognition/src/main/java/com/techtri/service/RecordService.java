package com.techtri.service;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.querydsl.core.BooleanBuilder;
import com.techtri.domain.QRecordCarView;
import com.techtri.domain.RecordCarView;
import com.techtri.domain.Search;
import com.techtri.persistence.RecordCarViewRepository;

@Service
public class RecordService {
	private RecordCarViewRepository viewRepo;
	
	public RecordService(RecordCarViewRepository viewRepo) {
		this.viewRepo = viewRepo;
	}
	
	public Page<RecordCarView> getRecordList(int pageNo, Search search) {
		BooleanBuilder builder = new BooleanBuilder();
	
		QRecordCarView qview = QRecordCarView.recordCarView;
		Pageable pageable = PageRequest.of(pageNo-1, 10, Sort.Direction.DESC, "seq");
		
		if(search.getSearchCondition().equals("total"))
			return viewRepo.findAll(pageable);
		else if(search.getSearchCondition().equals("number")) {
			builder.and(qview.plateNumber.like("%"+search.getNumber()+"%"));
		} else {
			builder.and(qview.time.between(Timestamp.valueOf(search.getFromDate()), Timestamp.valueOf(search.getToDate())));
		}
		return viewRepo.findAll(builder, pageable);
	}
	
}
