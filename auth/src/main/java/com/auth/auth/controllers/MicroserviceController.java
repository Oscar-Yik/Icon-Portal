package com.auth.auth.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/private")
public class MicroserviceController {

    @GetMapping("/**")
    public ResponseEntity<String> handleGetRequests() {
        return new ResponseEntity<>("Authenticated", HttpStatus.OK);
    }

    @PostMapping("/**")
    public ResponseEntity<String> handlePostRequests() {
        return new ResponseEntity<>("Authenticated", HttpStatus.OK);
    }

    @PutMapping("/**")
    public ResponseEntity<String> handlePutRequests() {
        return new ResponseEntity<>("Authenticated", HttpStatus.OK);
    }

    @DeleteMapping("/**")
    public ResponseEntity<String> handleDeleteRequests() {
        return new ResponseEntity<>("Authenticated", HttpStatus.OK);
    }
}
