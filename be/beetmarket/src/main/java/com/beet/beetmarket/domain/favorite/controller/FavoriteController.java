package com.beet.beetmarket.domain.favorite.controller;

import com.beet.beetmarket.domain.favorite.service.FavoriteService;
import com.beet.beetmarket.domain.user.entity.User;
import com.beet.beetmarket.global.response.ResponseWrapper;
import com.beet.beetmarket.global.response.ResponseWrapperFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts/{postId}/like")
public class FavoriteController {
    private final FavoriteService favoriteService;

    @Autowired
    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping
    public ResponseEntity<ResponseWrapper<Void>> addFavorite(
            @AuthenticationPrincipal User user,
            @PathVariable Long postId
    ) {
        favoriteService.createFavorite(user.getId(), postId);

        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null,
                null
        );
    }

    @DeleteMapping
    public ResponseEntity<ResponseWrapper<Void>> removeFavorite(
            @AuthenticationPrincipal User user,
            @PathVariable Long postId
    ) {
        favoriteService.deleteFavorite(user.getId(), postId);

        return ResponseWrapperFactory.setResponse(
                HttpStatus.OK,
                null,
                null
        );
    }

}
