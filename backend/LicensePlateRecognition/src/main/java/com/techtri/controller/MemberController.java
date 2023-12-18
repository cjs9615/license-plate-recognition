package com.techtri.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MemberController {

	@PostMapping("/login")
	public void login() {}
}
