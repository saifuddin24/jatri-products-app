import {ref} from "vue";
import ProductItem from "@/types/ProductItem";
import ProductDetails from "@/components/products/ProductDetails.vue";

export interface ProductListResultInterface {
    products: ProductItem[];
    limit:number;
    skip:number;
    total:number
}


export function useProductResource(){
    const products = ref<ProductItem[]>([]);
    const productsDetailsLoaded = ref<ProductDetails[]>([]);

    async function loadProducts(){
        try {
            const result:ProductListResultInterface =
                await fetch('https://dummyjson.com/products?limit=100')
                    .then( ( r ) => r.json( ) )
            products.value = result.products

        }catch ( err ){
            console.warn( err );
        }
    }

    async function loadSingleProduct(id){

        let detail = productsDetailsLoaded.value.find(p=>p.id === id) ;

        if( !detail ) {
            detail = await fetch(`https://dummyjson.com/products/${id}`)
                .then((r) => r.json())

            detail.showing = true;
            productsDetailsLoaded.value.push(detail)
        } else {
            detail.showing = !detail.showing;
        }
    }

    return {
        products,
        productsDetailsLoaded,
        loadProducts,
        loadSingleProduct
    }
}