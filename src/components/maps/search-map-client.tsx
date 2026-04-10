"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import type { MapPin } from "@/types/map-pin";

export type { MapPin };

export function SearchMapClient({ pins, accessToken }: { pins: MapPin[]; accessToken: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || pins.length === 0) return;

    mapboxgl.accessToken = accessToken;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const first = pins[0];
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [first.lng, first.lat],
      zoom: pins.length === 1 ? 11 : 9,
      attributionControl: true,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    pins.forEach((p) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className =
        "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-bd-primary text-xs font-bold text-bd-primary-fg shadow-md";
      el.textContent = "●";
      el.title = p.title;
      el.addEventListener("click", () => {
        window.location.href = `/inserat/${p.slug}`;
      });

      const marker = new mapboxgl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map);
      markersRef.current.push(marker);
    });

    if (pins.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      pins.forEach((p) => bounds.extend([p.lng, p.lat]));
      map.fitBounds(bounds, { padding: 56, maxZoom: 12 });
    }

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
    };
  }, [accessToken, pins]);

  return <div ref={containerRef} className="h-full min-h-[280px] w-full rounded-xl" />;
}
