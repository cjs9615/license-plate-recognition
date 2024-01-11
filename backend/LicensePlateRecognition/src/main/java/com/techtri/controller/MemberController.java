package com.techtri.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.techtri.domain.Member;
import com.techtri.service.MemberService;

@RestController
public class MemberController {
	@Autowired
	private MemberService memberService;
	
	@PostMapping("/login")
	public void login() {}
	
	@GetMapping("/api/public/check-id")
	public ResponseEntity<?> checkId(String id){
		return memberService.checkId(id);
	}
	
	@PostMapping("/api/public/signup")
	public ResponseEntity<?> memberRegister(@RequestBody Member member) {
		return memberService.memberRegister(member);
	}
}
