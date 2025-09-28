'use client'
import { userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const {user} = useUser();

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(true)
    const [cartItems, setCartItems] = useState({})

    const fetchProductData = async () => {
        try {
            const res = await fetch('/api/products?limit=50', { cache: 'no-store' })
            const json = await res.json()
            if (res.ok && json?.success) {
                setProducts(json.data.products || [])
            } else {
                setProducts([])
            }
        } catch (e) {
            setProducts([])
        }
    }

    const fetchUserData = async () => {
        setUserData(userDummyData)
    }

    const addToCart = async (itemId) => {

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);

    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)

    }

    const buyNow = async (itemId, quantity = 1) => {
        const normalizedId = String(itemId)
        const next = { [normalizedId]: Math.max(1, quantity) }
        setCartItems(next)
        router.push('/cart')
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => (product.id || product._id) === items);
            if (cartItems[items] > 0) {
                const unit = (itemInfo?.offerPrice ?? itemInfo?.price) || 0
                totalAmount += unit * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [])

    // Persist cart across reloads
    useEffect(() => {
        try {
            const stored = typeof window !== 'undefined' ? localStorage.getItem('cartItems') : null
            if (stored) {
                const parsed = JSON.parse(stored)
                if (parsed && typeof parsed === 'object') setCartItems(parsed)
            }
        } catch {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        try {
            if (typeof window !== 'undefined') localStorage.setItem('cartItems', JSON.stringify(cartItems))
        } catch {}
    }, [cartItems])

    const value = {
        user,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity, buyNow,
        getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}