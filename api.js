const fs = require('fs')

class Contenedor {
    constructor(file) {
        this.file = file;
    }
    // Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
    async save(object) {
        try {
            const contenido = await fs.promises.readFile(`./${this.file}`, 'utf8')
                ;
            if (contenido === '') {
                object.id = 1;
                array.push(object);
            } else {
                const arrayObtenido = JSON.parse(contenido);
                const existe = arrayObtenido.find((item => item.id === object.id))
                if (existe) {
                    let indexObject = arrayObtenido.findIndex((item => item.id === object.id))
                    arrayObtenido[indexObject] = object
                } else {
                    object.id = arrayObtenido[arrayObtenido.length - 1].id + 1;
                    arrayObtenido.push(object);
                }
                array = arrayObtenido;
            }
            const objectsString = JSON.stringify(array, null, 2);
            await fs.promises.writeFile(`./${this.file}`, objectsString);
            return object.id;
        } catch (error) {
            console.log('error al ejecutar',{ error })
        }
    }
    // Recibe un id y devuelve el objeto con ese id, o null si no está.
    async getById(id) {
        try {
            const contenido = await fs.promises.readFile(`./${this.file}`, 'utf8');
            const arrayObtenido = JSON.parse(contenido);
            let objectEncontrado = null
            arrayObtenido.map((object) => {
                if (object.id === id) {
                    objectEncontrado = object;
                }
            })
            return objectEncontrado;
        } catch (error) {
            console.log('error al ejecutar',{ error })
        }
    }
    // Devuelve un array con los objetos presentes en el archivo.
    async getAll() {
        try {
            const contenido = await fs.promises.readFile(`./${this.file}`, 'utf8')
            if (contenido === '') {
                return [];
            } else {
                const arrayObtenido = JSON.parse(contenido);
                return arrayObtenido;
            };
        } catch (error) {
            console.log('error al ejecutar',{ error })
        };
    };
    // const obtenerRandomInferior = (min, max) => Math.round(Math.random() * (max - min + 1)) + min;
    async getRandom() {
        const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        try {
            const contenido = await fs.promises.readFile(`./${this.file}`, 'utf8')
            const arrayObtenido = JSON.parse(contenido);
            const posicionRandom = random(0, arrayObtenido.length - 1);
            return (arrayObtenido[posicionRandom]);
        } catch (error) {
            console.log('error al ejecutar',{ error })
        }
    }
    // Elimina del archivo el objeto con el id buscado.
    async deleteById(id) {
        try {
            const contenido = await fs.promises.readFile(`./${this.file}`, 'utf8');
            const arrayObtenido = JSON.parse(contenido);
            let encontrado = false
            arrayObtenido.map((object) => {
                if (object.id === id) {
                    encontrado = true
                    let indice = arrayObtenido.indexOf(object);
                    arrayObtenido.splice(indice, 1);
                };
            });
            const arrayString = JSON.stringify(arrayObtenido, null, 2);
            await fs.promises.writeFile(`./${this.file}`, arrayString);
            return encontrado
        } catch (error) {
            console.log('error al ejecutar',{ error });
        };
    };
    // Elimina todos los objetos presentes en el archivo.
    async deleteAll() {
        try {
            await fs.promises.writeFile(`./${this.file}`, '')
        } catch (error) {
            console.log('error al ejecutar',{ error })
        }
    }
    // Recibe y actualiza un producto según su id.
    async updateById(prod, id) {
        try {
            const producto = await this.getById(id);
            if (!producto) {
                return producto
            }
            const productoUpdated = {
                ...producto,
                ...prod
            }
            await this.save(productoUpdated)
            return productoUpdated;
        } catch (error) {
            console.log('error al ejecutar',{ error })
        }
    }
};

module.exports = Contenedor;