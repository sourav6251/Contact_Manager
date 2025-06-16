package com.contact.util.reposetry;

import com.contact.model.Contacts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContactRepository extends JpaRepository<Contacts, UUID> {
    @Query("SELECT c FROM Contacts c WHERE c.users.userId = :userId AND c.phone = :phone")
    Optional<Contacts> findByUserIdAndPhone(@Param("userId") UUID userId, @Param("phone") String phone);

    @Query("SELECT c FROM Contacts c WHERE c.users.userId = :userId AND c.contactId = :contactId")
    Optional<Contacts> findByUserIdAndContactId(@Param("userId") UUID userId, @Param("contactId") UUID contactId);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Contacts c WHERE c.users.userId = :userId AND c.phone = :phone")
    boolean existsByUserIdAndPhone(@Param("userId") UUID userId, @Param("phone") String phone);

    @Query("SELECT c FROM Contacts c WHERE c.users.userId = :userId")
    Optional<List<Contacts>> findByUserId(@Param("userId") UUID userId);

    @Query("SELECT c FROM Contacts c WHERE " +
            "c.users.userId = :userId AND " +
            "(:query IS NULL OR :query = '' OR " +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "c.phone LIKE CONCAT('%', :query, '%'))")
    Page<Contacts> searchContacts(
            @Param("userId") UUID userId,
            @Param("query") String query,
            Pageable pageable
    );

}
