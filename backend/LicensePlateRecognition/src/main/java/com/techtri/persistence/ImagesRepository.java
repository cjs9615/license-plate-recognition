package com.techtri.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techtri.domain.Images;

public interface ImagesRepository extends JpaRepository<Images, Integer> {
	List<Images> findByPredictIdAndTypeContaining(int predId,String type);
}
