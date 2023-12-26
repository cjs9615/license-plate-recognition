package com.techtri.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;

@Service
public class S3Service {
	private AmazonS3Client s3Client;
	
	@Value("${cloud.aws.s3.bucket}")
	private String bucket;
	
	private String[] folder = {"pre-prediction-images/","license-plate/","object-images/"};
	
	public S3Service(AmazonS3Client s3Client) {
		this.s3Client = s3Client;
	}
	
	public String uploadFiles(MultipartFile file, int folderIndex) throws IOException {		
		String s3FileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
		
		ObjectMetadata objMeta = new ObjectMetadata();
		objMeta.setContentLength(file.getInputStream().available());
		
		s3Client.putObject(bucket, folder[folderIndex]+s3FileName, file.getInputStream(), objMeta);
		
		return s3Client.getUrl(bucket, folder[folderIndex]+s3FileName).toString();
	}
}
