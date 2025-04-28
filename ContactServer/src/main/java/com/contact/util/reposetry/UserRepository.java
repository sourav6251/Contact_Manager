package com.contact.util.reposetry;


import com.contact.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<Users, UUID> {

    public boolean existsByEmail(String email);
}
