"use client";

import styles from "./PhotographerMediaGallery.module.css";
import { Media, Photographer } from "@/generated/prisma/client";
import { KeyboardEventHandler, MouseEventHandler, startTransition, useState } from "react";
import LikesDisplay from "@/components/LikesDisplay";
import MediaLightbox from "@/components/MediaLightbox";
import { incrementMediaLike } from "@/lib/prisma";
import StyledSelect from "@/components/StyledSelect";

function MediaGalleryItem({ media, onMediaClick, onMediaKeyDown, onMediaLikesUpdate }: {
    media: Media,
    onMediaClick: MouseEventHandler<HTMLElement>,
    onMediaKeyDown: KeyboardEventHandler<HTMLElement>,
    onMediaLikesUpdate: (oldLikes: number, newLikes: number) => void,
}) {
    const mediaElement = media.image
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={"/assets/" + media.image} alt={media.title} onClick={onMediaClick} tabIndex={0} onKeyDown={onMediaKeyDown}/>
        : <video src={"/assets/" + media.video} aria-label={media.title} onClick={onMediaClick} onKeyDown={onMediaKeyDown} tabIndex={0}/>;
    const [likes, setLikes] = useState(media.likes);
    const onLikeClick = () => {
        startTransition(async () => {
            const updatedMedia = await incrementMediaLike(media.id);
            if (updatedMedia) {
                setLikes(updatedMedia.likes);
                onMediaLikesUpdate(likes, updatedMedia.likes);
            }
        })
    }

    return (
        <article>
            {mediaElement}
            <h3>{media.title}</h3>
            <button className={styles.likes} onClick={onLikeClick} aria-label={`Ajouter un like, ${likes} likes`}>
                <LikesDisplay likes={likes}/>
            </button>
        </article>
    );
}

type MediaOrder = {
    id: string,
    label: string,
    comparator: (a: Media, b: Media) => number,
}

const mediaOrders: MediaOrder[] = [
    {
        id: "popularity",
        label: "Popularité",
        comparator: (a: Media, b: Media) => b.likes - a.likes,
    },
    {
        id: "date",
        label: "Date",
        comparator: (a: Media, b: Media) => Date.parse(b.date) - Date.parse(a.date),
    },
    {
        id: "title",
        label: "Titre",
        comparator: (a: Media, b: Media) => a.title.localeCompare(b.title),
    },
];

export default function PhotographerMediaGallery({ photographer, medias }: { photographer: Photographer, medias: Media[] }) {
    const [orderId, setOrderId] = useState(mediaOrders[0].id);
    const [lightbox, setLightbox] = useState(-1);
    const [totalLikes, setTotalLikes] = useState(() =>
        medias.map(media => media.likes)
            .reduce((previous, current) => previous + current, 0)
    );
    const updateMediaLikes = (oldLikes: number, newLikes: number) => setTotalLikes(totalLikes - oldLikes + newLikes);

    const items = medias
        .sort(mediaOrders.find(o => o.id == orderId)?.comparator)
        .map((media, index) => {
            const onMediaClick = () => setLightbox(index);
            const onMediaKeyDown: KeyboardEventHandler<HTMLElement> = e => {
                if (e.code === "Enter") {
                    setLightbox(index);
                    e.preventDefault();
                }
            }

            return <MediaGalleryItem key={media.id} media={media} onMediaClick={onMediaClick}
                                     onMediaKeyDown={onMediaKeyDown} onMediaLikesUpdate={updateMediaLikes}/>;
        });

    return (
        <section aria-label="Galerie de médias">
            <div className={styles.controls}>
                <label>Trier par <StyledSelect options={mediaOrders} value={orderId} setValue={setOrderId}/></label>
            </div>
            <div className={styles.list} role="list" aria-label="Liste des médias">{items}</div>
            <div className={styles.stickyInfoBox}>
                <div className={styles.likes} aria-label={`${totalLikes} likes au total`}>
                    <LikesDisplay likes={totalLikes}/>
                </div>
                <p className={styles.dailyRate}>{photographer.price.toLocaleString("fr-FR", { currency: "EUR" })}€ / jour</p>
            </div>
            {lightbox >= 0 ? <MediaLightbox medias={medias} initialIndex={lightbox} onCloseAction={() => setLightbox(-1)}/> : ""}
        </section>
    );
}
