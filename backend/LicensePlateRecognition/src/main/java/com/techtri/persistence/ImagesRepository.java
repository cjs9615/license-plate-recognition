package com.techtri.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techtri.domain.Images;

public interface ImagesRepository extends JpaRepository<Images, Integer> {

}
