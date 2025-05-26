package com.beet.beetmarket.domain.category.service;

import com.beet.beetmarket.domain.category.entity.Category;
import com.beet.beetmarket.domain.category.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<String> findAll() {
        return categoryRepository.findAll().stream()
                .map(Category::getName)
                .toList();
    }


}
