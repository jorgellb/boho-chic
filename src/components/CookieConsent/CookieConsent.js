import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import * as styles from './CookieConsent.module.css';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Verificar si ya se aceptaron las cookies
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Mostrar banner después de un breve retraso
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setIsVisible(false);
        // Aquí se podrían inicializar scripts de tracking
    };

    const handleReject = () => {
        localStorage.setItem('cookieConsent', 'rejected');
        setIsVisible(false);
    };

    return (
        <div className={`${styles.root} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.content}>
                <div className={styles.textContainer}>
                    <h4>Uso de Cookies</h4>
                    <p>
                        Utilizamos cookies propias y de terceros para mejorar tu experiencia,
                        analizar el tráfico y gestionar afiliados. Puedes aceptar todas las cookies
                        o rechazarlas. Para más información, consulta nuestra{' '}
                        <Link to="/support#policy">Política de Cookies</Link>.
                    </p>
                </div>
                <div className={styles.buttonContainer}>
                    <button
                        className={styles.rejectButton}
                        onClick={handleReject}
                    >
                        Rechazar
                    </button>
                    <button
                        className={styles.acceptButton}
                        onClick={handleAccept}
                    >
                        Aceptar Todo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
