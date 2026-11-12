"use client";

import styles from "./PhotographerMediaGallery.module.css";
import { Media } from "@/generated/prisma/client";
import { useState } from "react";
import LikesDisplay from "@/components/LikesDisplay";

function MediaGalleryItem({ media }: { media: Media }) {
    const mediaElement = media.image
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={"/assets/" + media.image} alt={media.title}/>
        : <video autoPlay muted loop playsInline src={"/assets/" + media.video} aria-label={media.title}/>;
    return (
        <article>
            {mediaElement}
            <h3>{media.title}</h3>
            <div className={styles.likes}><LikesDisplay likes={media.likes}/></div>
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
