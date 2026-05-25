'use client';

import Image from 'next/image';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

type CarouselImage = {
    src: string;
    alt: string;
};

export type ProductCarouselControls = {
    handlePrev: () => void;
    handleNext: () => void;
    isAtStart: boolean;
    isAtEnd: boolean;
};

type ProductCarouselProps = {
    images: CarouselImage[];
    onControlsReady?: (controls: ProductCarouselControls) => void;
};

const MOBILE_BREAKPOINT = 768;
const VISIBLE_COUNT = 2.5;
const GAP_RATIO = 0.1;
const SNAP_TRANSITION_MS = 220;

export default function ProductCarousel({images, onControlsReady}: ProductCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [availableAreaWidth, setAvailableAreaWidth] = useState(0);
    const [carouselWidth, setCarouselWidth] = useState(0);
    const [cardWidth, setCardWidth] = useState(320);
    const [cardGap, setCardGap] = useState(32);

    const carouselRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const metricsRef = useRef({slideStep: 0, maxTranslate: 0, translateX: 0});
    const dragRef = useRef({
        active: false,
        startX: 0,
        startTranslate: 0,
        lastTranslate: 0,
    });
    const onControlsReadyRef = useRef(onControlsReady);
    onControlsReadyRef.current = onControlsReady;

    const slideStep = cardWidth + cardGap;

    const {translateX, maxTranslate, isAtStart, isAtEnd} = useMemo(() => {
        if (slideStep <= 0 || carouselWidth <= 0) {
            return {translateX: 0, maxTranslate: 0, isAtStart: true, isAtEnd: true};
        }

        const max = Math.max(0, (images.length - 2) * slideStep);
        const offset = Math.min(currentIndex * slideStep, max);

        return {
            translateX: offset,
            maxTranslate: max,
            isAtStart: currentIndex <= 0,
            isAtEnd: offset >= max - 1,
        };
    }, [currentIndex, images.length, cardWidth, cardGap, carouselWidth, slideStep]);

    metricsRef.current = {slideStep, maxTranslate, translateX};

    const clampTranslate = useCallback((value: number) => {
        const max = metricsRef.current.maxTranslate;
        return Math.min(Math.max(value, 0), max);
    }, []);

    const applyTrackTransform = useCallback((px: number, animate: boolean) => {
        const track = trackRef.current;
        if (!track) return;
        track.style.transition = animate
            ? `transform ${SNAP_TRANSITION_MS}ms ease-out`
            : 'none';
        track.style.transform = `translate3d(-${px}px, 0, 0)`;
    }, []);

    useEffect(() => {
        if (!dragRef.current.active) {
            applyTrackTransform(translateX, !isDragging);
        }
    }, [translateX, isDragging, applyTrackTransform]);

    const handlePrev = useCallback(() => {
        if (isAtStart) return;
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    }, [isAtStart]);

    const handleNext = useCallback(() => {
        if (isAtEnd) return;
        setCurrentIndex((prev) => prev + 1);
    }, [isAtEnd]);

    useEffect(() => {
        onControlsReadyRef.current?.({handlePrev, handleNext, isAtStart, isAtEnd});
    }, [handlePrev, handleNext, isAtStart, isAtEnd]);

    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;

        const updateMetrics = () => {
            const {left} = el.getBoundingClientRect();
            const availableWidth = window.innerWidth - left;
            if (availableWidth <= 0) return;

            const size = availableWidth / (VISIBLE_COUNT + 2 * GAP_RATIO);
            const gap = size * GAP_RATIO;
            const viewportWidth = size * VISIBLE_COUNT + gap * 2;

            setAvailableAreaWidth(availableWidth);
            setCarouselWidth(viewportWidth);
            setCardWidth(size);
            setCardGap(gap);
        };

        updateMetrics();
        const resizeObserver = new ResizeObserver(updateMetrics);
        resizeObserver.observe(el);
        window.addEventListener('resize', updateMetrics);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateMetrics);
        };
    }, []);

    const canUsePointerDrag = () => window.innerWidth < MOBILE_BREAKPOINT;

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!canUsePointerDrag()) return;
        if (event.pointerType === 'mouse') return;

        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = {
            active: true,
            startX: event.clientX,
            startTranslate: metricsRef.current.translateX,
            lastTranslate: metricsRef.current.translateX,
        };
        setIsDragging(true);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!dragRef.current.active) return;

        const delta = dragRef.current.startX - event.clientX;
        const next = clampTranslate(dragRef.current.startTranslate + delta);
        dragRef.current.lastTranslate = next;
        applyTrackTransform(next, false);
    };

    const finishPointerDrag = () => {
        if (!dragRef.current.active) return;

        dragRef.current.active = false;
        setIsDragging(false);

        const {slideStep: step, maxTranslate: max} = metricsRef.current;
        const final = clampTranslate(dragRef.current.lastTranslate);
        const maxIndex = step > 0 ? Math.round(max / step) : 0;
        const index = Math.min(Math.max(0, Math.round(final / step)), maxIndex);
        const snappedOffset = Math.min(index * step, max);

        applyTrackTransform(snappedOffset, true);
        setCurrentIndex(index);
    };

    return (
        <div
            ref={carouselRef}
            style={{
                width: availableAreaWidth > 0 ? availableAreaWidth : '100%',
                display: 'flex',
                justifyContent: 'flex-end',
            }}
        >
            <div
                ref={viewportRef}
                style={{
                    width: carouselWidth > 0 ? carouselWidth : '100%',
                    overflow: 'hidden',
                    flexShrink: 0,
                    touchAction: 'pan-y',
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finishPointerDrag}
                onPointerCancel={finishPointerDrag}
            >
                <div
                    ref={trackRef}
                    style={{
                        display: 'flex',
                        gap: cardGap,
                        willChange: 'transform',
                    }}
                >
                    {images.map((image) => (
                        <div
                            key={image.src}
                            style={{
                                width: cardWidth,
                                height: cardWidth,
                                flexShrink: 0,
                                position: 'relative',
                                background: '#e8e8e8',
                            }}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 768px) 40vw, 28vw"
                                style={{objectFit: 'cover', pointerEvents: 'none'}}
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
