"use client";

import styles from "./ContactFormDialog.module.css";
import { createPortal } from "react-dom";
import { SubmitEventHandler, useEffect, useRef, useState } from "react";

export function ContactButton({ photographerName }: { photographerName: string }) {
    const [contactModalOpen, setContactModalOpen] = useState(false);

    return <>
        <button aria-label={`Contacter ${photographerName}`} onClick={() => setContactModalOpen(true)}>Contactez-moi</button>
        {contactModalOpen && <ContactFormDialog photographerName={photographerName} onCloseAction={() => setContactModalOpen(false)}/>}
    </>
}

export function ContactFormDialog({ photographerName, onCloseAction }: { photographerName: string, onCloseAction: () => void }) {
    const onSubmit: SubmitEventHandler = e => {
        const formValues: { [name: string]: string} = {};
        for (const element of e.target.elements) {
            if ((element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) && element.name) {
                formValues[element.name] = element.value;
            }
        }
        console.log("formValues %o", formValues);
    }

    const dialogRootRef = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const dialogRoot = dialogRootRef.current;
        dialogRoot?.showModal();
    });

    return createPortal(
        <dialog className={styles.contactFormDialog} ref={dialogRootRef} closedby="any" onClose={onCloseAction} aria-label={`Formulaire de contact pour ${photographerName}`}>
            <h1>Contactez-moi<br/>{photographerName}</h1>
            <button className={styles.closeButton} onClick={onCloseAction} aria-label="Fermer le formulaire">
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M57 19.23L52.77 15L36 31.77L19.23 15L15 19.23L31.77 36L15 52.77L19.23 57L36 40.23L52.77 57L57 52.77L40.23 36L57 19.23Z" fill="white"/>
                </svg>
            </button>
            <form onSubmit={onSubmit} method="dialog">
                <label htmlFor="firstname">Prénom</label>
                <input type="text" name="firstname" id="firstname" required/>
                <label htmlFor="lastname">Nom</label>
                <input type="text" name="lastname" id="lastname" required/>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" required/>
                <label htmlFor="message">Votre message</label>
                <textarea name="message" id="message" required/>
                <input type="submit" value="Envoyer"/>
            </form>
        </dialog>,
        document.body,
    );
}
