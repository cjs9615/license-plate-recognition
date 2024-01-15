package com.techtri.controller;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.techtri.domain.Predict;
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
	
	@GetMapping("/api/techtri/admin/predict/{pageNo}")
	public Page<Predict> getPredict(@PathVariable Integer pageNo, @RequestParam String date){
		return adminService.getPredictList(pageNo, date);
	}
	
	@GetMapping("/api/techtri/admin/dashboard")
	public Map<String, Object> getDashBoardInformation() {
		return adminService.getDashBoardInformation();
	}
	
	@PostMapping("/api/techtri/admin/register/car")
	public ResponseEntity<?> registerCar(@RequestParam String plateNumber) {
		return adminService.registerCar(plateNumber);
	}
	
	@PutMapping("/api/techtri/admin/car/status/{carId}")
	public ResponseEntity<?> changeCarStatus(@PathVariable Integer carId) {
		return adminService.changeCarStatus(carId);
	}
	
	@GetMapping("/api/techtri/admin/predict/detail/{predictId}")
	public Map<String, Object> getPredictDetail(@PathVariable Integer predictId) {
		return adminService.getPredictDetail(predictId);
	}
	
	@GetMapping("/api/techtri/admin/dashboard/detail/predict")
	public Map<String, Object> getDashBoardDetailPredict() {
		return adminService.getDashBoardDetailPredict();
	}
	
	@GetMapping("/api/techtri/admin/dashboard/detail/work")
	public List<Long> getDashBoardDetailWork() {
		return adminService.getMonthlyWorkCounts();
	}
}
