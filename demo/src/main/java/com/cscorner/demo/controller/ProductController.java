package com.cscorner.demo.controller;

import com.cscorner.demo.entity.Product;
import com.cscorner.demo.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(
    origins = {
        "https://my-angular-tutorial-production-4383.up.railway.app",
        "http://localhost:4200",
        "http://localhost:4201"
    },
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE,
        RequestMethod.OPTIONS
    }
)
public class ProductController {

    @Autowired
    private ProductService service;

    // =========================
    // GET ALL PRODUCTS
    // =========================
    @GetMapping
    public List<Product> getAllProducts() {
        return service.getAllProducts();
    }

    // =========================
    // GET PRODUCT BY ID
    // =========================
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return service.getProductById(id);
    }

    // =========================
    // ADD PRODUCT
    // =========================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product addProduct(@RequestBody Product product) {
        return service.saveProduct(product);
    }

    // =========================
    // UPDATE PRODUCT
    // =========================
    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {

        product.setId(id);
        return service.saveProduct(product);
    }

    // =========================
    // DELETE PRODUCT
    // =========================
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id) {
        service.deleteProduct(id);
    }
}