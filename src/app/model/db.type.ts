
export interface Produto {
    id: number;
    nome: string;
    marca: string;
    tipo_de_produto: string;
    cor: string;
    preco: number;
    descricao: string;
    foto_principal: string;
    foto_secundaria: string; 
    destaque: boolean;
  }
  

  export interface Utilizador {
    id: number;
    nome: string;
    email: string;
    senha: string;
    morada: string;
    codigo_postal: string;
    pais: string;
    admin: boolean;
  }
  

  export interface Wishlist {
    id: number;           
    produtoId: number;    
    userId: number;       
  }

  export interface Shoopingcart {
    id: number;           
    produtoId: number;    
    userId: number;       
  }