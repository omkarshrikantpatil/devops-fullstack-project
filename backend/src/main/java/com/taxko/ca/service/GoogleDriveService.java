//package com.taxko.ca.service;
//
//import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
//import com.google.api.client.http.FileContent;
//import com.google.api.client.json.JsonFactory;
//import com.google.api.client.json.jackson2.JacksonFactory;
//import com.google.api.services.drive.Drive;
//import com.google.api.services.drive.model.File;
//import com.google.api.services.drive.model.Permission;
//import com.google.auth.http.HttpCredentialsAdapter;
//import com.google.auth.oauth2.GoogleCredentials;
//import jakarta.annotation.PostConstruct;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.FileOutputStream;
//import java.io.IOException;
//import java.util.Collections;
//import java.util.List;
//
//
//@Service
//public class GoogleDriveService {
//
//	private static final String APPLICATION_NAME = "Taxko Drive Integration";
//	private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
//	private static final String CREDENTIALS_FILE_PATH = "/taxko-drive-integration-8dca5c014b0c.json"; // put in resources
//	private static final String FOLDER_ID = "1w2DJq0p4GlZTH-sWF-FP6fuMyWShr0P-"; // Taxko_Client_Docs folder ID
//
//	private Drive drive;
//
//	@PostConstruct
//	public void init() throws Exception {
//		GoogleCredentials credentials = GoogleCredentials
//				.fromStream(new ClassPathResource(CREDENTIALS_FILE_PATH).getInputStream())
//				.createScoped(List.of("https://www.googleapis.com/auth/drive"));
//		drive = new Drive.Builder(
//				GoogleNetHttpTransport.newTrustedTransport(),
//				JSON_FACTORY,
//				new HttpCredentialsAdapter(credentials))
//				.setApplicationName(APPLICATION_NAME)
//				.build();
//	}
//
//	public File uploadFile(MultipartFile file) throws IOException {
//		java.io.File convFile = new java.io.File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
//		try (FileOutputStream fos = new FileOutputStream(convFile)) {
//			fos.write(file.getBytes());
//		}
//
//		File fileMetadata = new File();
//		fileMetadata.setName(file.getOriginalFilename());
//		fileMetadata.setParents(Collections.singletonList(FOLDER_ID));
//
//		FileContent mediaContent = new FileContent(file.getContentType(), convFile);
//
//		return drive.files().create(fileMetadata, mediaContent)
//				.setFields("id, name, webViewLink, webContentLink")
//				.execute();
//	}
//
//	public String generateShareableLink(String fileId, String permission) throws IOException {
//		Permission p = new Permission();
//		p.setType("anyone");
//		p.setRole(permission); // "reader" or "writer"
//		drive.permissions().create(fileId, p).execute();
//
//		File file = drive.files().get(fileId).setFields("webViewLink").execute();
//		return file.getWebViewLink();
//	}
//
//	public void deleteFile(String fileId) throws IOException {
//		drive.files().delete(fileId).execute();
//	}
//}