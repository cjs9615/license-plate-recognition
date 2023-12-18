package com.techtri;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.techtri.domain.Member;
import com.techtri.domain.Role;
import com.techtri.persistence.MemberRepository;

@SpringBootTest
public class MemberInsert {

	@Autowired
	private MemberRepository memberRepository;
	
	@Autowired
	private PasswordEncoder encoder;
	
	@Test
	public void testGet() {
		memberRepository.save(Member.builder()
				.id("member")
				.password(encoder.encode("abcd"))
				.role(Role.ROLE_MEMBER)
				.build());
	}
}
