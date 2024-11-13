package fr.doranco.rest.exception;

/**
 * Exception levée lorsqu'une transaction est dans un état invalide.
 */
public class TransactionInvalidStateException extends RuntimeException {

    // Constructeur sans message
    public TransactionInvalidStateException() {
        super();
    }

    // Constructeur avec message d'erreur
    public TransactionInvalidStateException(String message) {
        super(message);
    }

    // Constructeur avec message et cause
    public TransactionInvalidStateException(String message, Throwable cause) {
        super(message, cause);
    }

    // Constructeur avec cause
    public TransactionInvalidStateException(Throwable cause) {
        super(cause);
    }
}
