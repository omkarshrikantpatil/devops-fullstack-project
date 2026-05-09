package com.taxko.ca.service;

import com.taxko.ca.dto.CaRegisterRequestDTO;
import com.taxko.ca.dto.CaRegisterResponseDTO;
import com.taxko.ca.dto.LoginRequestDTO;
import com.taxko.ca.dto.LoginResponseDTO;
import com.taxko.ca.entity.User;
import com.taxko.ca.repository.UserRepository;
import com.taxko.ca.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponseDTO login(LoginRequestDTO request) {

        User user = userRepository.findByPan(request.getPan())
                .orElseThrow(() -> new RuntimeException("Invalid pan or password"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new RuntimeException("User account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid pan or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRole());

        return new LoginResponseDTO(token, user.getRole());
    }

    public CaRegisterResponseDTO registerCA(CaRegisterRequestDTO request) {

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Password and Confirm Password do not match");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (request.getPan() != null &&
                userRepository.findByPan(request.getPan()).isPresent()) {
            throw new RuntimeException("PAN already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("CA");
        user.setIsActive(true);

        user.setDobOrDoi(request.getDobOrDoi());
        user.setMembershipNumber(request.getMembershipNumber());
        user.setProfession(request.getProfession());
        user.setPan(request.getPan());
        user.setTelephone(request.getTelephone());
        user.setMobile(request.getMobile());
        user.setOfficeAddress(request.getOfficeAddress());
        user.setPinCode(request.getPinCode());
        user.setState(request.getState());
        user.setWhatsappLink(request.getWhatsappLink());

        User savedUser = userRepository.save(user);

        return new CaRegisterResponseDTO(
                "CA registered successfully",
                savedUser.getId()
        );
    }
}
