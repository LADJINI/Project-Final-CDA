package fr.doranco.rest.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.doranco.rest.entities.Payments;

public interface IPaymentRepository extends JpaRepository<Payments, Integer> {
}
