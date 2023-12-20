package com.techtri.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.techtri.domain.Member;
import com.techtri.domain.Role;
import com.techtri.persistence.MemberRepository;

import jakarta.transaction.Transactional;

@Service
public class MemberService {
	@Autowired
	private MemberRepository memRepo;
	PasswordEncoder encoder = new BCryptPasswordEncoder();
	
	public ResponseEntity<?> checkId(String id) {
		if(memRepo.findById(id).isPresent())
			return ResponseEntity.badRequest().build();
		return ResponseEntity.ok().build();
	}
	
	@Transactional
	public ResponseEntity<?> memberRegister(Member member) {
		if(memRepo.findById(member.getId()).isPresent())
			return ResponseEntity.badRequest().build();
		
		member.setRole(Role.ROLE_MEMBER);
		member.setPassword(encoder.encode(member.getPassword()));
		memRepo.save(member);
		
		return ResponseEntity.ok().build();
	}
}
