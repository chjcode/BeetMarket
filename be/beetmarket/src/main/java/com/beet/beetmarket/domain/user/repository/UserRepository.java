package com.beet.beetmarket.domain.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.beet.beetmarket.domain.user.entity.User;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	User getUserByOauthName(String oauthName);

    Optional<User> findByNickname(String nickname);

    List<User> findByOauthNameIn(Collection<String> oauthNames);

    Optional<User> findByOauthName(String oauthName);
}
