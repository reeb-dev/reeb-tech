window.GESTION_SEED = {
  items: [
    { id: "p1", codigo: "7790001001001", nombre: "Aceite girasol 900 ml", categoria: "Almacén", proveedor: "Distribuidora Sur", stock: 24, minimo: 10, precio: 1850, ubicacion: "Góndola A1", foto: "img/productos/aceite.jpg" },
    { id: "p2", codigo: "7790001002008", nombre: "Arroz largo fino 1 kg", categoria: "Almacén", proveedor: "Distribuidora Sur", stock: 8, minimo: 15, precio: 980, ubicacion: "Góndola A2", foto: "img/productos/arroz.jpg" },
    { id: "p3", codigo: "7790001003005", nombre: "Fideos penne 500 g", categoria: "Almacén", proveedor: "Alimentos Andinos", stock: 40, minimo: 12, precio: 720, ubicacion: "Góndola A2", foto: "img/productos/fideos.jpg" },
    { id: "p4", codigo: "7790001004002", nombre: "Detergente limón 750 ml", categoria: "Limpieza", proveedor: "Limpieza Norte", stock: 5, minimo: 8, precio: 1450, ubicacion: "Pasillo B", foto: "img/productos/detergente.jpg" },
    { id: "p5", codigo: "QR-DEPO-77821", nombre: "Caja resma A4", categoria: "Papelería", proveedor: "Papelera Centro", stock: 18, minimo: 6, precio: 4200, ubicacion: "Depósito", foto: "img/productos/resma.jpg" },
    { id: "p6", codigo: "7790001005009", nombre: "Yerba mate 1 kg", categoria: "Almacén", proveedor: "Distribuidora Sur", stock: 3, minimo: 10, precio: 3200, ubicacion: "Góndola A3", foto: "img/productos/yerba.jpg" },
    { id: "p7", codigo: "7790001006006", nombre: "Azúcar 1 kg", categoria: "Almacén", proveedor: "Alimentos Andinos", stock: 35, minimo: 10, precio: 1100, ubicacion: "Góndola A3", foto: "img/productos/azucar.jpg" },
    { id: "p8", codigo: "7790001007003", nombre: "Lavandina 1 L", categoria: "Limpieza", proveedor: "Limpieza Norte", stock: 14, minimo: 6, precio: 890, ubicacion: "Pasillo B", foto: "img/productos/lavandina.jpg" },
    { id: "p9", codigo: "7790001008000", nombre: "Agua mineral 2 L", categoria: "Bebidas", proveedor: "Bebidas del Sur", stock: 48, minimo: 20, precio: 650, ubicacion: "Cámara", foto: "img/productos/agua.jpg" },
    { id: "p10", codigo: "QR-DEPO-99001", nombre: "Caja vasos descartables", categoria: "Descartables", proveedor: "Papelera Centro", stock: 2, minimo: 5, precio: 2800, ubicacion: "Depósito", foto: "img/productos/vasos.jpg" },
    { id: "p11", codigo: "7790001009007", nombre: "Galletitas surtidas 400 g", categoria: "Almacén", proveedor: "Distribuidora Sur", stock: 22, minimo: 8, precio: 1580, ubicacion: "Góndola A4", foto: "img/productos/galletitas.jpg" },
    { id: "p12", codigo: "7790001010003", nombre: "Jabón en polvo 800 g", categoria: "Limpieza", proveedor: "Limpieza Norte", stock: 11, minimo: 6, precio: 2100, ubicacion: "Pasillo B", foto: "img/productos/jabon.jpg" }
  ],
  clientes: [
    { id: "c1", nombre: "Kiosco Lo de Ana", tel: "291 455-1200", direccion: "Alsina 450, Bahía Blanca", zona: "Centro", lat: -38.7185, lng: -62.2655, saldo: 28500, estado: "activo", nota: "Compra semanal · cobro viernes", ultimoPedido: "2026-09-10" },
    { id: "c2", nombre: "Almacén Sur", tel: "291 455-2211", direccion: "Brown 1800, Bahía Blanca", zona: "Sur", lat: -38.7322, lng: -62.2788, saldo: 64200, estado: "activo", nota: "Mayorista chico · mínimo $40.000", ultimoPedido: "2026-09-11" },
    { id: "c3", nombre: "Rotisería Sol", tel: "291 455-3344", direccion: "Donado 320, Bahía Blanca", zona: "Norte", lat: -38.7098, lng: -62.2521, saldo: 0, estado: "activo", nota: "Pedido los viernes", ultimoPedido: "2026-09-05" },
    { id: "c4", nombre: "Casa Pérez", tel: "291 455-4455", direccion: "Sarmiento 980, Bahía Blanca", zona: "Centro", lat: -38.7255, lng: -62.261, saldo: 4200, estado: "activo", nota: "Particular · fiado chico", ultimoPedido: "2026-09-08" },
    { id: "c5", nombre: "Maxikiosco 9 de Julio", tel: "291 455-5566", direccion: "9 de Julio 1550, Bahía Blanca", zona: "Oeste", lat: -38.721, lng: -62.2855, saldo: 15800, estado: "mora", nota: "Debe factura 214", ultimoPedido: "2026-08-28" },
    { id: "c6", nombre: "Panadería El Trigal", tel: "291 455-6677", direccion: "España 720, Bahía Blanca", zona: "Norte", lat: -38.7055, lng: -62.2588, saldo: 0, estado: "activo", nota: "Retira en depósito", ultimoPedido: "2026-09-09" },
    { id: "c7", nombre: "Clínica del Parque", tel: "291 455-7788", direccion: "Parque de Mayo 200, Bahía Blanca", zona: "Este", lat: -38.716, lng: -62.2455, saldo: 9100, estado: "activo", nota: "Pedidos de limpieza", ultimoPedido: "2026-09-07" },
    { id: "c8", nombre: "Bar La Esquina", tel: "291 455-8899", direccion: "Chiclana 1100, Bahía Blanca", zona: "Centro", lat: -38.7198, lng: -62.2702, saldo: 22300, estado: "activo", nota: "Bebidas y descartables", ultimoPedido: "2026-09-11" }
  ],
  movs: [
    { id: "m1", fecha: "2026-09-11", hora: "09:15", codigo: "7790001001001", tipo: "entrada", cant: 12, nota: "Remito Sur #4412", cliente: "" },
    { id: "m2", fecha: "2026-09-11", hora: "10:40", codigo: "7790001002008", tipo: "salida", cant: 4, nota: "Pedido Almacén Sur", cliente: "c2" },
    { id: "m3", fecha: "2026-09-11", hora: "11:05", codigo: "7790001005009", tipo: "salida", cant: 2, nota: "Mostrador", cliente: "" },
    { id: "m4", fecha: "2026-09-10", hora: "16:20", codigo: "7790001008000", tipo: "salida", cant: 10, nota: "Bar La Esquina", cliente: "c8" },
    { id: "m5", fecha: "2026-09-10", hora: "12:00", codigo: "QR-DEPO-99001", tipo: "salida", cant: 3, nota: "Rotisería Sol", cliente: "c3" },
    { id: "m6", fecha: "2026-09-09", hora: "15:30", codigo: "7790001004002", tipo: "entrada", cant: 8, nota: "Limpieza Norte", cliente: "" }
  ],
  facturas: [
    {
      id: "f1",
      nro: "0001-00000214",
      fecha: "2026-08-28",
      clienteId: "c5",
      estado: "impaga",
      pago: "cuenta corriente",
      lineas: [
        { itemId: "p4", cant: 4, precio: 1450 },
        { itemId: "p8", cant: 6, precio: 890 },
        { itemId: "p12", cant: 2, precio: 2100 }
      ]
    },
    {
      id: "f2",
      nro: "0001-00000215",
      fecha: "2026-09-10",
      clienteId: "c8",
      estado: "cobrada",
      pago: "efectivo",
      lineas: [
        { itemId: "p9", cant: 10, precio: 650 },
        { itemId: "p10", cant: 2, precio: 2800 }
      ]
    },
    {
      id: "f3",
      nro: "0001-00000216",
      fecha: "2026-09-11",
      clienteId: "c2",
      estado: "cobrada",
      pago: "transferencia",
      lineas: [
        { itemId: "p2", cant: 4, precio: 980 },
        { itemId: "p1", cant: 6, precio: 1850 },
        { itemId: "p7", cant: 8, precio: 1100 }
      ]
    }
  ],
  caja: [
    { id: "k1", fecha: "2026-09-11", hora: "09:20", tipo: "ingreso", concepto: "Cobro factura 0001-00000216 · Almacén Sur", monto: 24720, facturaId: "f3" },
    { id: "k2", fecha: "2026-09-11", hora: "11:10", tipo: "egreso", concepto: "Pago a Distribuidora Sur · remito 4412", monto: 42000, facturaId: "" },
    { id: "k3", fecha: "2026-09-10", hora: "16:45", tipo: "ingreso", concepto: "Cobro factura 0001-00000215 · Bar La Esquina", monto: 12100, facturaId: "f2" },
    { id: "k4", fecha: "2026-09-10", hora: "18:00", tipo: "egreso", concepto: "Combustible reparto", monto: 18500, facturaId: "" },
    { id: "k5", fecha: "2026-09-09", hora: "12:30", tipo: "ingreso", concepto: "Mostrador · venta menor", monto: 6400, facturaId: "" }
  ]
};
