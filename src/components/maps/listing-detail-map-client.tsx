"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

type Props = {
  lat: number;
  lng: number;
  title: string;
  accessToken: string;
};

export function ListingDetailMapClient({ lat, lng, title, accessToken }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [lng, lat],
      zoom: 13.5,
      attributionControl: true,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    const el = document.createElement("div");
    el.className =
      "flex h-10 w-10 -translate-x-1/2 -translate-y-full cursor-default items-center justify-center";
    const dot = document.createElement("span");
    dot.className =
      "flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-bd-primary text-sm font-bold text-bd-primary-fg shadow-lg";
    dot.textContent = "●";
    dot.setAttribute("aria-hidden", "true");
    el.appendChild(dot);
    el.title = title;

    new mapboxgl.Marker({ element: el, anchor: "bottom" }).setLngLat([lng, lat]).addTo(map);

    return () => {
      map.remove();
    };
  }, [accessToken, lat, lng, title]);

  return <div ref={containerRef} className="h-full min-h-[260px] w-full rounded-xl" />;
}
