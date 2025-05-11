import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productoParaEditar: any = null;

  setProducto(producto: any) {
    this.productoParaEditar = producto;
  }

  getProducto() {
    return this.productoParaEditar;
  }

  limpiarProducto() {
    this.productoParaEditar = null;
  }
}
