package fr.doranco.rest.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.doranco.rest.entities.Payment;

public interface IPaymentRepository extends JpaRepository<Payment, Integer> {
}
