
let carrito ={} //carrito vacio


document.addEventListener ('DOMContentLoaded',()=> {
    fetchData()
    //evita que al actualizar se borre el carrito
    if(localStorage.getItem('carrito')){
        carrito=JSON.parse(localStorage.getItem('carrito'))
        MostrarCarrito()
    }
})

const cards=document.getElementById ('cards')
cards.addEventListener('click', e => {
    addCarrito(e)
})

//detectar el click del boton de cada card
const items = document.getElementById('items')

items.addEventListener('click',e => {
    btnAccion(e)
})



//para llamar los datos del JSON usamos fetch
const fetchData=async ()=> {
try{
    const res=await fetch ('api.json')
    const data= await res.json() 
    MostrarCards(data)
    }
catch (error) {
    console.log(error)
}
}

//muestra los elementos del json en el fragment utilizando el template de html, 
//utilizamos querySelector para llamar uno a uno los elementos. utilizamos esto para hacer un
//carrito de mayor tamaño y evitar reflow 
const fragment =document.createDocumentFragment()
const templateCard=document.getElementById ('templateCard').content //accede al contenido del template
 

const MostrarCards   = data => {
    data.forEach(producto => {
        templateCard.getElementById('imagen').setAttribute("src",producto.imagen)
    templateCard.getElementById('nombreProducto').textContent = producto.title
        templateCard.getElementById('precioProducto').textContent = producto.precio
        templateCard.getElementById('boton').dataset.id = producto.id
        const clone = templateCard.cloneNode(true) //
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}


    // console.log(e.target)
    // console.log(e.target.classList.contains('btn-dark'))  // solo apretando comprar da true
const addCarrito = e=>{   
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
}

//para agregar elementos al carrito
const setCarrito = objeto => {
    // console.log(objeto)
const producto = {
        id:objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    //aumentar unidades a la compra
    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad= carrito[producto.id].cantidad+1
    }
    carrito[producto.id]={...producto} //copia de producto
    MostrarCarrito()
    }

//area de carrito de compra
const templateCarrito=document.getElementById('templateCarrito').content    
const MostrarCarrito = () => {
    console.log(carrito)
    items.innerHTML='' //limpiar carrito
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent=producto.id
        templateCarrito.querySelectorAll('td')[0].textContent=producto.title //el [0] es por que hay varios th, formamos al array y accedemos al primer elemento
        templateCarrito.querySelectorAll('td')[1].textContent=producto.cantidad //el [1] es por que hay varios th, formams al array y accedemos al segundo elemento
        templateCarrito.querySelector('.btn-info').dataset.id=producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id=producto.id
        templateCarrito.querySelector('span').textContent=producto.cantidad * producto.precio //
        const clone = templateCarrito.cloneNode (true)
        fragment.appendChild (clone)
    })
    items.appendChild (fragment)
    MostrarTotal()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const Total = document.getElementById('Total')
//totales del carrito
const MostrarTotal = () => {
    Total.innerHTML=''
    if (Object.keys(carrito).length===0){
        Total.innerHTML=`<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    }
    //suma de cantidades y precios
    const nCantidad = Object.values (carrito).reduce((acc,{cantidad})=>acc+cantidad,0) 
    const nPrecio = Object.values (carrito).reduce((acc,{cantidad,precio})=>acc+cantidad * precio,0)
    console.log(nPrecio)
    

//nuestra totales en carrito
    const templateTotal=document.getElementById('templateTotal').content    
        templateTotal.querySelectorAll ('td')[0].textContent=nCantidad
    templateTotal.querySelector('span').textContent=nPrecio
   //
    const clone = templateTotal.cloneNode(true)
    fragment.appendChild(clone)

    Total.appendChild(fragment)


    //vaciar el carrito
    const btnVaciar= document.getElementById ('vaciar-carrito')
    btnVaciar.addEventListener('click',()=>{
        carrito={}
        MostrarCarrito()
    })
} 


const btnAccion =e => {
    //aumenta
    if (e.target.classList.contains ('btn-info')) {
        console.log (carrito[e.target.dataset.id])
        const producto=carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id]= {...producto}
        MostrarCarrito()
    }
    //disminuye
    if (e.target.classList.contains('btn-danger')) {
        const producto=carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad===0){
            delete carrito[e.target.dataset.id]
        }
        MostrarCarrito()
    }
}