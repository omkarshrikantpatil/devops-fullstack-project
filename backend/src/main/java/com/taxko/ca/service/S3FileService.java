package com.taxko.ca.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

@Service
public class S3FileService {
	@Value("${aws.s3.bucket}")
	private String bucket;

	private final S3Client s3Client;

	public S3FileService(S3Client s3Client) {
		this.s3Client = s3Client;
	}

	public String uploadFile(MultipartFile file, String key) throws IOException {

		PutObjectRequest request = PutObjectRequest.builder()
				.bucket(bucket)
				.key(key)
				.contentType(file.getContentType())
				.build();

		s3Client.putObject(
				request,
				RequestBody.fromBytes(file.getBytes())
		);

		return getFileUrl(key);
	}

	public String getFileUrl(String key) {
		return "https://" + bucket + ".s3.amazonaws.com/" + key;
	}
}
