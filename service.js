import { db } from "./firebase"
import {collection, where, query, getDocs, updateDoc, orderBy, doc, deleteDoc} from 'firebase/firestore'

const getUserByEmail = async (email) => {
    try {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("email", "==", email))
        const docs = await getDocs(q)
        let response = {}
        docs.forEach(doc => {
            if(doc.data().email === email) {
                response = {
                    ...doc.data(),
                    docId: doc.id
                }
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const getProducts = async () => {
    const productsRef = collection(db, "products")
    const q = query(productsRef, orderBy("createdAt", "desc"))
    const docs = await getDocs(q)
    let response = []
    docs.forEach(doc => {
        response.push({
            ...doc.data(),
            docId: doc.id
        })
    })
    return response
}

const updateProduct = async (docId, data) => {
    try {
        const docRef = doc(db, "products", docId)
        await updateDoc(docRef, {
            ...data
        })
    } catch (e) {console.log(e)}
}

const deleteProduct = async (docId) => {
    try {
        const docRef = doc(db, "products", docId)
        await deleteDoc(docRef)
    } catch (e) {console.log(e)}
}
export {getUserByEmail, getProducts, updateProduct, deleteProduct}