package com.sportsfacilitybooking.backend.service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportsfacilitybooking.backend.config.JwtProperties;
import com.sportsfacilitybooking.backend.dto.AuthResponse;
import com.sportsfacilitybooking.backend.dto.ChangePasswordRequest;
import com.sportsfacilitybooking.backend.dto.LoginRequest;
import com.sportsfacilitybooking.backend.dto.RegisterRequest;
import com.sportsfacilitybooking.backend.dto.UpdateUserProfileRequest;
import com.sportsfacilitybooking.backend.dto.UserProfileResponse;
import com.sportsfacilitybooking.backend.dto.UserResponse;
import com.sportsfacilitybooking.backend.entity.Role;
import com.sportsfacilitybooking.backend.entity.User;
import com.sportsfacilitybooking.backend.entity.UserProfile;
import com.sportsfacilitybooking.backend.exception.BusinessException;
import com.sportsfacilitybooking.backend.exception.DuplicateResourceException;
import com.sportsfacilitybooking.backend.exception.ResourceNotFoundException;
import com.sportsfacilitybooking.backend.repository.UserProfileRepository;
import com.sportsfacilitybooking.backend.repository.UserRepository;
import com.sportsfacilitybooking.backend.security.JwtService;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserMapper userMapper;
    private final UserProfileRepository userProfileRepository;
    private final JwtProperties jwtProperties;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        AuthenticationManager authenticationManager,
        UserDetailsService userDetailsService,
        UserMapper userMapper,
        UserProfileRepository userProfileRepository,
        JwtProperties jwtProperties
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.userMapper = userMapper;
        this.userProfileRepository = userProfileRepository;
        this.jwtProperties = jwtProperties;
    }

    public UserResponse register(RegisterRequest request) {
        if(userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username đã tồn tại");
        }
        if(userRepository.existsByEmail(request.email())){
            throw new DuplicateResourceException("Email đã tồn tại");
        }

        Role requestedRole = request.role() == null ? Role.USER : request.role();
        if (requestedRole == Role.ADMIN) {
            requestedRole = Role.USER;
        }

        User user = User.builder()
        .username(request.username())
        .email(request.email())
        .passwordHash(passwordEncoder.encode((request.password())))
        .fullName(request.fullName())
        .phoneNumber(request.phoneNumber())
        .role(requestedRole)
        .build();

        user = userRepository.save(user);
        log.info("User registered: {}", user.getFullName());
        return userMapper.toResponse(user);

    }

    public AuthResponse login(LoginRequest request) {
        // 1. Tìm user theo username hoặc Email {"usernameOrEmail": "admin", "password": "admin123"}
        User user = userRepository.findByUsername(request.usernameOrEmail())
                    .or(() ->  userRepository.findByEmail(request.usernameOrEmail()))
                    .orElseThrow(() -> new BadCredentialsException("User/Email hoặc mật khẩu không đúng"));

                    

        // 2. Authenticate bằng AuthenticationManager (Kiểm tra password qua Bcrypt)
        //    Nếu sai password -> ném lỗi BadCredentialsException -> GlobalExceptionHandler bắt và -> lỗi 401
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), request.password()));

        // 3. Load userDetails để tạo JWT (có authorities: ROLE_USER, ROLE_ADMIN))
        var userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        
        // 4. Tạo access token + refresh token  
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        log.info("User logged in: {}", user.getUsername());

        // 5. Trả về AuthResponse
        return AuthResponse.of(
            accessToken,
            refreshToken,
            // "Bearer",
            jwtProperties.getAccessTokenExpirationMs(),
            userMapper.toResponse(user)
        );


    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String username) {
        return userMapper.toResponse(findCurrentUserEntity(username));
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentProfile(String username) {
        return toProfileResponse(findCurrentUserEntity(username));
    }

    @Transactional
    public UserProfileResponse updateCurrentProfile(String username, UpdateUserProfileRequest request) {
        User user = findCurrentUserEntity(username);

        if (request.fullName() != null) {
            user.setFullName(request.fullName().trim());
        }
        if (request.phoneNumber() != null) {
            user.setPhoneNumber(request.phoneNumber().trim());
        }
        if (request.email() != null) {
            String email = request.email().trim();
            if (!email.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(email)) {
                throw new DuplicateResourceException("Email đã tồn tại");
            }
            user.setEmail(email);
        }
        if (request.avatarUrl() != null) {
            user.setAvatarUrl(request.avatarUrl().trim());
        }

        UserProfile profile = user.getUserProfile();
        if (profile == null) {
            profile = new UserProfile();
            profile.setId(user.getId());
        }

        if (request.dateOfBirth() != null) {
            profile.setDateOfBirth(request.dateOfBirth());
        }
        if (request.gender() != null) {
            profile.setGender(request.gender().trim());
        }
        if (request.address() != null) {
            profile.setAddress(request.address().trim());
        }

        userProfileRepository.save(profile);
        user.setUserProfile(profile);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return toProfileResponse(user);
    }

    @Transactional
    public void changeCurrentPassword(String username, ChangePasswordRequest request) {
        User user = findCurrentUserEntity(username);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BusinessException("Mat khau hien tai khong dung");
        }
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new BusinessException("Xac nhan mat khau moi khong khop");
        }
        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new BusinessException("Mat khau moi phai khac mat khau hien tai");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    private User findCurrentUserEntity(String username) {
        return userRepository.findByUsername(username)
            .or(() -> userRepository.findByEmail(username))
            .orElseThrow(() -> new ResourceNotFoundException("User " + username));
    }

    private UserProfileResponse toProfileResponse(User user) {
        UserProfile profile = user.getUserProfile();
        return new UserProfileResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getStatus(),
            user.getFullName(),
            user.getPhoneNumber(),
            user.getAvatarUrl() != null ? user.getAvatarUrl() : profile != null ? profile.getAvatarUrl() : null,
            profile != null ? profile.getDateOfBirth() : null,
            profile != null ? profile.getGender() : null,
            profile != null ? profile.getAddress() : null,
            user.getCreatedAt() != null ? user.getCreatedAt().toInstant(ZoneOffset.UTC) : null,
            user.getUpdatedAt() != null ? user.getUpdatedAt().toInstant(ZoneOffset.UTC) : null
        );
    }
}
