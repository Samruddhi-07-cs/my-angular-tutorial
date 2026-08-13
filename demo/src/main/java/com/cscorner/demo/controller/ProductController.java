package com.cscorner.demo.controller;

import com.cscorner.demo.entity.Product;
import com.cscorner.demo.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService service;


    // =========================================================
    // GET ALL PRODUCTS
    // PUBLIC
    // =========================================================

    @GetMapping
    public List<Product> getAllProducts() {

        return service.getAllProducts();
    }


    // =========================================================
    // GET PRODUCT BY ID
    // PUBLIC
    // =========================================================

    @GetMapping("/{id}")
    public Product getProduct(
            @PathVariable Long id) {

        return service.getProductById(id);
    }


    // =========================================================
    // ADD PRODUCT
    // JWT REQUIRED
    // =========================================================

    @PostMapping
    public Product addProduct(
            @RequestBody Product product) {

        return service.saveProduct(product);
    }


    // =========================================================
    // UPDATE PRODUCT
    // JWT REQUIRED
    // =========================================================

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {

        product.setId(id);

        return service.saveProduct(product);
    }


    // =========================================================
    // DELETE PRODUCT
    // JWT REQUIRED
    // =========================================================

    @DeleteMapping("/{id}")
    public void deleteProduct(
            @PathVariable Long id) {

        service.deleteProduct(id);
    }
}