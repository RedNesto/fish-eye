"use client";

import styles from "./MediaLightbox.module.css";
import { createPortal } from "react-dom";
import { Media } from "@/generated/prisma/client";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";

export default function MediaLightbox({ medias, initialIndex, onCloseAction }: { medias: Media[], initialIndex: number, onCloseAction: (mediaIndex: number) => void }) {
    const [index, setIndex] = useState(initialIndex);
    const media = medias[index];
    const mediaElement = media.image
        ? <img className={styles.media} src={"/assets/" + media.image} alt={media.title}/>
        : <video className={styles.media} autoPlay muted loop playsInline src={"/assets/" + media.video} aria-label={media.title}/>;
    const dialogRootRef = useRef<HTMLDialogElement>(null);

    const onPrevious = () => {
        if (index <= 0) {
            setIndex(medias.length - 1);
        } else {
            setIndex(index - 1);
        }
    };

    const onNext = () => {
        if (index + 1 >= medias.length) {
            setIndex(0);
        } else {
            setIndex(index + 1);
        }
    };

    const onKeyUp: KeyboardEventHandler<HTMLElement> = e => {
        if (e.code === "ArrowLeft") {
            onPrevious();
        } else if (e.code === "ArrowRight") {
            onNext();
        }
    }

    useEffect(() => {
        const dialogRoot = dialogRootRef.current;
        dialogRoot?.showModal();
    });

    return createPortal(
        <dialog className={styles.lightbox} ref={dialogRootRef} closedby="any" onClose={() => onCloseAction(index)} onKeyUp={onKeyUp} aria-label={`Visionneuse de médias, ${index + 1} sur ${medias.length}`}>
            <button className={styles.closeButton} onClick={() => onCloseAction(index)} aria-label="Fermer la visionneuse">
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M42 4.23L37.77 0L21 16.77L4.23 0L0 4.23L16.77 21L0 37.77L4.23 42L21 25.23L37.77 42L42 37.77L25.23 21L42 4.23Z" fill="#911C1C"/>
                </svg>
            </button>
            <button className={styles.previousButton} onClick={onPrevious} aria-label="Média précédent">
                <svg width="30" height="48" viewBox="0 0 30 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M29.6399 42.36L11.3199 24L29.6399 5.64L23.9999 -2.46532e-07L-0.000107861 24L23.9999 48L29.6399 42.36Z" fill="#911C1C"/>
                </svg>
            </button>
            <button className={styles.nextButton} onClick={onNext} aria-label="Média suivant">
                <svg width="30" height="48" viewBox="0 0 30 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M5.05138e-07 5.64L18.32 24L6.72563e-08 42.36L5.64 48L29.64 24L5.64 3.88195e-06L5.05138e-07 5.64Z" fill="#911C1C"/>
                </svg>
            </button>
            {mediaElement}
            <h3 className={styles.title}>{media.title}</h3>
        </dialog>,
        document.body,
    );
}
