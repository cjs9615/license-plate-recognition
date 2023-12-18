package com.techtri.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techtri.domain.Member;

public interface MemberRepository extends JpaRepository<Member, String> {

}
