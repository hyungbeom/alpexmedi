'use client';

import Spline from "@splinetool/react-spline";
import ArrowButton, {Arrow} from "@/component/utils/ArrowButton";
import PartnerMarquee from "@/component/utils/PartnerMarquee";
import Image from "next/image";
import {useEffect, useMemo, useRef, useState} from "react";
import '@/resources/css/main.css'

export default function Home() {
    // 현재 몇 번째 슬라이드를 보고 있는지 저장하는 상태 (0부터 시작)
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        {src: '/model/model1.png', alt: 'Product 1'},
        {src: '/model/model2.png', alt: 'Product 2'},
        {src: '/model/model3.png', alt: 'Product 3'},
        {src: '/model/model4.png', alt: 'Product 4'},
        {src: '/model/model5.png', alt: 'Product 5'},
        {src: '/model/model6.png', alt: 'Product 6'},
    ];

    const partners = [
        {src: '/partner/partner1.svg', alt: 'partner 1'},
        {src: '/partner/partner2.svg', alt: 'partner 2'},
        {src: '/partner/partner3.svg', alt: 'partner 3'},
        {src: '/partner/partner4.svg', alt: 'partner 4'},
        {src: '/partner/partner5.svg', alt: 'partner 5'},
        {src: '/partner/partner6.svg', alt: 'partner 6'},
        {src: '/partner/partner7.svg', alt: 'partner 7'},
    ];

    const SECTION_PADDING_X = 210;
    const VISIBLE_COUNT = 2.5;
    const GAP_RATIO = 0.1;
    const carouselRef = useRef<HTMLDivElement>(null);
    const [availableAreaWidth, setAvailableAreaWidth] = useState(0);
    const [carouselWidth, setCarouselWidth] = useState(0);
    const [cardWidth, setCardWidth] = useState(320);
    const [cardGap, setCardGap] = useState(32);
    const slideStep = cardWidth + cardGap;

    const {translateX, isAtStart, isAtEnd} = useMemo(() => {
        if (slideStep <= 0 || carouselWidth <= 0) {
            return {translateX: 0, isAtStart: true, isAtEnd: true};
        }

        // 마지막: 왼쪽 2장 전체 노출 + 오른쪽 0.5칸 빈 공간
        const maxTranslate = Math.max(0, (images.length - 2) * slideStep);
        const offset = Math.min(currentIndex * slideStep, maxTranslate);

        return {
            translateX: offset,
            isAtStart: currentIndex <= 0,
            isAtEnd: offset >= maxTranslate - 1,
        };
    }, [currentIndex, images.length, cardWidth, cardGap, carouselWidth, slideStep]);

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

    const handlePrev = () => {
        if (isAtStart) return;
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        if (isAtEnd) return;
        setCurrentIndex((prev) => prev + 1);
    };

    return (
        <div>
            <div style={{height: '100dvh'}}>

                <div className={'main_container'}>
                    <div className={'title_1'}> medical service provider</div>
                    <div className={'title_line'}/>
                    <div className="title_2">
                        {/* 💻 데스크톱 버전: 모바일에서는 숨겨짐 */}
                        <div className="desktop-text">
                            <div>알펙스메디는 첨단 메디컬 에스테틱 기술을 기반으로</div>
                            <div>아름다움과 건강의 새로운 기준을 제시하는 전문기업입니다.</div>
                            <div>안전하고 효과적인 솔루션, 신뢰할 수 있는 서비스</div>
                            <div>지속적인 혁신을 통해 의료진과 고객 모두에게 더 높은 가치를 제공합니다.</div>
                        </div>

                        {/* 📱 모바일 버전: 데스크톱에서는 숨겨짐 */}
                        <div className="mobile-text">
                            <div>알펙스메디는 첨단 메디컬 에스테틱</div>
                            <div>기술을 기반으로 아름다움과</div>
                            <div>건강의 새로운 기준을 제시합니다.</div>
                            <div>안전한 솔루션과 혁신을 통해</div>
                            <div>더 높은 가치를 제공합니다.</div>
                        </div>
                    </div>
                    <div className={'title_3'}>
                        <div>ALPEXMEDI</div>
                        <div>MEDICAL</div>
                    </div>
                </div>
                <Spline
                    scene="https://prod.spline.design/hsqPbry4SlBHgozT/scene.splinecode"
                />
            </div>

            <div className={'section1_container'}>
                <div className={'section1_cover'}>
                    <div>
                        <div className={'coner'}/>
                        <div className={'subTitle'}><span>ABOUT</span><span
                            style={{fontWeight: 100}}> US</span></div>
                        <div className={'spline'}>
                            <Spline
                                scene="https://prod.spline.design/9xhNBE-gqV30NMtf/scene.splinecode"
                            />
                        </div>
                    </div>
                    <div className={'section1_description'} >

                        In the rapidly changing medical environment, we aim to improve the quality of
                        medical services and present new medical solutions, considering both
                        patient-centered values and the efficiency of medical institutions.
                        Alpexmedi strives to contribute to the advancement of the medical industry
                        through continuous research and professional networks,
                        and to be a partner that grows together with our customers.


                        <div className={'next_button'}>
                            <div className={'next_button_text'} >LEARN MORE</div>
                            <ArrowButton/>
                        </div>
                    </div>
                </div>
            </div>


            <div className={'section2_container'}>
                <div>
                    <div className={'coner' }/>
                    <div className={'subTitle'}><span>INTRODUCE OUR</span><span
                        style={{fontWeight: 100}}> PRODUCT</span></div>
                </div>
                <div className={'section2_cover'}>


                    <div>
                        <div style={{fontSize: 20, fontWeight: 300}}>
                            Alpexmedi is a premier provider of medical aesthetic solutions, specializing in the
                            distribution of state-of-the-art medical devices.
                        </div>
                        <div className={'c_button'}>
                            <button
                                type="button"
                                onClick={handlePrev}
                                disabled={isAtStart}
                                aria-label="이전 제품"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: isAtStart ? 'default' : 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: isAtStart ? 0.25 : 1,
                                }}
                            >
                                <CarouselNavArrow direction="left" disabled={isAtStart}/>
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={isAtEnd}
                                aria-label="다음 제품"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: isAtEnd ? 'default' : 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: isAtEnd ? 0.25 : 1,
                                }}
                            >
                                <CarouselNavArrow direction="right" disabled={isAtEnd}/>
                            </button>
                        </div>
                    </div>


                    <div style={{fontSize: 20, lineHeight: 2, fontWeight: 300, minWidth: 0, paddingTop : 20}}>
                        <div
                            ref={carouselRef}
                            style={{
                                width: availableAreaWidth > 0 ? availableAreaWidth : '100%',
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <div
                                style={{
                                    width: carouselWidth > 0 ? carouselWidth : '100%',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: cardGap,
                                        transform: `translateX(-${translateX}px)`,
                                        transition: 'transform 0.45s ease',
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
                                                style={{objectFit: 'cover'}}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={'next_button'}>
                            <div className={'next_button_text'}>EXPLORE MORE</div>
                            <ArrowButton/>
                        </div>
                    </div>
                </div>
            </div>

            <PartnerMarquee partners={partners}/>
        </div>
    );
}

function CarouselNavArrow({direction, disabled = false}: { direction: 'left' | 'right'; disabled?: boolean }) {
    const isLeft = direction === 'left';
    const color = disabled ? '#C3CFE3' : '#171717';

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            width: 56,
            height: 10,
        }}>
            <div style={{
                width: 56,
                height: 1,
                backgroundColor: color,
            }}/>
            <div style={{
                width: 8,
                height: 8,
                borderTop: `1px solid ${color}`,
                borderRight: `1px solid ${color}`,
                transform: isLeft ? 'rotate(-135deg)' : 'rotate(45deg)',
                position: 'absolute',
                ...(isLeft ? {left: 0} : {right: 0}),
            }}/>
        </div>
    );
}
