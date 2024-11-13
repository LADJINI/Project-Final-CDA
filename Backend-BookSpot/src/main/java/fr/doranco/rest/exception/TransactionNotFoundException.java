package fr.doranco.rest.exception;

/**
 * Exception levée lorsqu'une transaction n'est pas trouvée dans la base de données.
 */
public class TransactionNotFoundException extends RuntimeException {

    // Constructeur sans message
    public TransactionNotFoundException() {
        super();
    }

    // Constructeur avec message d'erreur
    public TransactionNotFoundException(String message) {
        super(message);
    }

    // Constructeur avec message et cause
    public TransactionNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    // Constructeur avec cause
    public TransactionNotFoundException(Throwable cause) {
        super(cause);
    }
}
