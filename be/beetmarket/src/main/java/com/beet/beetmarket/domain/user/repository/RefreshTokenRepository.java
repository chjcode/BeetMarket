package com.beet.beetmarket.domain.user.repository;

import org.springframework.data.repository.CrudRepository;

import com.beet.beetmarket.domain.user.entity.RefreshTokenEntity;

public interface RefreshTokenRepository extends CrudRepository<RefreshTokenEntity, String> {
}