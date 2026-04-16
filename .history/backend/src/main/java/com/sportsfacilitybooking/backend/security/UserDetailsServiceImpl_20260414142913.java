package com.sportsfacilitybooking.backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import com.sportsfacilitybooking.backend.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // @Override
    // public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    //     com.sportsfacilitybooking.backend.entity.User user = userRepository.findByUsername(username)
    //         .orElseGet(() -> userRepository.findByEmail(username).orElse(null));

    //     if(user == null) {
    //         throw new UsernameNotFoundException("User not found: " + username);
    //     }
    //     System.out.println("DEBUG - Password from DB: [" + user.getPasswordHash() + "]");
    //     return new User(
    //         user.getUsername(),
    //         user.getPasswordHash(),
    //         Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
    //     );
    // }
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
    // Thêm log để kiểm tra giá trị nhận vào
        System.out.println("Đang tìm user với: " + usernameOrEmail);

        com.sportsfacilitybooking.backend.entity.User user = userRepository.findByUsername(usernameOrEmail)
            .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
            .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user: " + usernameOrEmail)));

    return new User(
        user.getUsername(),
        user.getPasswordHash(),
        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
    );
}

}
