package com.techtri.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.techtri.domain.RegisteredCars;
import com.techtri.domain.Search;
import com.techtri.service.AdminService;

@RestController
public class AdminController {
	private AdminService adminService;
	
	public AdminController(AdminService adminService ) {
		this.adminService = adminService;
	}
	
	@PostMapping("/api/techtri/admin/car/{pageNo}")
	public Page<RegisteredCars> getCarList(@PathVariable Integer pageNo, @RequestBody Search search) {
		return adminService.getCarList(pageNo, search);
	}
}
