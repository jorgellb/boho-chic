import React, { useState } from 'react';
import Button from '../Button';

import FormInputField from '../FormInputField/FormInputField';

import * as styles from './Contact.module.css';

const Contact = (props) => {
  const initialState = {
    name: '',
    phone: '',
    email: '',
    comment: '',
  };

  const [contactForm, setContactForm] = useState(initialState);

  const handleChange = (id, e) => {
    const tempForm = { ...contactForm, [id]: e };
    setContactForm(tempForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setContactForm(initialState);
  };

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <h4>Envíanos un Mensaje</h4>
        <p>
          Nuestro equipo de atención al cliente está disponible de lunes a viernes,
          de 9:00 a 18:00 (hora peninsular española).
        </p>
        <p>¡Estaremos encantados de ayudarte a encontrar las botas cowboy perfectas!</p>
      </div>

      <div className={styles.section}>
        <h4>Email</h4>
        <p>
          Puedes escribirnos a contacto@bohochic.es o utilizar el formulario a continuación:
        </p>
      </div>

      <div className={styles.section}>
        <h4>Aviso Importante</h4>
        <p>
          Recuerda que Boho Chic es un comparador de precios. Para consultas sobre
          pedidos, envíos o devoluciones, contacta directamente con la tienda donde
          realizaste tu compra.
        </p>
      </div>

      <div className={styles.contactContainer}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className={styles.contactForm}>
            <FormInputField
              id={'name'}
              value={contactForm.name}
              handleChange={(id, e) => handleChange(id, e)}
              type={'text'}
              labelName={'Nombre Completo'}
              required
            />
            <FormInputField
              id={'phone'}
              value={contactForm.phone}
              handleChange={(id, e) => handleChange(id, e)}
              type={'number'}
              labelName={'Teléfono'}
              required
            />
            <FormInputField
              id={'email'}
              value={contactForm.email}
              handleChange={(id, e) => handleChange(id, e)}
              type={'email'}
              labelName={'Email'}
              required
            />
            <div className={styles.commentInput}>
              <FormInputField
                id={'comment'}
                value={contactForm.comment}
                handleChange={(id, e) => handleChange(id, e)}
                type={'textarea'}
                labelName={'Mensaje'}
                required
              />
            </div>
          </div>
          <Button
            className={styles.customButton}
            level={'primary'}
            type={'buttonSubmit'}
          >
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
