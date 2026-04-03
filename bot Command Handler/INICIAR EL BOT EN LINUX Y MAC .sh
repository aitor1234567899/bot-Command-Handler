#!/bin/bash
# Iniciar el Bot de Discord automáticamente
# Este archivo ejecuta el bot cuando lo abres

clear
echo "========================================"
echo "   Bot de Discord - INICIANDO..."
echo "========================================"
echo ""

# Cambiar al directorio del script
cd "$(dirname "$0")"

# Ejecutar el bot con Node.js
node index.js

# Si el bot se detiene, mostrar un mensaje
echo ""
echo "========================================"
echo "   El bot se ha detenido."
echo "   Presiona ENTER para cerrar..."
echo "========================================"
read
