import { useEffect, useState } from "react";
import styles from "./home.module.css";
import { useCartContext } from "../../ItemsProvider";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../AuthProvider";

const Home = () => {

    const {addItemToCart} = useCartContext();
    const {user} = useAuthContext();

    const [data,setData] = useState([]);
    const [filtered,setFiltered] = useState([]);
    const [maxPrice,setMaxPrice] = useState(40000);
    const [filterText,setFilterText] = useState("");
    const [category,setCategory] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            const res = await fetch("https://fakestoreapi.com/products");
            const data = await res.json();
            // console.log(data);
            data.forEach(product => {
                product.price = Math.round(product.price/10)*500-1;
            });
            setData(data);
            setFiltered(data);
        }

        getData();      
    },[])

    const filter = ({text,price,categories}) => {
        if(text === undefined) {
            text = filterText;
        }
        if(price === undefined) {
            price = maxPrice;
        }
        if(categories === undefined) {
            categories = category;
        }
        let filteredData = data.filter(product => product.title.toLowerCase().includes(text.toLowerCase()) && product.price <= Number(price));
        if(categories.length > 0) {
            filteredData = filteredData.filter(product => categories.includes(product.category));
        }
        setFiltered(filteredData);
    }

    const filterName = (e) => {
        let text = e.target.value.trim();
        setFilterText(text)
        filter({text});
    }

    const updateRange = (maxPrice) => {
        setMaxPrice(maxPrice,filter({price:maxPrice}));
    }

    const updateCategory = (e) => {
        let cat = e.target.value;
        if(category.includes(cat)){
            // remove it
            let temp = category.filter(c => c !== cat);
            setCategory(temp,filter({categories:temp}));
        }
        else{
            // add it
            setCategory([...category,cat],filter({categories:[...category,cat]}));
        }
    } 

    const addToCart = (product) => {
        if(!user.email){
            navigate("/login");
        }
        addItemToCart(product)
    }

    return (
        <>
            <div className={styles.head}>
                <h1 className="heading">Home</h1>
                <input className={styles.search} onChange={(e) => filterName(e)} type="text" placeholder="Search By Name" />
            </div>
            <div className={styles.container}>
                <div className={styles.filters}>
                    <p>Filter</p>
                    <label htmlFor="price-range">Price: {maxPrice}</label>
                    <input type="range" id="price-range" onChange={e => updateRange(e.target.value)} min={100} max={40000} defaultValue={40000} />
                    <p>Category</p>
                    <div>
                        <input type="checkbox" id="cat1" name="cat1" value="men's clothing" onClick={(e) => updateCategory(e)} />
                        <label htmlFor="cat1">Men's Clothing</label>
                    </div>
                    <div>
                        <input type="checkbox" id="cat2" name="cat2" value="women's clothing" onClick={(e) => updateCategory(e)} />
                        <label htmlFor="cat2">Women's Clothing</label>
                    </div>
                    <div>
                        <input type="checkbox" id="cat3" name="cat3" value="jewelery" onClick={(e) => updateCategory(e)} />
                        <label htmlFor="cat3">Jewelery</label>
                    </div>
                    <div>
                        <input type="checkbox" id="cat4" name="cat4" value="electronics" onClick={(e) => updateCategory(e)} />
                        <label htmlFor="cat4">Electronics</label>
                    </div>
                </div>
                <div className={styles.cards}>
                    {filtered.map(product => {
                        return (
                            <div className={styles.card} key={product.id}>
                                <img className={styles.cardImg} src={product.image} alt={product.title} />
                                <h3 className={styles.cardTitle}>{product.title.slice(0,30)}...</h3>
                                <h2>&#8377;{product.price}</h2>
                                <button onClick={() => addToCart(product)}  className={styles.cardButton}>Add to cart</button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Home;