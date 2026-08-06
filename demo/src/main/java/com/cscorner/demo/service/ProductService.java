package com.cscorner.demo.service;

import com.cscorner.demo.entity.Product;
import com.cscorner.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    // Get all products
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    // Get product by id
    public Product getProductById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Save product
    public Product saveProduct(Product product) {
        return repository.save(product);
    }

    // Delete product
    public void deleteProduct(Long id) {
        repository.deleteById(id);
    }
}