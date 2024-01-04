package com.techtri.controller;

import java.io.IOException;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.techtri.service.SocketService;

@RestController
public class SocketController {
	private SocketService socketService;
	
	public SocketController(SocketService socketService) {
		this.socketService = socketService;
	}

	@PostMapping("/api/techtri/socket/image")
	public void sendAndProcessImage(@RequestParam(value="file") MultipartFile file) throws IOException {
		socketService.sendAndProcessImage(file);
	}
}
