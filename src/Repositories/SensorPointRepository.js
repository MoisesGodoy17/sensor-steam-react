import sqlite3 from 'sqlite3';
import SensorPointModel from '../Models/SensorPointModel.js';

// Inicializar conexión con la base de datos
const db = new sqlite3.Database('./sensor-steam-db.db');

// Crear la tabla si no existe
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS sensor_points (
            id_point_sensor INTEGER PRIMARY KEY AUTOINCREMENT,
            id_sensor TEXT NOT NULL,
            id_players TEXT NOT NULL,
            data_point TEXT NOT NULL,
            date_time TEXT NOT NULL,
            hours_played TEXT NOT NULL
        )
    `);
});

class SensorPointRepository {
    // Crear un punto de sensor
    static createSensorPoint(sensorPoint) {
        if (!(sensorPoint instanceof SensorPointModel)) {
            throw new Error(
                'El punto de sensor debe ser una instancia de SensorPointModel'
            );
        }

        const query = `
            INSERT INTO sensor_points (id_sensor, id_players, data_point, date_time, hours_played)
            VALUES (?, ?, ?, ?, ?)
        `;

        return new Promise((resolve, reject) => {
            db.run(
                query,
                [
                    sensorPoint.id_sensor,
                    sensorPoint.id_players,
                    sensorPoint.data_point,
                    sensorPoint.date_time,
                    sensorPoint.hours_played,
                ],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID); // Retorna el ID del último registro insertado
                    }
                }
            );
        });
    }

    // Obtener todos los puntos de sensor
    static getAllSensorPoints() {
        const query = 'SELECT * FROM sensor_points';

        return new Promise((resolve, reject) => {
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    // Mapear filas a instancias de SensorPointModel
                    const sensorPoints = rows.map(
                        (row) =>
                            new SensorPointModel(
                                row.id_point_sensor,
                                row.id_sensor,
                                row.id_players,
                                row.data_point,
                                row.date_time,
                                row.hours_played
                            )
                    );
                    resolve(sensorPoints);
                }
            });
        });
    }
}

export default SensorPointRepository;