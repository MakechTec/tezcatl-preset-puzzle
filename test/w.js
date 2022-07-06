import React from 'react';

 export  const Simple = ( {  cart ,  children,   style,  } ) => {

    
    const [products, setproducts] = React.useState([]);
    

    
    React.useEffect(() => {
        initProducts();
    }, []);
    

    return(
        <div  style={style}  >
        
        {children}
        
        </div>
    );
}

