package com.taxko.ca.controller;

import com.taxko.ca.dto.CaRegisterRequestDTO;
import com.taxko.ca.dto.CaRegisterResponseDTO;
import com.taxko.ca.dto.LoginRequestDTO;
import com.taxko.ca.dto.LoginResponseDTO;
import com.taxko.ca.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request) {

        LoginResponseDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/ca/register")
    public ResponseEntity<CaRegisterResponseDTO> registerCA(
            @RequestBody CaRegisterRequestDTO request
    ) {
        return ResponseEntity.ok(authService.registerCA(request));
    }
}
