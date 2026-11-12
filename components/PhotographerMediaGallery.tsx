"use client";

import styles from "./PhotographerMediaGallery.module.css";
import { Media } from "@/generated/prisma/client";
import { useState } from "react";

function MediaGalleryItem({ media }: { media: Media }) {
    const mediaElement = media.image
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={"/assets/" + media.image} alt={media.title}/>
        : <video autoPlay muted loop playsInline src={"/assets/" + media.video} aria-label={media.title}/>;
    return (
        <article>
            {mediaElement}
            <h3>{media.title}</h3>
            <div className={styles.likes}>
                <p>{media.likes}
                    <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 21.35L9.23125 20.03C4.725 15.36 1.75 12.28 1.75 8.5C1.75 5.42 3.8675 3 6.5625 3C8.085 3 9.54625 3.81 10.5 5.09C11.4537 3.81 12.915 3 14.4375 3C17.1325 3 19.25 5.42 19.25 8.5C19.25 12.28 16.275 15.36 11.7688 20.04L10.5 21.35Z" fill="#911C1C"/>
                    </svg>
                </p>
            </div>
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

export default function PhotographerMediaGallery({ medias }: { medias: Media[] }) {
    const [orderId, setOrderId] = useState(mediaOrders[0].id);

    const items = medias
        .sort(mediaOrders.find(o => o.id == orderId)?.comparator)
        .map(media => <MediaGalleryItem key={media.id} media={media}/>);

    const orderOptions = mediaOrders.map(order => <option key={order.id} value={order.id}>{order.label}</option>);

    return (
        <section>
            <div className={styles.controls}>
                <label>Trier par
                    <select value={orderId} onChange={(e) => setOrderId(e.target.value)}>
                        {orderOptions}
                    </select>
                </label>
            </div>
            <div className={styles.list}>{items}</div>
        </section>
    );
}
