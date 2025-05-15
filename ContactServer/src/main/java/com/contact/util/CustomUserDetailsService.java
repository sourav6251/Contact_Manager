package com.contact.util;

import com.contact.dao.UserDAO;
import com.contact.model.Users;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserDAO userDAO;

    public CustomUserDetailsService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users users = userDAO.getByEmail(username);
        if (users == null) {
            throw new UsernameNotFoundException("User not fund");
        }
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        return new User(users.getEmail(), users.getPassword(), authorities);
    }
}
