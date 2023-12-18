package com.techtri.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.techtri.domain.Member;
import com.techtri.persistence.MemberRepository;

@Service
public class SecurityUserDetailsService implements UserDetailsService {

	@Autowired
	private MemberRepository memRepo;

	@Override
	public UserDetails loadUserByUsername(@Param(value="id") String username) throws UsernameNotFoundException {
		
		Member member = memRepo.findById(username).orElseThrow(()->new UsernameNotFoundException("Not Foound!"));

		return new User(member.getId(), member.getPassword(), AuthorityUtils.createAuthorityList(member.getRole().toString()));
	}

}
