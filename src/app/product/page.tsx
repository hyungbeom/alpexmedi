import {Suspense} from 'react';
import ProductDetailsSection from './ProductDetailsSection';
import ProductExtendedSection from './ProductExtendedSection';
import ProductPageContent from './ProductPageContent';

export default function ProductPage() {
    return (
        <>
            <Suspense fallback={null}>
                <ProductPageContent/>
            </Suspense>
            <ProductDetailsSection/>
            <ProductExtendedSection/>
        </>
    );
}
